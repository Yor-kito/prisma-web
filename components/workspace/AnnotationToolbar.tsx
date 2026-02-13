"use client";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Highlighter, MessageSquarePlus, Trash2 } from "lucide-react";
import { useState } from "react";
import { HIGHLIGHT_COLORS, type HighlightColor } from "@/lib/annotations";
import { cn } from "@/lib/utils";

interface AnnotationToolbarProps {
    selectedText: string;
    onHighlight: (color: HighlightColor) => void;
    onAddNote: (color: HighlightColor, note: string) => void;
    onCancel: () => void;
    position: { x: number; y: number };
}

export function AnnotationToolbar({
    selectedText,
    onHighlight,
    onAddNote,
    onCancel,
    position,
}: AnnotationToolbarProps) {
    const [showNotePopover, setShowNotePopover] = useState(false);
    const [selectedColor, setSelectedColor] = useState<HighlightColor>('yellow');
    const [note, setNote] = useState('');

    const handleHighlight = (color: HighlightColor) => {
        onHighlight(color);
        onCancel();
    };

    const handleAddNote = () => {
        if (note.trim()) {
            onAddNote(selectedColor, note);
            setNote('');
            setShowNotePopover(false);
            onCancel();
        }
    };

    return (
        <div
            className="fixed z-50 flex gap-1 p-2 bg-popover border rounded-lg shadow-lg"
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
            }}
        >
            {/* Color buttons */}
            {(Object.keys(HIGHLIGHT_COLORS) as HighlightColor[]).map((color) => (
                <Button
                    key={color}
                    size="sm"
                    variant="ghost"
                    className={cn(
                        "h-8 w-8 p-0 hover:scale-110 transition-transform",
                        selectedColor === color && "ring-2 ring-primary"
                    )}
                    style={{ backgroundColor: HIGHLIGHT_COLORS[color] }}
                    onClick={() => handleHighlight(color)}
                    title={`Highlight ${color}`}
                >
                    <Highlighter className="h-4 w-4" />
                </Button>
            ))}

            {/* Add note button */}
            <Popover open={showNotePopover} onOpenChange={setShowNotePopover}>
                <PopoverTrigger asChild>
                    <Button size="sm" variant="ghost" className="h-8 px-2">
                        <MessageSquarePlus className="h-4 w-4 mr-1" />
                        Note
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                    <div className="space-y-3">
                        <div>
                            <label className="text-sm font-medium mb-2 block">Highlight Color</label>
                            <div className="flex gap-2">
                                {(Object.keys(HIGHLIGHT_COLORS) as HighlightColor[]).map((color) => (
                                    <button
                                        key={color}
                                        className={cn(
                                            "h-8 w-8 rounded border-2 transition-all",
                                            selectedColor === color ? "border-primary scale-110" : "border-transparent"
                                        )}
                                        style={{ backgroundColor: HIGHLIGHT_COLORS[color] }}
                                        onClick={() => setSelectedColor(color)}
                                    />
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-2 block">Note</label>
                            <Textarea
                                placeholder="Add your note here..."
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                rows={3}
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button size="sm" variant="ghost" onClick={() => setShowNotePopover(false)}>
                                Cancel
                            </Button>
                            <Button size="sm" onClick={handleAddNote} disabled={!note.trim()}>
                                Add Note
                            </Button>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>

            {/* Cancel button */}
            <Button size="sm" variant="ghost" className="h-8 px-2" onClick={onCancel}>
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    );
}
