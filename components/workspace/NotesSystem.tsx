"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { StickyNote, Trash2, Plus } from "lucide-react";
import { useState, useEffect } from "react";

interface Note {
    id: string;
    content: string;
    timestamp: number;
    pageNumber?: number;
}

interface NotesSystemProps {
    documentId?: string;
}

export function NotesSystem({ documentId }: NotesSystemProps) {
    const [notes, setNotes] = useState<Note[]>([]);
    const [newNote, setNewNote] = useState("");

    useEffect(() => {
        if (documentId) {
            const savedNotes = localStorage.getItem(`notes-${documentId}`);
            if (savedNotes) {
                setNotes(JSON.parse(savedNotes));
            }
        }
    }, [documentId]);

    const saveNotes = (updatedNotes: Note[]) => {
        if (documentId) {
            localStorage.setItem(`notes-${documentId}`, JSON.stringify(updatedNotes));
            setNotes(updatedNotes);
        }
    };

    const addNote = () => {
        if (!newNote.trim()) return;

        const note: Note = {
            id: Date.now().toString(),
            content: newNote,
            timestamp: Date.now(),
        };

        const updatedNotes = [note, ...notes];
        saveNotes(updatedNotes);
        setNewNote("");
    };

    const deleteNote = (id: string) => {
        const updatedNotes = notes.filter(note => note.id !== id);
        saveNotes(updatedNotes);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
                <StickyNote className="h-5 w-5" />
                <h3 className="font-semibold">Mis Notas</h3>
            </div>

            {/* New Note Input */}
            <div className="space-y-2">
                <Textarea
                    placeholder="Escribe una nota..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="min-h-[100px]"
                />
                <Button onClick={addNote} className="w-full" disabled={!newNote.trim()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Añadir Nota
                </Button>
            </div>

            {/* Notes List */}
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {notes.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                        No hay notas todavía. ¡Crea tu primera nota!
                    </p>
                ) : (
                    notes.map((note) => (
                        <Card key={note.id} className="p-4">
                            <div className="flex justify-between items-start gap-2">
                                <div className="flex-1">
                                    <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                                    <p className="text-xs text-muted-foreground mt-2">
                                        {new Date(note.timestamp).toLocaleString('es-ES')}
                                    </p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => deleteNote(note.id)}
                                    className="shrink-0"
                                >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
