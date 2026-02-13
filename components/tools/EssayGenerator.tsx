"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { FileEdit, Loader2, Download, Copy } from "lucide-react";
import { useState } from "react";
import { useChat } from "ai/react";

export function EssayGenerator() {
    const [topic, setTopic] = useState("");
    const [context, setContext] = useState("");
    const [essayType, setEssayType] = useState("argumentative");
    const [wordCount, setWordCount] = useState("500");
    const [isGenerating, setIsGenerating] = useState(false);
    const [essay, setEssay] = useState("");

    const generateEssay = async () => {
        if (!topic.trim()) return;

        setIsGenerating(true);
        setEssay("");

        try {
            const response = await fetch("/api/generate-essay", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    topic,
                    context,
                    essayType,
                    wordCount: parseInt(wordCount),
                }),
            });

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value);
                    setEssay((prev) => prev + chunk);
                }
            }
        } catch (error) {
            console.error("Error generating essay:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(essay);
    };

    const downloadEssay = () => {
        const blob = new Blob([essay], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `ensayo-${topic.substring(0, 30)}.txt`;
        a.click();
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <FileEdit className="h-5 w-5" />
                <h3 className="font-semibold">Generador de Ensayos</h3>
            </div>

            <Card className="p-6 space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="topic">Tema del Ensayo</Label>
                    <Input
                        id="topic"
                        placeholder="Ej: El impacto de la inteligencia artificial en la educación"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="type">Tipo de Ensayo</Label>
                        <Select value={essayType} onValueChange={setEssayType}>
                            <SelectTrigger id="type">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="argumentative">Argumentativo</SelectItem>
                                <SelectItem value="expository">Expositivo</SelectItem>
                                <SelectItem value="narrative">Narrativo</SelectItem>
                                <SelectItem value="descriptive">Descriptivo</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="words">Palabras Aprox.</Label>
                        <Select value={wordCount} onValueChange={setWordCount}>
                            <SelectTrigger id="words">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="300">300 palabras</SelectItem>
                                <SelectItem value="500">500 palabras</SelectItem>
                                <SelectItem value="750">750 palabras</SelectItem>
                                <SelectItem value="1000">1000 palabras</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="context">Contexto Adicional (Opcional)</Label>
                    <Textarea
                        id="context"
                        placeholder="Añade información adicional, puntos clave que quieres incluir..."
                        value={context}
                        onChange={(e) => setContext(e.target.value)}
                        className="min-h-[100px]"
                    />
                </div>

                <Button onClick={generateEssay} disabled={!topic || isGenerating} className="w-full">
                    {isGenerating ? (
                        <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Generando...
                        </>
                    ) : (
                        <>
                            <FileEdit className="h-4 w-4 mr-2" />
                            Generar Ensayo
                        </>
                    )}
                </Button>
            </Card>

            {essay && (
                <Card className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h4 className="font-semibold">Ensayo Generado</h4>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={copyToClipboard}>
                                <Copy className="h-4 w-4 mr-2" />
                                Copiar
                            </Button>
                            <Button variant="outline" size="sm" onClick={downloadEssay}>
                                <Download className="h-4 w-4 mr-2" />
                                Descargar
                            </Button>
                        </div>
                    </div>
                    <div className="prose prose-sm max-w-none">
                        <div className="whitespace-pre-wrap text-sm leading-relaxed">
                            {essay}
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
}
