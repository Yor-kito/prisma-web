"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Podcast, Download, Play, Pause, Volume2, StopCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Slider } from "@/components/ui/slider";

interface PodcastPlayerProps {
    pdfText: string;
    documentId?: string;
    onScriptGenerated?: (script: string) => void;
}

export function PodcastPlayer({ pdfText, documentId, onScriptGenerated }: PodcastPlayerProps) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [script, setScript] = useState<string | null>(null);
    const [estimatedDuration, setEstimatedDuration] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [volume, setVolume] = useState([100]);
    const [error, setError] = useState<string | null>(null);

    // Progress tracking
    const [segments, setSegments] = useState<string[]>([]);
    const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
    const [progress, setProgress] = useState([0]);

    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
    const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Load existing script if any
    useEffect(() => {
        if (documentId) {
            const documents = JSON.parse(localStorage.getItem("prisma-documents") || "[]");
            const doc = documents.find((d: any) => d.id === documentId);
            if (doc?.podcastScript) {
                setScript(doc.podcastScript);
                const sentences = doc.podcastScript.match(/[^.!?]+[.!?]+/g) || [doc.podcastScript];
                setSegments(sentences);
            }
        }
    }, [documentId]);

    const generatePodcast = async () => {
        if (!pdfText) return;

        setIsGenerating(true);
        setError(null);
        try {
            const response = await fetch('/api/generate-podcast', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ context: pdfText }),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to generate podcast');
            }

            setScript(data.script);
            setEstimatedDuration(data.estimatedDuration || 0);
            if (onScriptGenerated) onScriptGenerated(data.script);

            // Split script into sentences for seekable playback
            const sentences = data.script.match(/[^.!?]+[.!?]+/g) || [data.script];
            setSegments(sentences);
            setCurrentSegmentIndex(0);
            setProgress([0]);

            // Save to document
            if (documentId) {
                const documents = JSON.parse(localStorage.getItem("prisma-documents") || "[]");
                const updatedDocs = documents.map((d: any) =>
                    d.id === documentId ? { ...d, podcastScript: data.script } : d
                );
                localStorage.setItem("prisma-documents", JSON.stringify(updatedDocs));
            }

            // Update stats
            const stats = JSON.parse(localStorage.getItem("prisma-stats") || "{}");
            stats.podcastsCreated = (stats.podcastsCreated || 0) + 1;
            localStorage.setItem("prisma-stats", JSON.stringify(stats));
        } catch (error: any) {
            console.error("Failed to generate podcast", error);
            setError(error.message || 'Error al generar el podcast');
        } finally {
            setIsGenerating(false);
        }
    };

    const playSegment = (index: number) => {
        if (index >= segments.length || index < 0) {
            setIsPlaying(false);
            setIsPaused(false);
            setProgress([100]);
            return;
        }

        speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(segments[index]);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.volume = volume[0] / 100;
        utterance.lang = 'es-ES';

        utterance.onstart = () => {
            setIsPlaying(true);
            setIsPaused(false);
            setCurrentSegmentIndex(index);
        };

        utterance.onend = () => {
            // Auto-play next segment
            if (index < segments.length - 1) {
                playSegment(index + 1);
            } else {
                setIsPlaying(false);
                setIsPaused(false);
                setProgress([100]);
            }
        };

        utterance.onerror = (event: any) => {
            // Don't treat "interrupted" as an error - it's expected when user stops/pauses
            if (event?.error === 'interrupted' || event?.error === 'canceled') {
                console.log('Speech synthesis interrupted (user action)');
                return;
            }

            console.error('Speech synthesis error:', event?.error || 'Unknown error', event);
            setIsPlaying(false);
            setIsPaused(false);

            if (event?.error === 'not-allowed') {
                setError('Permiso denegado. Por favor, permite el audio en tu navegador.');
            } else if (event?.error === 'network') {
                setError('Error de red. Verifica tu conexión.');
            } else {
                setError('Error al reproducir el audio. Intenta de nuevo.');
            }
        };

        speechSynthesis.speak(utterance);
        utteranceRef.current = utterance;

        // Update progress
        const progressPercent = (index / segments.length) * 100;
        setProgress([progressPercent]);
    };

    const handlePlay = () => {
        if (!script || segments.length === 0) return;

        if (!('speechSynthesis' in window)) {
            setError('Tu navegador no soporta síntesis de voz. Prueba con Chrome o Edge.');
            return;
        }

        if (isPaused && speechSynthesis.paused) {
            speechSynthesis.resume();
            setIsPaused(false);
            setIsPlaying(true);
            return;
        }

        if (speechSynthesis.speaking && !speechSynthesis.paused) {
            return;
        }

        playSegment(currentSegmentIndex);
    };

    const handleSeek = (value: number[]) => {
        const newProgress = value[0];
        const newIndex = Math.floor((newProgress / 100) * segments.length);

        setProgress(value);
        setCurrentSegmentIndex(newIndex);

        if (isPlaying) {
            speechSynthesis.cancel();
            playSegment(newIndex);
        }
    };

    const handlePause = () => {
        if (speechSynthesis.speaking && !speechSynthesis.paused) {
            speechSynthesis.pause();
            setIsPlaying(false);
            setIsPaused(true);
        }
    };

    const handleStop = () => {
        speechSynthesis.cancel();
        setIsPlaying(false);
        setIsPaused(false);
    };

    const handleVolumeChange = (newValue: number[]) => {
        setVolume(newValue);
        if (utteranceRef.current && speechSynthesis.speaking) {
            // Volume can't be changed mid-speech, need to restart
            // For now, just update for next play
        }
    };

    const handleDownload = () => {
        if (!script) return;

        const blob = new Blob([script], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `podcast-script-${Date.now()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    useEffect(() => {
        return () => {
            speechSynthesis.cancel();
        };
    }, []);

    if (!script) {
        return (
            <Card className="p-6">
                <div className="flex flex-col items-center gap-4 text-center">
                    <div className="p-4 bg-primary/10 rounded-full">
                        <Podcast className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">Audio Study Guide</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Generate a podcast-style audio summary perfect for studying on the go
                        </p>
                    </div>

                    {error && (
                        <div className="w-full p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                            <p className="text-sm text-destructive font-medium">{error}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Intenta de nuevo en unos segundos
                            </p>
                        </div>
                    )}

                    <Button onClick={generatePodcast} disabled={!pdfText || isGenerating}>
                        {isGenerating ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Podcast className="h-4 w-4 mr-2" />
                                Generate Podcast
                            </>
                        )}
                    </Button>
                </div>
            </Card>
        );
    }

    return (
        <Card className="p-6">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold flex items-center gap-2">
                        <Podcast className="h-4 w-4" />
                        Audio Study Guide
                    </h3>
                    <span className="text-sm text-muted-foreground">
                        ~{estimatedDuration} min
                    </span>
                </div>

                {/* Status indicator */}
                <div className="flex items-center gap-2 text-sm">
                    {isPlaying && (
                        <div className="flex items-center gap-2 text-primary">
                            <div className="h-2 w-2 bg-primary rounded-full animate-pulse" />
                            <span>Playing...</span>
                        </div>
                    )}
                    {isPaused && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Pause className="h-3 w-3" />
                            <span>Paused</span>
                        </div>
                    )}
                    {!isPlaying && !isPaused && (
                        <div className="text-muted-foreground">
                            Ready to play
                        </div>
                    )}
                </div>

                {/* Error message */}
                {error && (
                    <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                        <p className="text-sm text-destructive font-medium">{error}</p>
                    </div>
                )}

                {/* Controls */}
                <div className="flex items-center gap-2">
                    <Button
                        onClick={isPlaying ? handlePause : handlePlay}
                        className="flex-1"
                        disabled={!script}
                    >
                        {isPlaying ? (
                            <>
                                <Pause className="h-4 w-4 mr-2" />
                                Pause
                            </>
                        ) : (
                            <>
                                <Play className="h-4 w-4 mr-2" />
                                {isPaused ? 'Resume' : 'Play'}
                            </>
                        )}
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handleStop}
                        disabled={!isPlaying && !isPaused}
                    >
                        <StopCircle className="h-4 w-4 mr-2" />
                        Stop
                    </Button>
                    <Button variant="outline" onClick={handleDownload}>
                        <Download className="h-4 w-4 mr-2" />
                        Script
                    </Button>
                </div>

                {/* Progress bar */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Progreso: {Math.round(progress[0])}%</span>
                    </div>
                    <Slider
                        value={progress}
                        onValueChange={handleSeek}
                        max={100}
                        step={1}
                        className="w-full cursor-pointer"
                    />
                </div>

                {/* Volume control */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Volume2 className="h-4 w-4" />
                        <span>Volume: {volume[0]}%</span>
                    </div>
                    <Slider
                        value={volume}
                        onValueChange={handleVolumeChange}
                        max={100}
                        step={1}
                        className="w-full"
                    />
                </div>

                {/* Script preview */}
                <div className="p-4 bg-muted/50 rounded-lg border">
                    <p className="text-xs text-muted-foreground mb-2 font-medium">Script Preview:</p>
                    <div className="text-sm max-h-40 overflow-y-auto">
                        <p className="whitespace-pre-wrap">{script.substring(0, 500)}...</p>
                    </div>
                </div>
            </div>
        </Card>
    );
}
