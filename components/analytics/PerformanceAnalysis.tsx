"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, BarChart3, Target, Award } from "lucide-react";
import { useEffect, useState } from "react";

interface PerformanceData {
    weeklyActivity: number[];
    strongAreas: string[];
    weakAreas: string[];
    recommendations: string[];
    overallScore: number;
    trend: "up" | "down" | "stable";
}

export function PerformanceAnalysis() {
    const [data, setData] = useState<PerformanceData>({
        weeklyActivity: [0, 0, 0, 0, 0, 0, 0],
        strongAreas: [],
        weakAreas: [],
        recommendations: [],
        overallScore: 0,
        trend: "stable",
    });

    useEffect(() => {
        analyzePerformance();
    }, []);

    const analyzePerformance = () => {
        const stats = JSON.parse(
            localStorage.getItem("prisma-stats") ||
            '{"documentsUploaded":0,"chatMessages":0,"summariesGenerated":0,"podcastsCreated":0,"flashcardsCreated":0,"examsCompleted":0}'
        );

        // Calculate overall score with safety fallbacks
        const score = Math.min(
            100,
            ((stats.documentsUploaded || 0) * 10 +
                (stats.chatMessages || 0) * 2 +
                (stats.summariesGenerated || 0) * 5 +
                (stats.podcastsCreated || 0) * 8 +
                (stats.flashcardsCreated || 0) * 3 +
                (stats.examsCompleted || 0) * 15) || 0
        );

        // Determine strong and weak areas
        const strongAreas = [];
        const weakAreas = [];
        const recommendations = [];

        if (stats.examsCompleted > 5) {
            strongAreas.push("Práctica de Exámenes");
        } else if (stats.examsCompleted < 2) {
            weakAreas.push("Práctica de Exámenes");
            recommendations.push("Realiza más exámenes de práctica para evaluar tu conocimiento");
        }

        if (stats.flashcardsCreated > 20) {
            strongAreas.push("Memorización");
        } else if (stats.flashcardsCreated < 5) {
            weakAreas.push("Memorización");
            recommendations.push("Crea más flashcards para mejorar la retención");
        }

        if (stats.chatMessages > 50) {
            strongAreas.push("Aprendizaje Interactivo");
        } else if (stats.chatMessages < 10) {
            weakAreas.push("Aprendizaje Interactivo");
            recommendations.push("Usa más el chat socrático para profundizar en los temas");
        }

        if (stats.podcastsCreated > 3) {
            strongAreas.push("Aprendizaje Auditivo");
        }

        if (stats.summariesGenerated > 10) {
            strongAreas.push("Síntesis de Información");
        }

        // Determine trend
        const previousScore = parseInt(localStorage.getItem("previous-score") || "0");
        const trend = score > previousScore ? "up" : score < previousScore ? "down" : "stable";
        localStorage.setItem("previous-score", score.toString());

        // Generate weekly activity (mock data for now)
        const weeklyActivity = Array.from({ length: 7 }, () => Math.floor(Math.random() * 100));

        setData({
            weeklyActivity,
            strongAreas,
            weakAreas,
            recommendations,
            overallScore: score,
            trend,
        });
    };

    const maxActivity = Math.max(...data.weeklyActivity, 1);
    const days = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold flex items-center gap-2 mb-2">
                    <BarChart3 className="h-6 w-6" />
                    Análisis de Rendimiento
                </h2>
                <p className="text-muted-foreground">
                    Identifica tus fortalezas y áreas de mejora
                </p>
            </div>

            {/* Overall Score */}
            <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground mb-1">Puntuación General</p>
                        <p className="text-4xl font-bold">{isNaN(data.overallScore) ? 0 : data.overallScore}</p>
                    </div>
                    <div className="text-right">
                        {data.trend === "up" && (
                            <div className="flex items-center gap-2 text-green-500">
                                <TrendingUp className="h-6 w-6" />
                                <span className="font-semibold">Mejorando</span>
                            </div>
                        )}
                        {data.trend === "down" && (
                            <div className="flex items-center gap-2 text-red-500">
                                <TrendingDown className="h-6 w-6" />
                                <span className="font-semibold">En descenso</span>
                            </div>
                        )}
                        {data.trend === "stable" && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <span className="font-semibold">Estable</span>
                            </div>
                        )}
                    </div>
                </div>
            </Card>

            {/* Weekly Activity Chart */}
            <Card className="p-6">
                <h3 className="font-semibold mb-4">Actividad Semanal</h3>
                <div className="flex items-end justify-between gap-2 h-40">
                    {data.weeklyActivity.map((value, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center gap-2">
                            <div className="w-full bg-muted rounded-t-lg relative" style={{ height: "100%" }}>
                                <div
                                    className="absolute bottom-0 w-full bg-primary rounded-t-lg transition-all"
                                    style={{ height: `${(value / maxActivity) * 100}%` }}
                                />
                            </div>
                            <span className="text-xs text-muted-foreground">{days[index]}</span>
                        </div>
                    ))}
                </div>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Strong Areas */}
                <Card className="p-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <Award className="h-5 w-5 text-green-500" />
                        Áreas Fuertes
                    </h3>
                    {data.strongAreas.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                            Sigue estudiando para identificar tus fortalezas
                        </p>
                    ) : (
                        <div className="space-y-2">
                            {data.strongAreas.map((area, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-green-500" />
                                    <span className="text-sm">{area}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>

                {/* Weak Areas */}
                <Card className="p-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <Target className="h-5 w-5 text-orange-500" />
                        Áreas de Mejora
                    </h3>
                    {data.weakAreas.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                            ¡Excelente! No hay áreas débiles identificadas
                        </p>
                    ) : (
                        <div className="space-y-2">
                            {data.weakAreas.map((area, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-orange-500" />
                                    <span className="text-sm">{area}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            </div>

            {/* Recommendations */}
            {data.recommendations.length > 0 && (
                <Card className="p-6">
                    <h3 className="font-semibold mb-4">Recomendaciones Personalizadas</h3>
                    <div className="space-y-3">
                        {data.recommendations.map((rec, index) => (
                            <div key={index} className="flex gap-3">
                                <Badge variant="outline" className="shrink-0">
                                    {index + 1}
                                </Badge>
                                <p className="text-sm">{rec}</p>
                            </div>
                        ))}
                    </div>
                </Card>
            )}
        </div>
    );
}
