"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import dynamic from "next/dynamic";

const PDFViewer = dynamic(() => import("@/components/workspace/PDFViewer").then(mod => mod.PDFViewer), {
    ssr: false,
    loading: () => <div className="h-full w-full flex items-center justify-center bg-muted/20"><Loader2 className="animate-spin text-muted-foreground" /></div>
});
import { ChatInterface } from "@/components/workspace/ChatInterface";
import { extractTextFromPDF } from "@/lib/pdf-utils";
import { db } from "@/lib/db";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Loader2, BrainCircuit } from "lucide-react";
import { Mermaid } from "@/components/workspace/Mermaid";
import { FlashcardCarousel } from "@/components/workspace/FlashcardCarousel";
import { ExamInterface } from "@/components/workspace/ExamInterface";
import { PodcastPlayer } from "@/components/workspace/PodcastPlayer";
import { NotesSystem } from "@/components/workspace/NotesSystem";
import { ExportMenu } from "@/components/export/ExportMenu";
import { use } from "react";


export default function WorkspacePage({ params }: { params: Promise<{ id: string }> }) {
    // Unwrap params Promise
    const { id } = use(params);

    const [isMobile, setIsMobile] = useState(false);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [pdfText, setPdfText] = useState<string>("");

    // Artifact State
    const [isGenerating, setIsGenerating] = useState(false);
    const [artifacts, setArtifacts] = useState<{ mindMap: string, flashcards: Array<{ front: string, back: string }> } | null>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    // Exam State
    const [examQuestions, setExamQuestions] = useState<any[]>([]);
    const [isGeneratingExam, setIsGeneratingExam] = useState(false);

    // Podcast State
    const [podcastScript, setPodcastScript] = useState<string>("");

    // Chat History for generation context
    const [chatHistory, setChatHistory] = useState<Array<{ role: string, content: string }>>([]);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Load document from localStorage and IndexedDB if it exists
    useEffect(() => {
        const loadDocument = async () => {
            const documents = JSON.parse(localStorage.getItem("prisma-documents") || "[]");
            const doc = documents.find((d: any) => d.id === id);

            if (doc) {
                // If pdfUrl is empty in localStorage, it means it's stored in IndexedDB
                if (!doc.pdfUrl) {
                    const storedPdf = await db.getPDF(id);
                    if (storedPdf) {
                        setPdfUrl(storedPdf);
                    }
                } else {
                    setPdfUrl(doc.pdfUrl);
                }

                setPdfText(doc.pdfText || "");

                // Restore saved artifacts if they exist
                if (doc.artifacts) {
                    setArtifacts(doc.artifacts);
                }
                if (doc.examQuestions) {
                    setExamQuestions(doc.examQuestions);
                }
                if (doc.podcastScript) {
                    setPodcastScript(doc.podcastScript);
                }
                if (doc.chatHistory) {
                    setChatHistory(doc.chatHistory);
                }

                // Update last accessed
                const updatedDocs = documents.map((d: any) =>
                    d.id === id ? { ...d, lastAccessed: Date.now() } : d
                );
                localStorage.setItem("prisma-documents", JSON.stringify(updatedDocs));
            }
        };

        if (id !== "demo") {
            loadDocument();
        }
    }, [id]);


    const handleUpload = async (file: File) => {
        const objectUrl = URL.createObjectURL(file);
        setPdfUrl(objectUrl);

        // Extract text
        console.log("Starting text extraction...");
        const text = await extractTextFromPDF(objectUrl);
        console.log("Extracted text length:", text.length);
        if (text.length > 100) console.log("First 100 chars:", text.substring(0, 100));
        setPdfText(text);
    };

    const getGenerationContext = () => {
        if (pdfText) return pdfText;
        if (chatHistory.length > 0) {
            // Context from chat: only assistant and user messages, excluding system or initial messages
            return chatHistory
                .map(m => `${m.role === 'user' ? 'Alumno' : 'Profesor'}: ${m.content}`)
                .join("\n");
        }
        return "";
    };

    const generateStudyArtifacts = async () => {
        const context = getGenerationContext();
        console.log("Generating artifacts. Context length:", context.length);
        if (!context) {
            console.warn("No context found, aborting generation.");
            return;
        }
        setIsGenerating(true);
        setIsSheetOpen(true);
        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                body: JSON.stringify({ context }),
            });
            const data = await response.json();
            setArtifacts({
                mindMap: data.mindMap,
                flashcards: data.flashcards
            });

            // Save artifacts to document
            const documents = JSON.parse(localStorage.getItem("prisma-documents") || "[]");
            const updatedDocs = documents.map((d: any) =>
                d.id === id ? { ...d, artifacts: { mindMap: data.mindMap, flashcards: data.flashcards } } : d
            );
            localStorage.setItem("prisma-documents", JSON.stringify(updatedDocs));

            // Update stats
            const stats = JSON.parse(localStorage.getItem("prisma-stats") || "{}");
            stats.flashcardsCreated = (stats.flashcardsCreated || 0) + (data.flashcards?.length || 0);
            localStorage.setItem("prisma-stats", JSON.stringify(stats));
        } catch (error) {
            console.error("Failed to generate artifacts", error);
        } finally {
            setIsGenerating(false);
        }
    };

    const isChatOnly = id !== "demo" && !pdfUrl && !pdfText && artifacts?.mindMap === undefined && (id !== "demo");

    const generateExam = async () => {
        const context = getGenerationContext();
        console.log("Generating exam. Context length:", context.length);
        if (!context) return;
        setIsGeneratingExam(true);
        setIsSheetOpen(true); // Open sheet to show content or status
        try {
            const response = await fetch('/api/generate-exam', {
                method: 'POST',
                body: JSON.stringify({ context, numQuestions: 10 }),
            });
            const data = await response.json();
            const questions = data.questions || [];
            setExamQuestions(questions);

            // Save exam to document
            const documents = JSON.parse(localStorage.getItem("prisma-documents") || "[]");
            const updatedDocs = documents.map((d: any) =>
                d.id === id ? { ...d, examQuestions: questions } : d
            );
            localStorage.setItem("prisma-documents", JSON.stringify(updatedDocs));

            // Update stats
            const stats = JSON.parse(localStorage.getItem("prisma-stats") || "{}");
            stats.examsCompleted = (stats.examsCompleted || 0) + 1;
            localStorage.setItem("prisma-stats", JSON.stringify(stats));
        } catch (error) {
            console.error("Failed to generate exam", error);
        } finally {
            setIsGeneratingExam(false);
        }
    };

    return (
        <div className="flex h-screen flex-col overflow-hidden">
            <Navbar showBackButton={true} />


            {/* Artifact Sheet (Overlay) */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent side="right" className="w-[400px] sm:w-[540px] overflow-y-auto">
                    <SheetHeader>
                        <SheetTitle>Study Aids</SheetTitle>
                    </SheetHeader>
                    <Tabs defaultValue="mindmap" className="py-6">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="mindmap">Mind Map</TabsTrigger>
                            <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
                            <TabsTrigger value="exam">Exam</TabsTrigger>
                            <TabsTrigger value="podcast">Podcast</TabsTrigger>
                            <TabsTrigger value="notes">Notes</TabsTrigger>
                        </TabsList>
                        <TabsContent value="mindmap" className="mt-6">
                            {isGenerating ? (
                                <div className="flex flex-col items-center justify-center h-64 gap-4 text-muted-foreground">
                                    <Loader2 className="h-8 w-8 animate-spin" />
                                    <p>Generating mind map...</p>
                                </div>
                            ) : artifacts?.mindMap ? (
                                <div>
                                    <h3 className="font-semibold mb-4 flex items-center gap-2"><BrainCircuit className="h-4 w-4" /> Mind Map</h3>
                                    <Mermaid chart={artifacts.mindMap} />
                                </div>
                            ) : (
                                <div className="text-center text-muted-foreground">
                                    <p className="mb-4">No mind map generated yet.</p>
                                    <Button onClick={generateStudyArtifacts} disabled={!getGenerationContext()}>
                                        Generar Ayudas de Estudio
                                    </Button>
                                </div>
                            )}
                        </TabsContent>
                        <TabsContent value="flashcards" className="mt-6">
                            {isGenerating ? (
                                <div className="flex flex-col items-center justify-center h-64 gap-4 text-muted-foreground">
                                    <Loader2 className="h-8 w-8 animate-spin" />
                                    <p>Generating flashcards...</p>
                                </div>
                            ) : artifacts?.flashcards ? (
                                <div>
                                    <h3 className="font-semibold mb-4">Flashcards</h3>
                                    <FlashcardCarousel cards={artifacts.flashcards} />
                                </div>
                            ) : (
                                <div className="text-center text-muted-foreground">
                                    <p className="mb-4">No flashcards generated yet.</p>
                                    <Button onClick={generateStudyArtifacts} disabled={!getGenerationContext()}>
                                        Generar Ayudas de Estudio
                                    </Button>
                                </div>
                            )}
                        </TabsContent>
                        <TabsContent value="exam" className="mt-6">
                            {isGeneratingExam ? (
                                <div className="flex flex-col items-center justify-center h-64 gap-4 text-muted-foreground">
                                    <Loader2 className="h-8 w-8 animate-spin" />
                                    <p>Generating exam questions...</p>
                                </div>
                            ) : examQuestions.length > 0 ? (
                                <ExamInterface questions={examQuestions} onRetake={generateExam} />
                            ) : (
                                <div className="text-center text-muted-foreground">
                                    <p className="mb-4">No exam generated yet.</p>
                                    <Button onClick={generateExam} disabled={!getGenerationContext()}>
                                        Generar Examen
                                    </Button>
                                </div>
                            )}
                        </TabsContent>
                        <TabsContent value="podcast" className="mt-6">
                            <PodcastPlayer
                                pdfText={getGenerationContext()}
                                documentId={id}
                                onScriptGenerated={(s) => setPodcastScript(s)}
                            />
                        </TabsContent>
                        <TabsContent value="notes" className="mt-6">
                            <NotesSystem documentId={id} />
                        </TabsContent>
                    </Tabs>

                    {/* Export Button */}
                    <div className="mt-6 pt-6 border-t">
                        <ExportMenu
                            data={{
                                summary: "", // Add summary state if needed
                                flashcards: artifacts?.flashcards || [],
                                examQuestions,
                                podcastScript: podcastScript || "",
                                notes: JSON.parse(localStorage.getItem(`notes-${id}`) || "[]"),
                                mindMap: artifacts?.mindMap || "",
                            }}
                            documentName={`Document-${id}`}
                        />
                    </div>
                </SheetContent>
            </Sheet>

            <main className="flex-1 overflow-hidden relative">
                {/* Floating Action Button for Study Gen */}
                {getGenerationContext() && (
                    <div className="absolute top-4 right-4 z-50">
                        <Button onClick={generateStudyArtifacts} disabled={isGenerating} size="sm" className="shadow-lg gap-2">
                            {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <BrainCircuit className="h-4 w-4" />}
                            Crear Material de Estudio
                        </Button>
                    </div>
                )}

                {isMobile ? (
                    // Mobile View: Tabs
                    <Tabs defaultValue="chat" className="h-full flex flex-col">
                        <TabsList className="grid w-full grid-cols-2">
                            {!isChatOnly && <TabsTrigger value="doc">Document</TabsTrigger>}
                            <TabsTrigger value="chat">Chat</TabsTrigger>
                        </TabsList>
                        {!isChatOnly && (
                            <TabsContent value="doc" className="flex-1 m-0 p-4 h-full">
                                <PDFViewer url={pdfUrl} onUpload={handleUpload} />
                            </TabsContent>
                        )}
                        <TabsContent value="chat" className="flex-1 m-0 p-4 h-full">
                            <ChatInterface initialContext={pdfText} documentId={id} />
                        </TabsContent>
                    </Tabs>
                ) : (
                    // Desktop View: Split Panels
                    <ResizablePanelGroup orientation="horizontal" className="h-full rounded-lg border">
                        {!isChatOnly ? (
                            <>
                                <ResizablePanel defaultSize={50} minSize={30}>
                                    <div className="h-full p-4 relative">
                                        <PDFViewer url={pdfUrl} onUpload={handleUpload} />
                                    </div>
                                </ResizablePanel>
                                <ResizableHandle withHandle />
                                <ResizablePanel defaultSize={50} minSize={30}>
                                    <ChatInterface initialContext={pdfText} documentId={id} />
                                </ResizablePanel>
                            </>
                        ) : (
                            <ResizablePanel defaultSize={100}>
                                <div className="h-full max-w-4xl mx-auto p-4">
                                    <ChatInterface initialContext={pdfText} documentId={id} />
                                </div>
                            </ResizablePanel>
                        )}
                    </ResizablePanelGroup>
                )}
            </main>
        </div>
    );
}
