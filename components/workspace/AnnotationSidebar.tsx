"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Highlighter, MessageSquare, Trash2, Edit2, Check, X } from "lucide-react";
import { useState } from "react";
import type { Annotation, HighlightColor } from "@/lib/annotations";
import { HIGHLIGHT_COLORS } from "@/lib/annotations";

interface AnnotationSidebarProps {
    annotations: Annotation[];
    onJumpTo: (annotation: Annotation) => void;
    onEdit: (id: string, note: string) => void;
    onDelete: (id: string) => void;
}

export function AnnotationSidebar({
    annotations,
    onJumpTo,
    onEdit,
    onDelete,
}: AnnotationSidebarProps) {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editNote, setEditNote] = useState('');
    const [filterColor, setFilterColor] = useState<HighlightColor | null>(null);

    const filteredAnnotations = filterColor
        ? annotations.filter(a => a.color === filterColor)
        : annotations;

    const handleStartEdit = (annotation: Annotation) => {
        setEditingId(annotation.id);
        setEditNote(annotation.note || '');
    };

    const handleSaveEdit = (id: string) => {
        onEdit(id, editNote);
        setEditingId(null);
        setEditNote('');
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditNote('');
    };

    return (
        <div className="h-full flex flex-col">
            <div className="p-4 border-b">
                <h3 className="font-semibold flex items-center gap-2 mb-3">
                    <Highlighter className="h-4 w-4" />
                    Annotations ({annotations.length})
                </h3>
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        variant={filterColor === null ? "default" : "outline"}
                        onClick={() => setFilterColor(null)}
                        className="flex-1"
                    >
                        All
                    </Button>
                    {(Object.keys(HIGHLIGHT_COLORS) as HighlightColor[]).map((color) => (
                        <button
                            key={color}
                            className="h-8 w-8 rounded border-2 transition-all"
                            style={{
                                backgroundColor: HIGHLIGHT_COLORS[color],
                                borderColor: filterColor === color ? 'black' : 'transparent',
                            }}
                            onClick={() => setFilterColor(color)}
                            title={color}
                        />
                    ))}
                </div>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-4 space-y-3">
                    {filteredAnnotations.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-8">
                            No annotations yet. Select text in the PDF to get started.
                        </p>
                    ) : (
                        filteredAnnotations.map((annotation) => (
                            <Card
                                key={annotation.id}
                                className="p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                                onClick={() => onJumpTo(annotation)}
                            >
                                <div className="flex items-start gap-2">
                                    <div
                                        className="h-6 w-1 rounded flex-shrink-0 mt-1"
                                        style={{ backgroundColor: HIGHLIGHT_COLORS[annotation.color as HighlightColor] }}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-muted-foreground mb-1">
                                            Page {annotation.pageNumber}
                                        </p>
                                        <p className="text-sm font-medium line-clamp-2 mb-2">
                                            "{annotation.selectedText}"
                                        </p>

                                        {editingId === annotation.id ? (
                                            <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                                                <Input
                                                    value={editNote}
                                                    onChange={(e) => setEditNote(e.target.value)}
                                                    placeholder="Add a note..."
                                                    className="text-sm"
                                                />
                                                <div className="flex gap-1">
                                                    <Button size="sm" onClick={() => handleSaveEdit(annotation.id)}>
                                                        <Check className="h-3 w-3" />
                                                    </Button>
                                                    <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                                                        <X className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : annotation.note ? (
                                            <div className="flex items-start gap-2 mt-2 p-2 bg-muted rounded text-sm">
                                                <MessageSquare className="h-3 w-3 mt-0.5 flex-shrink-0" />
                                                <p className="flex-1 text-xs">{annotation.note}</p>
                                            </div>
                                        ) : null}
                                    </div>

                                    <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-7 w-7 p-0"
                                            onClick={() => handleStartEdit(annotation)}
                                        >
                                            <Edit2 className="h-3 w-3" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-7 w-7 p-0"
                                            onClick={() => onDelete(annotation.id)}
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}
