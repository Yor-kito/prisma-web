"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Plus, Trash2, Clock, Target } from "lucide-react";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";

interface StudySession {
    id: string;
    subject: string;
    topic: string;
    date: string;
    duration: number; // minutes
    completed: boolean;
}

export function StudyPlanner() {
    const [sessions, setSessions] = useState<StudySession[]>([]);
    const [newSubject, setNewSubject] = useState("");
    const [newTopic, setNewTopic] = useState("");
    const [newDate, setNewDate] = useState("");
    const [newDuration, setNewDuration] = useState("60");

    useEffect(() => {
        const saved = localStorage.getItem("study-sessions");
        if (saved) {
            setSessions(JSON.parse(saved));
        }
    }, []);

    const saveSessions = (updated: StudySession[]) => {
        localStorage.setItem("study-sessions", JSON.stringify(updated));
        setSessions(updated);
    };

    const addSession = () => {
        if (!newSubject || !newTopic || !newDate) return;

        const session: StudySession = {
            id: Date.now().toString(),
            subject: newSubject,
            topic: newTopic,
            date: newDate,
            duration: parseInt(newDuration),
            completed: false,
        };

        saveSessions([...sessions, session]);
        setNewSubject("");
        setNewTopic("");
        setNewDate("");
        setNewDuration("60");
    };

    const toggleComplete = (id: string) => {
        const updated = sessions.map((s) =>
            s.id === id ? { ...s, completed: !s.completed } : s
        );
        saveSessions(updated);
    };

    const deleteSession = (id: string) => {
        saveSessions(sessions.filter((s) => s.id !== id));
    };

    const upcomingSessions = sessions
        .filter((s) => !s.completed && new Date(s.date) >= new Date())
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const completedSessions = sessions.filter((s) => s.completed);

    const totalPlannedHours = sessions.reduce((acc, s) => acc + s.duration, 0) / 60;
    const completedHours = completedSessions.reduce((acc, s) => acc + s.duration, 0) / 60;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Calendar className="h-6 w-6" />
                        Planificador de Estudio
                    </h2>
                    <p className="text-muted-foreground">
                        {completedHours.toFixed(1)}h / {totalPlannedHours.toFixed(1)}h completadas
                    </p>
                </div>
            </div>

            {/* Add Session Form */}
            <Card className="p-6 space-y-4">
                <h3 className="font-semibold">Nueva Sesión de Estudio</h3>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="subject">Asignatura</Label>
                        <Input
                            id="subject"
                            placeholder="Ej: Matemáticas"
                            value={newSubject}
                            onChange={(e) => setNewSubject(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="topic">Tema</Label>
                        <Input
                            id="topic"
                            placeholder="Ej: Derivadas"
                            value={newTopic}
                            onChange={(e) => setNewTopic(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="date">Fecha y Hora</Label>
                        <Input
                            id="date"
                            type="datetime-local"
                            value={newDate}
                            onChange={(e) => setNewDate(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="duration">Duración (minutos)</Label>
                        <Input
                            id="duration"
                            type="number"
                            min="15"
                            step="15"
                            value={newDuration}
                            onChange={(e) => setNewDuration(e.target.value)}
                        />
                    </div>
                </div>
                <Button onClick={addSession} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Añadir Sesión
                </Button>
            </Card>

            {/* Upcoming Sessions */}
            <div>
                <h3 className="font-semibold mb-3">Próximas Sesiones</h3>
                {upcomingSessions.length === 0 ? (
                    <Card className="p-8 text-center">
                        <Target className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                        <p className="text-muted-foreground">
                            No hay sesiones programadas
                        </p>
                    </Card>
                ) : (
                    <div className="space-y-2">
                        {upcomingSessions.map((session) => (
                            <Card key={session.id} className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-semibold">{session.subject}</h4>
                                            <Badge variant="outline">{session.topic}</Badge>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {new Date(session.date).toLocaleString('es-ES')}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {session.duration} min
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => toggleComplete(session.id)}
                                        >
                                            Completar
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => deleteSession(session.id)}
                                        >
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Completed Sessions */}
            {completedSessions.length > 0 && (
                <div>
                    <h3 className="font-semibold mb-3">Sesiones Completadas</h3>
                    <div className="space-y-2">
                        {completedSessions.slice(0, 5).map((session) => (
                            <Card key={session.id} className="p-3 opacity-60">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-sm">{session.subject} - {session.topic}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(session.date).toLocaleDateString('es-ES')} · {session.duration} min
                                        </p>
                                    </div>
                                    <Badge variant="secondary">✓ Completado</Badge>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
