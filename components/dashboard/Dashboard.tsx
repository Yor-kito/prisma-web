"use client";

import { Card } from "@/components/ui/card";
import { BookOpen, MessageSquare, FileText, Headphones, Brain, CheckCircle2, Folder, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Subject, SavedDocument } from "@/components/library/LibrarySystem";
import Link from "next/link";

interface StudyStats {
    documentsUploaded: number;
    chatMessages: number;
    summariesGenerated: number;
    podcastsCreated: number;
    flashcardsCreated: number;
    examsCompleted: number;
    studyTime: number; // in minutes
    streak: number; // days
}

export function Dashboard() {
    const [stats, setStats] = useState<StudyStats>({
        documentsUploaded: 0,
        chatMessages: 0,
        summariesGenerated: 0,
        podcastsCreated: 0,
        flashcardsCreated: 0,
        examsCompleted: 0,
        studyTime: 0,
        streak: 0,
    });
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [recentDocs, setRecentDocs] = useState<SavedDocument[]>([]);

    useEffect(() => {
        // Load stats from localStorage
        const savedStats = localStorage.getItem('prisma-stats');
        if (savedStats) {
            setStats(JSON.parse(savedStats));
        }

        // Load subjects and recent docs
        const savedSubjects = localStorage.getItem('prisma-subjects');
        const savedDocs = localStorage.getItem('prisma-documents');
        if (savedSubjects) setSubjects(JSON.parse(savedSubjects));
        if (savedDocs) {
            const docs = JSON.parse(savedDocs);
            // Sort by last accessed and take top 3
            setRecentDocs(docs.sort((a: any, b: any) => b.lastAccessed - a.lastAccessed).slice(0, 3));
        }
    }, []);

    const statCards = [
        {
            icon: BookOpen,
            label: "Documentos",
            value: stats.documentsUploaded,
            color: "text-blue-500",
            bgColor: "bg-blue-500/10",
        },
        {
            icon: MessageSquare,
            label: "Mensajes Chat",
            value: stats.chatMessages,
            color: "text-green-500",
            bgColor: "bg-green-500/10",
        },
        {
            icon: FileText,
            label: "Resúmenes",
            value: stats.summariesGenerated,
            color: "text-purple-500",
            bgColor: "bg-purple-500/10",
        },
        {
            icon: Headphones,
            label: "Podcasts",
            value: stats.podcastsCreated,
            color: "text-orange-500",
            bgColor: "bg-orange-500/10",
        },
        {
            icon: Brain,
            label: "Flashcards",
            value: stats.flashcardsCreated,
            color: "text-pink-500",
            bgColor: "bg-pink-500/10",
        },
        {
            icon: CheckCircle2,
            label: "Exámenes",
            value: stats.examsCompleted,
            color: "text-emerald-500",
            bgColor: "bg-emerald-500/10",
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold mb-2">Tu Progreso</h2>
                <p className="text-muted-foreground">
                    Racha actual: <span className="font-semibold text-primary">{stats.streak} días 🔥</span>
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {statCards.map((stat, index) => (
                    <Card key={index} className="p-4 hover:shadow-lg transition-shadow">
                        <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stat.value}</p>
                                <p className="text-sm text-muted-foreground">{stat.label}</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Asignaturas */}
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Folder className="h-4 w-4 text-primary" />
                            Tus Asignaturas
                        </h3>
                    </div>
                    {subjects.length === 0 ? (
                        <p className="text-sm text-muted-foreground italic">No has creado asignaturas todavía.</p>
                    ) : (
                        <div className="space-y-3">
                            {subjects.slice(0, 4).map((subject) => (
                                <div key={subject.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl">{subject.icon}</span>
                                        <span className="font-medium text-sm">{subject.name}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>

                {/* Continuar Estudiando */}
                <Card className="p-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-primary" />
                        Seguir Estudiando
                    </h3>
                    {recentDocs.length === 0 ? (
                        <p className="text-sm text-muted-foreground italic">No hay documentos recientes.</p>
                    ) : (
                        <div className="space-y-3">
                            {recentDocs.map((doc) => (
                                <Link key={doc.id} href={`/workspace/${doc.id}`}>
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-primary/5 transition-colors group cursor-pointer border mb-2">
                                        <div className="flex items-center gap-3">
                                            <FileText className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm font-medium truncate max-w-[150px] md:max-w-[200px]">{doc.name}</span>
                                        </div>
                                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </Card>
            </div>

            <Card className="p-6">
                <h3 className="font-semibold mb-4">Tiempo de Estudio</h3>
                <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">{stats.studyTime}</span>
                    <span className="text-muted-foreground">minutos esta semana</span>
                </div>
            </Card>
        </div>
    );
}
