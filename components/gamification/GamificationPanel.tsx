"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Flame, Star, Target, Award } from "lucide-react";
import { useEffect, useState } from "react";

interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    unlocked: boolean;
    unlockedAt?: number;
}

interface GamificationData {
    points: number;
    level: number;
    streak: number;
    achievements: Achievement[];
}

export function GamificationPanel() {
    const [data, setData] = useState<GamificationData>({
        points: 0,
        level: 1,
        streak: 0,
        achievements: [
            {
                id: "first-document",
                title: "Primer Paso",
                description: "Sube tu primer documento",
                icon: "📚",
                unlocked: false,
            },
            {
                id: "chat-master",
                title: "Conversador",
                description: "Envía 50 mensajes en el chat",
                icon: "💬",
                unlocked: false,
            },
            {
                id: "exam-ace",
                title: "Maestro de Exámenes",
                description: "Completa 10 exámenes",
                icon: "🎓",
                unlocked: false,
            },
            {
                id: "week-streak",
                title: "Constante",
                description: "Mantén una racha de 7 días",
                icon: "🔥",
                unlocked: false,
            },
            {
                id: "podcast-listener",
                title: "Oyente Dedicado",
                description: "Escucha 5 podcasts completos",
                icon: "🎧",
                unlocked: false,
            },
        ],
    });

    useEffect(() => {
        const savedData = localStorage.getItem('prisma-gamification');
        if (savedData) {
            setData(JSON.parse(savedData));
        }
    }, []);

    const pointsToNextLevel = 100 * data.level;
    const progress = (data.points % pointsToNextLevel) / pointsToNextLevel * 100;

    return (
        <div className="space-y-6">
            {/* Level & Points */}
            <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Trophy className="h-5 w-5 text-primary" />
                            <span className="text-sm font-medium text-muted-foreground">Nivel</span>
                        </div>
                        <p className="text-3xl font-bold">{data.level}</p>
                    </div>
                    <div className="text-right">
                        <div className="flex items-center gap-2 mb-1 justify-end">
                            <Star className="h-5 w-5 text-yellow-500" />
                            <span className="text-sm font-medium text-muted-foreground">Puntos</span>
                        </div>
                        <p className="text-3xl font-bold">{data.points}</p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Progreso al Nivel {data.level + 1}</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </Card>

            {/* Streak */}
            <Card className="p-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-orange-500/10 rounded-lg">
                        <Flame className="h-6 w-6 text-orange-500" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold">{data.streak} días</p>
                        <p className="text-sm text-muted-foreground">Racha actual</p>
                    </div>
                </div>
            </Card>

            {/* Achievements */}
            <div>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Logros
                </h3>
                <div className="grid grid-cols-2 gap-3">
                    {data.achievements.map((achievement) => (
                        <Card
                            key={achievement.id}
                            className={`p-4 ${achievement.unlocked ? 'border-primary' : 'opacity-50'}`}
                        >
                            <div className="text-center space-y-2">
                                <div className="text-3xl">{achievement.icon}</div>
                                <div>
                                    <p className="font-semibold text-sm">{achievement.title}</p>
                                    <p className="text-xs text-muted-foreground">{achievement.description}</p>
                                </div>
                                {achievement.unlocked && (
                                    <Badge variant="secondary" className="text-xs">
                                        Desbloqueado
                                    </Badge>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
