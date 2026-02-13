import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Sparkles, Bot, User, Loader2, Image as ImageIcon, Mic, X } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { VoiceInput } from "@/components/voice/VoiceInput";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { Subject } from "@/components/library/LibrarySystem";

interface ChatInterfaceProps {
    initialContext?: string;
    documentId?: string;
}

interface Attachment {
    type: 'image';
    image: string; // base64
    preview: string; // blob url for UI
}

export function ChatInterface({ initialContext, documentId }: ChatInterfaceProps) {
    const router = useRouter();
    const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
    const [input, setInput] = useState("");
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Save dialog state
    const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
    const [lessonName, setLessonName] = useState("");
    const [selectedSubjectId, setSelectedSubjectId] = useState("");
    const [subjects, setSubjects] = useState<Subject[]>([]);

    useEffect(() => {
        const savedSubjects = localStorage.getItem("prisma-subjects");
        if (savedSubjects) {
            setSubjects(JSON.parse(savedSubjects));
        }
    }, [isSaveDialogOpen]);

    const handleSaveAsLesson = () => {
        if (!lessonName.trim() || !selectedSubjectId || messages.length === 0) return;

        const newId = Date.now().toString();
        const newDoc = {
            id: newId,
            name: lessonName,
            subjectId: selectedSubjectId,
            uploadedAt: Date.now(),
            lastAccessed: Date.now(),
            pdfUrl: "",
            pdfText: "",
            chatHistory: messages
        };

        const documents = JSON.parse(localStorage.getItem("prisma-documents") || "[]");
        localStorage.setItem("prisma-documents", JSON.stringify([...documents, newDoc]));

        setIsSaveDialogOpen(false);
        router.push(`/workspace/${newId}`);
    };

    // Load messages from localStorage on mount or when documentId changes
    useEffect(() => {
        if (documentId && documentId !== "demo") {
            const documents = JSON.parse(localStorage.getItem("prisma-documents") || "[]");
            const doc = documents.find((d: any) => d.id === documentId);
            if (doc && doc.chatHistory) {
                setMessages(doc.chatHistory);
            } else {
                setMessages([
                    { role: 'assistant', content: "¡Hola! Sube un documento para empezar, o pregúntame algo directamente. ¡Incluso puedes enviarme una foto de tus apuntes o usar tu voz!" }
                ]);
            }
        } else {
            setMessages([
                { role: 'assistant', content: "¡Hola! Sube un documento para empezar, o pregúntame algo directamente. ¡Incluso puedes enviarme una foto de tus apuntes o usar tu voz!" }
            ]);
        }
    }, [documentId]);

    // Save messages to localStorage whenever they change
    useEffect(() => {
        if (documentId && documentId !== "demo" && messages.length > 0) {
            const documents = JSON.parse(localStorage.getItem("prisma-documents") || "[]");
            const updatedDocs = documents.map((d: any) =>
                d.id === documentId ? { ...d, chatHistory: messages } : d
            );
            localStorage.setItem("prisma-documents", JSON.stringify(updatedDocs));
        }
    }, [messages, documentId]);
    const scrollRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
            if (scrollContainer) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight;
            }
        }
    }, [messages, isLoading]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const base64 = event.target?.result as string;
            const preview = URL.createObjectURL(file);
            setAttachments(prev => [...prev, { type: 'image', image: base64.split(',')[1], preview }]);
        };
        reader.readAsDataURL(file);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const removeAttachment = (index: number) => {
        setAttachments(prev => {
            const newArr = [...prev];
            URL.revokeObjectURL(newArr[index].preview);
            newArr.splice(index, 1);
            return newArr;
        });
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if ((!input.trim() && attachments.length === 0) || isLoading) return;

        const userMessage = input;
        const currentAttachments = [...attachments];

        setInput("");
        setAttachments([]);

        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, { role: 'user', content: userMessage }],
                    context: initialContext,
                    data: currentAttachments.map(a => ({
                        type: a.type,
                        image: a.image,
                        mimeType: 'image/jpeg'
                    }))
                })
            });

            if (!response.ok) throw new Error('Failed to get response');

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let assistantMessage = "";

            if (reader) {
                setMessages(prev => [...prev, { role: 'assistant', content: "" }]);

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const text = decoder.decode(value);
                    assistantMessage += text;

                    setMessages(prev => {
                        const newMessages = [...prev];
                        newMessages[newMessages.length - 1] = {
                            role: 'assistant',
                            content: assistantMessage
                        };
                        return newMessages;
                    });
                }
            }

            const stats = JSON.parse(localStorage.getItem("prisma-stats") || "{}");
            stats.chatMessages = (stats.chatMessages || 0) + 1;
            localStorage.setItem("prisma-stats", JSON.stringify(stats));
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "Lo siento, hubo un error. Por favor intenta de nuevo."
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full min-h-0 bg-background rounded-lg border shadow-sm">
            <div className="flex items-center justify-between p-3 border-b bg-muted/20 shrink-0">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-primary/10 rounded-md">
                        <Sparkles className="h-4 w-4 text-primary" />
                    </div>
                    <h3 className="font-semibold text-sm">Asistente PRISMA AI</h3>
                </div>

                {documentId === "demo" && messages.length > 1 && (
                    <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="h-8 gap-2">
                                <Save className="h-3.5 w-3.5" />
                                Guardar Chat
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Guardar como nueva lección</DialogTitle>
                                <DialogDescription>
                                    Asigna un nombre y una asignatura a esta conversación para repasarla más tarde.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nombre de la lección</Label>
                                    <Input
                                        id="name"
                                        placeholder="Ej: Dudas sobre Integrales"
                                        value={lessonName}
                                        onChange={(e) => setLessonName(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="subject">Asignatura</Label>
                                    <Select value={selectedSubjectId} onValueChange={setSelectedSubjectId}>
                                        <SelectTrigger id="subject">
                                            <SelectValue placeholder="Selecciona una asignatura" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {subjects.map((s) => (
                                                <SelectItem key={s.id} value={s.id}>
                                                    {s.icon} {s.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button
                                    className="w-full"
                                    onClick={handleSaveAsLesson}
                                    disabled={!lessonName.trim() || !selectedSubjectId}
                                >
                                    Guardar en mi Biblioteca
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                )}
            </div>

            <ScrollArea className="flex-1 min-h-0 p-4" ref={scrollRef}>
                <div className="flex flex-col gap-4 pb-4">
                    {messages.map((m, idx) => (
                        <div
                            key={idx}
                            className={cn(
                                "flex gap-3 max-w-[85%]",
                                m.role === 'user' ? "ml-auto flex-row-reverse" : ""
                            )}
                        >
                            <div className={cn(
                                "h-8 w-8 rounded-full flex items-center justify-center shrink-0",
                                m.role === 'user' ? "bg-primary text-primary-foreground" : "bg-muted border"
                            )}>
                                {m.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                            </div>
                            <div className={cn(
                                "rounded-lg p-3 text-sm leading-relaxed whitespace-pre-wrap",
                                m.role === 'user'
                                    ? "bg-primary text-primary-foreground rounded-tr-none shadow-md"
                                    : "bg-muted/50 border rounded-tl-none"
                            )}>
                                {m.content}
                            </div>
                        </div>
                    ))}
                    {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
                        <div className="flex gap-3 max-w-[85%]">
                            <div className="h-8 w-8 rounded-full flex items-center justify-center shrink-0 bg-muted border animate-pulse">
                                <Bot className="h-4 w-4" />
                            </div>
                            <div className="bg-muted/50 border rounded-tl-none rounded-lg p-3 flex items-center">
                                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground mr-2" />
                                <span className="text-xs text-muted-foreground">Pensando...</span>
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>

            <form onSubmit={handleSubmit} className="p-3 border-t bg-background/50 backdrop-blur-sm shrink-0">
                {attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                        {attachments.map((a, i) => (
                            <div key={i} className="relative group animate-in zoom-in-50">
                                <img src={a.preview} className="h-16 w-16 object-cover rounded-md border shadow-sm" />
                                <button
                                    onClick={() => removeAttachment(i)}
                                    type="button"
                                    className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-0.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex items-end gap-2">
                    <div className="relative flex-1">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Pregunta lo que sea o dicta tu mensaje..."
                            className="pr-12 py-6 bg-muted/50 border-muted-foreground/20 focus-visible:ring-primary/20"
                            disabled={isLoading}
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                            <VoiceInput
                                onTranscript={(text) => setInput(prev => (prev ? `${prev} ${text}` : text))}
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageUpload}
                        />
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-11 w-11 shrink-0 border-muted-foreground/20 hover:bg-primary/5"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isLoading}
                        >
                            <ImageIcon className="h-5 w-5 text-muted-foreground" />
                        </Button>
                        <Button
                            type="submit"
                            size="icon"
                            className="h-11 w-11 shrink-0 shadow-lg"
                            disabled={(!input.trim() && attachments.length === 0) || isLoading}
                        >
                            <Send className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
