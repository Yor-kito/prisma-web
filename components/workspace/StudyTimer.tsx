"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Pause, RotateCcw, Coffee, Clock } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const WORK_TIME = 25 * 60; // 25 minutes in seconds
const BREAK_TIME = 5 * 60; // 5 minutes in seconds

export function StudyTimer() {
    const [timeLeft, setTimeLeft] = useState(WORK_TIME);
    const [isRunning, setIsRunning] = useState(false);
    const [isBreak, setIsBreak] = useState(false);
    const [sessions, setSessions] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        // Timer finished
                        handleTimerComplete();
                        return isBreak ? WORK_TIME : BREAK_TIME;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isRunning, isBreak]);

    const handleTimerComplete = () => {
        // Play notification sound if available
        try {
            const audio = new Audio('/notification.mp3');
            audio.play().catch(() => { });
        } catch { }

        // Show browser notification
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(isBreak ? '¡Break time over!' : '¡Work session complete!', {
                body: isBreak ? 'Time to focus again!' : 'Take a 5-minute break!',
                icon: '/icon.png',
            });
        }

        if (!isBreak) {
            setSessions(prev => prev + 1);
        }

        setIsBreak(prev => !prev);
        setIsRunning(false);
    };

    const handleStartPause = () => {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
        setIsRunning(prev => !prev);
    };

    const handleReset = () => {
        setIsRunning(false);
        setTimeLeft(isBreak ? BREAK_TIME : WORK_TIME);
    };

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <Card className={cn(
            "p-6 transition-colors",
            isBreak ? "bg-green-50 dark:bg-green-950/20 border-green-500/50" : "bg-primary/5 border-primary/20"
        )}>
            <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-2">
                    {isBreak ? (
                        <Coffee className="h-5 w-5 text-green-600" />
                    ) : (
                        <Clock className="h-5 w-5 text-primary" />
                    )}
                    <h3 className="font-semibold">
                        {isBreak ? 'Break Time' : 'Focus Time'}
                    </h3>
                </div>

                <div className="text-6xl font-bold tabular-nums">
                    {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </div>

                <div className="flex gap-2">
                    <Button onClick={handleStartPause} size="lg">
                        {isRunning ? (
                            <>
                                <Pause className="h-4 w-4 mr-2" />
                                Pause
                            </>
                        ) : (
                            <>
                                <Play className="h-4 w-4 mr-2" />
                                Start
                            </>
                        )}
                    </Button>
                    <Button onClick={handleReset} variant="outline" size="lg">
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset
                    </Button>
                </div>

                <div className="text-sm text-muted-foreground">
                    Sessions completed today: <span className="font-semibold">{sessions}</span>
                </div>
            </div>
        </Card>
    );
}
