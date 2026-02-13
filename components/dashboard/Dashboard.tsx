"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, MessageSquare, FileText, Headphones, Brain, CheckCircle2, Folder, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Subject, SavedDocument } from "@/components/library/LibrarySystem";
import Link from "next/link";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

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
    const [allDocs, setAllDocs] = useState<SavedDocument[]>([]);
    const [recentDocs, setRecentDocs] = useState<SavedDocument[]>([]);

    // Resource explorer state
    const [explorerOpen, setExplorerOpen] = useState(false);
    const [explorerType, setExplorerType] = useState<string>("");
    const [explorerItems, setExplorerItems] = useState<any[]>([]);

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
            setAllDocs(docs);
            // Sort by last accessed and take top 3
            setRecentDocs(docs.sort((a: any, b: any) => b.lastAccessed - a.lastAccessed).slice(0, 3));
        }
    }, []);

    const openExplorer = (type: string) => {
        let items: any[] = [];

        allDocs.forEach(doc => {
            const subject = subjects.find(s => s.id === doc.subjectId);

            if (type === "Flashcards" && doc.artifacts?.flashcards) {
                items.push({ docId: doc.id, docName: doc.name, subject, data: doc.artifacts.flashcards });
            } else if (type === "Exámenes" && doc.examQuestions) {
                items.push({ docId: doc.id, docName: doc.name, subject, data: doc.examQuestions });
            } else if (type === "Podcasts" && doc.podcastScript) {
                items.push({ docId: doc.id, docName: doc.name, subject, data: doc.podcastScript });
            } else if (type === "Resúmenes" && doc.artifacts?.mindMap) {
                items.push({ docId: doc.id, docName: doc.name, subject, data: doc.artifacts.mindMap });
            }
        });

        setExplorerType(type);
        setExplorerItems(items);
        setExplorerOpen(true);
    };

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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">¡Hola de nuevo! 👋</h2>
                    <p className="text-muted-foreground mt-1">
                        Hoy es un buen día para aprender algo nuevo.
                    </p>
                </div>
                <Card className="p-3 px-6 bg-primary/5 border-primary/20">
                    <p className="text-sm font-medium text-primary">Racha actual</p>
                    <p className="text-2xl font-bold">{stats.streak} días 🔥</p>
                </Card>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {statCards.map((stat, index) => (
                    <Card
                        key={index}
                        className={`p-4 hover:shadow-lg transition-all cursor-pointer border-transparent hover:border-primary/20 active:scale-95`}
                        onClick={() => ["Flashcards", "Exámenes", "Podcasts", "Resúmenes"].includes(stat.label) && openExplorer(stat.label)}
                    >
                        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3">
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

            {/* Explorador de Recursos */}
            <Dialog open={explorerOpen} onOpenChange={setExplorerOpen}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            Explorador de {explorerType}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                        {explorerItems.length === 0 ? (
                            <div className="text-center py-10 text-muted-foreground">
                                No has creado {explorerType.toLowerCase()} todavía.
                            </div>
                        ) : (
                            explorerItems.map((item, idx) => (
                                <div key={idx} className="border rounded-lg p-4 space-y-3">
                                    <div className="flex items-center justify-between border-b pb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg">{item.subject?.icon}</span>
                                            <span className="font-semibold">{item.docName}</span>
                                        </div>
                                        <Link href={`/workspace/${item.docId}`}>
                                            <Button size="sm" variant="outline">Abrir Lección</Button>
                                        </Link>
                                    </div>

                                    {explorerType === "Flashcards" && (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {item.data.slice(0, 4).map((f: any, i: number) => (
                                                <div key={i} className="text-xs p-2 bg-muted rounded">
                                                    <p className="font-bold">P: {f.front}</p>
                                                </div>
                                            ))}
                                            {item.data.length > 4 && <p className="text-[10px] text-muted-foreground">... y {item.data.length - 4} más</p>}
                                        </div>
                                    )}

                                    {explorerType === "Exámenes" && (
                                        <div className="text-sm italic text-muted-foreground">
                                            Examen generado con {item.data.length} preguntas.
                                        </div>
                                    )}

                                    {explorerType === "Podcasts" && (
                                        <div className="text-sm line-clamp-2 italic text-muted-foreground">
                                            "{item.data.substring(0, 100)}..."
                                        </div>
                                    )}

                                    {explorerType === "Resúmenes" && (
                                        <div className="text-sm text-muted-foreground">
                                            Mapa mental y resumen listos para repasar.
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </DialogContent>
            </Dialog>

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
