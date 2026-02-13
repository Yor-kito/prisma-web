"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { db } from "@/lib/db";

import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Folder, FileText, Plus, Trash2, Upload, FolderOpen, Edit2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { extractTextFromPDF } from "@/lib/pdf-utils";

export interface Subject {
    id: string;
    name: string;
    color: string;
    icon: string;
    createdAt: number;
}

export interface SavedDocument {
    id: string;
    name: string;
    subjectId: string;
    uploadedAt: number;
    lastAccessed: number;
    pdfUrl: string;
    pdfText?: string;
    artifacts?: {
        mindMap: string;
        flashcards: Array<{ front: string, back: string }>;
    };
    examQuestions?: any[];
    podcastScript?: string;
}

const DEFAULT_COLORS = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-orange-500",
    "bg-pink-500",
    "bg-cyan-500",
    "bg-red-500",
    "bg-yellow-500",
];

const DEFAULT_ICONS = ["📚", "🔬", "🎨", "💻", "🌍", "📊", "⚖️", "🏥"];

export function LibrarySystem() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [documents, setDocuments] = useState<SavedDocument[]>([]);
    const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

    // New subject dialog
    const [newSubjectName, setNewSubjectName] = useState("");
    const [selectedIcon, setSelectedIcon] = useState(DEFAULT_ICONS[0]);
    const [selectedColor, setSelectedColor] = useState(DEFAULT_COLORS[0]);
    const [isSubjectDialogOpen, setIsSubjectDialogOpen] = useState(false);

    // Upload document dialog
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
    const [uploadSubjectId, setUploadSubjectId] = useState("");
    const [isUploading, setIsUploading] = useState(false);

    // Edit subject dialog
    const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
    const [isEditSubjectDialogOpen, setIsEditSubjectDialogOpen] = useState(false);
    const [editName, setEditName] = useState("");
    const [editIcon, setEditIcon] = useState("");
    const [editColor, setEditColor] = useState("");

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        const savedSubjects = localStorage.getItem("prisma-subjects");
        const savedDocuments = localStorage.getItem("prisma-documents");

        if (savedSubjects) {
            setSubjects(JSON.parse(savedSubjects));
        }
        if (savedDocuments) {
            setDocuments(JSON.parse(savedDocuments));
        }
    };

    const saveSubjects = (updatedSubjects: Subject[]) => {
        localStorage.setItem("prisma-subjects", JSON.stringify(updatedSubjects));
        setSubjects(updatedSubjects);
    };

    const saveDocuments = (updatedDocuments: SavedDocument[]) => {
        localStorage.setItem("prisma-documents", JSON.stringify(updatedDocuments));
        setDocuments(updatedDocuments);
    };

    const createSubject = () => {
        if (!newSubjectName.trim()) return;

        const newSubject: Subject = {
            id: Date.now().toString(),
            name: newSubjectName,
            color: selectedColor,
            icon: selectedIcon,
            createdAt: Date.now(),
        };

        saveSubjects([...subjects, newSubject]);
        setNewSubjectName("");
        setIsSubjectDialogOpen(false);
    };

    const deleteSubject = (id: string) => {
        if (confirm("¿Eliminar esta asignatura y todos sus documentos?")) {
            saveSubjects(subjects.filter((s) => s.id !== id));
            saveDocuments(documents.filter((d) => d.subjectId !== id));
        }
    };

    const startEditingSubject = (subject: Subject) => {
        setEditingSubject(subject);
        setEditName(subject.name);
        setEditIcon(subject.icon);
        setEditColor(subject.color);
        setIsEditSubjectDialogOpen(true);
    };

    const updateSubject = () => {
        if (!editingSubject || !editName.trim()) return;

        const updatedSubjects = subjects.map(s =>
            s.id === editingSubject.id
                ? { ...s, name: editName, icon: editIcon, color: editColor }
                : s
        );

        saveSubjects(updatedSubjects);
        setIsEditSubjectDialogOpen(false);
        setEditingSubject(null);
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !uploadSubjectId) return;

        setIsUploading(true);

        try {
            // Convert PDF to base64 for persistent storage
            const reader = new FileReader();
            const base64Promise = new Promise<string>((resolve, reject) => {
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });

            const pdfBase64 = await base64Promise;
            const docId = Date.now().toString();

            // Save PDF to IndexedDB (much larger capacity than localStorage)
            await db.savePDF(docId, pdfBase64);

            // Create temporary blob URL for text extraction
            const tempUrl = URL.createObjectURL(file);

            // Extract text from PDF
            const pdfText = await extractTextFromPDF(tempUrl);

            // Clean up temp URL
            URL.revokeObjectURL(tempUrl);

            // Create document metadata (save only summary/text to localStorage)
            const newDoc: SavedDocument = {
                id: docId,
                name: file.name.replace('.pdf', ''),
                subjectId: uploadSubjectId,
                uploadedAt: Date.now(),
                lastAccessed: Date.now(),
                pdfUrl: "", // We don't save the massive base64 here anymore
                pdfText,
            };

            // Save document metadata to localStorage
            const updatedDocs = [...documents, newDoc];
            saveDocuments(updatedDocs);

            // Update stats
            const stats = JSON.parse(localStorage.getItem("prisma-stats") || "{}");
            stats.documentsUploaded = (stats.documentsUploaded || 0) + 1;
            localStorage.setItem("prisma-stats", JSON.stringify(stats));

            // Close dialog and navigate to workspace
            setIsUploadDialogOpen(false);
            router.push(`/workspace/${newDoc.id}`);
        } catch (error) {
            console.error("Error uploading PDF:", error);
            alert("Error al subir el PDF. Es posible que el archivo sea demasiado grande o esté corrupto. Por favor, intenta con un archivo más pequeño.");
        }
        finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const openDocument = (doc: SavedDocument) => {
        // Update last accessed
        const updatedDocs = documents.map(d =>
            d.id === doc.id ? { ...d, lastAccessed: Date.now() } : d
        );
        saveDocuments(updatedDocs);

        // Navigate to workspace
        router.push(`/workspace/${doc.id}`);
    };

    const deleteDocument = (id: string) => {
        if (confirm("¿Eliminar este documento?")) {
            saveDocuments(documents.filter((d) => d.id !== id));
        }
    };

    const getDocumentsBySubject = (subjectId: string) => {
        return documents.filter((doc) => doc.subjectId === subjectId);
    };

    const filteredDocuments = selectedSubject
        ? getDocumentsBySubject(selectedSubject)
        : documents;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Mi Biblioteca</h2>
                    <p className="text-muted-foreground">
                        {subjects.length} asignaturas · {documents.length} documentos
                    </p>
                </div>

                <div className="flex gap-2">
                    <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline">
                                <Upload className="h-4 w-4 mr-2" />
                                Subir PDF
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Subir Documento PDF</DialogTitle>
                                <DialogDescription>
                                    Selecciona una asignatura y sube tu PDF
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="subject-select">Asignatura</Label>
                                    <Select value={uploadSubjectId} onValueChange={setUploadSubjectId}>
                                        <SelectTrigger id="subject-select">
                                            <SelectValue placeholder="Selecciona una asignatura" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {subjects.map((subject) => (
                                                <SelectItem key={subject.id} value={subject.id}>
                                                    {subject.icon} {subject.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="file-upload">Archivo PDF</Label>
                                    <Input
                                        id="file-upload"
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".pdf"
                                        onChange={handleFileUpload}
                                        disabled={!uploadSubjectId || isUploading}
                                    />
                                </div>

                                {subjects.length === 0 && (
                                    <p className="text-sm text-muted-foreground">
                                        Primero crea una asignatura para poder subir documentos
                                    </p>
                                )}
                            </div>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={isSubjectDialogOpen} onOpenChange={setIsSubjectDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                Nueva Asignatura
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Crear Asignatura</DialogTitle>
                                <DialogDescription>
                                    Organiza tus documentos por asignaturas
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div>
                                    <Label className="text-sm font-medium mb-2 block">
                                        Nombre
                                    </Label>
                                    <Input
                                        placeholder="Ej: Matemáticas, Historia..."
                                        value={newSubjectName}
                                        onChange={(e) => setNewSubjectName(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <Label className="text-sm font-medium mb-2 block">
                                        Icono
                                    </Label>
                                    <div className="flex gap-2 flex-wrap">
                                        {DEFAULT_ICONS.map((icon) => (
                                            <button
                                                key={icon}
                                                onClick={() => setSelectedIcon(icon)}
                                                className={`text-2xl p-2 rounded-lg border-2 transition-all ${selectedIcon === icon
                                                    ? "border-primary scale-110"
                                                    : "border-transparent hover:border-muted"
                                                    }`}
                                            >
                                                {icon}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium mb-2 block">
                                        Color
                                    </Label>
                                    <div className="flex gap-2 flex-wrap">
                                        {DEFAULT_COLORS.map((color) => (
                                            <button
                                                key={color}
                                                onClick={() => setSelectedColor(color)}
                                                className={`w-8 h-8 rounded-full ${color} ${selectedColor === color
                                                    ? "ring-2 ring-offset-2 ring-primary"
                                                    : ""
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <Button onClick={createSubject} className="w-full" disabled={!newSubjectName.trim()}>
                                    Crear Asignatura
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Edit Subject Dialog */}
            <Dialog open={isEditSubjectDialogOpen} onOpenChange={setIsEditSubjectDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar Asignatura</DialogTitle>
                        <DialogDescription>
                            Modifica los detalles de tu asignatura
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label className="text-sm font-medium mb-2 block">Nombre</Label>
                            <Input
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label className="text-sm font-medium mb-2 block">Icono</Label>
                            <div className="flex gap-2 flex-wrap">
                                {DEFAULT_ICONS.map((icon) => (
                                    <button
                                        key={icon}
                                        onClick={() => setEditIcon(icon)}
                                        className={`text-2xl p-2 rounded-lg border-2 transition-all ${editIcon === icon ? "border-primary scale-110" : "border-transparent hover:border-muted"}`}
                                    >
                                        {icon}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <Label className="text-sm font-medium mb-2 block">Color</Label>
                            <div className="flex gap-2 flex-wrap">
                                {DEFAULT_COLORS.map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => setEditColor(color)}
                                        className={`w-8 h-8 rounded-full ${color} ${editColor === color ? "ring-2 ring-offset-2 ring-primary" : ""}`}
                                    />
                                ))}
                            </div>
                        </div>
                        <Button onClick={updateSubject} className="w-full" disabled={!editName.trim()}>
                            Guardar Cambios
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Subjects Grid */}
            <div>
                <h3 className="font-semibold mb-3">Asignaturas</h3>
                {subjects.length === 0 ? (
                    <Card className="p-8 text-center">
                        <Folder className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                        <p className="text-muted-foreground mb-4">
                            No hay asignaturas. ¡Crea tu primera asignatura!
                        </p>
                        <Button onClick={() => setIsSubjectDialogOpen(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Crear Asignatura
                        </Button>
                    </Card>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <Card
                            className={`p-4 cursor-pointer transition-all ${selectedSubject === null
                                ? "ring-2 ring-primary"
                                : "hover:shadow-lg"
                                }`}
                            onClick={() => setSelectedSubject(null)}
                        >
                            <div className="text-center space-y-2">
                                <div className="text-3xl">📂</div>
                                <p className="font-semibold text-sm">Todos</p>
                                <Badge variant="secondary">{documents.length}</Badge>
                            </div>
                        </Card>

                        {subjects.map((subject) => (
                            <Card
                                key={subject.id}
                                className={`p-4 cursor-pointer transition-all ${selectedSubject === subject.id
                                    ? "ring-2 ring-primary"
                                    : "hover:shadow-lg"
                                    }`}
                                onClick={() => setSelectedSubject(subject.id)}
                            >
                                <div className="text-center space-y-2">
                                    <div className="flex justify-end gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                startEditingSubject(subject);
                                            }}
                                        >
                                            <Edit2 className="h-3 w-3" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 text-destructive"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteSubject(subject.id);
                                            }}
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                    <div className="text-3xl">{subject.icon}</div>
                                    <p className="font-semibold text-sm">{subject.name}</p>
                                    <Badge variant="secondary">
                                        {getDocumentsBySubject(subject.id).length}
                                    </Badge>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Documents List */}
            <div>
                <h3 className="font-semibold mb-3">
                    Documentos
                    {selectedSubject && (
                        <span className="text-muted-foreground font-normal ml-2">
                            en {subjects.find((s) => s.id === selectedSubject)?.name}
                        </span>
                    )}
                </h3>
                {filteredDocuments.length === 0 ? (
                    <Card className="p-8 text-center">
                        <FileText className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                        <p className="text-muted-foreground mb-4">
                            No hay documentos en esta asignatura
                        </p>
                        <Button onClick={() => setIsUploadDialogOpen(true)}>
                            <Upload className="h-4 w-4 mr-2" />
                            Subir Primer PDF
                        </Button>
                    </Card>
                ) : (
                    <div className="space-y-2">
                        {filteredDocuments.map((doc) => {
                            const subject = subjects.find((s) => s.id === doc.subjectId);
                            return (
                                <Card key={doc.id} className="p-4 hover:shadow-lg transition-shadow">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 flex-1">
                                            <div className={`p-2 rounded-lg ${subject?.color || 'bg-gray-500'}/10`}>
                                                <FileText className="h-5 w-5" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium">{doc.name}</p>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <span>{subject?.icon} {subject?.name}</span>
                                                    <span>·</span>
                                                    <span>
                                                        {new Date(doc.uploadedAt).toLocaleDateString('es-ES')}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="default"
                                                size="sm"
                                                onClick={() => openDocument(doc)}
                                            >
                                                <FolderOpen className="h-4 w-4 mr-2" />
                                                Abrir
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteDocument(doc.id);
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
