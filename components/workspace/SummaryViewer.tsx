"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    FileText,
    Loader2,
    Copy,
    Download,
    ChevronRight,
    Lightbulb,
    ClipboardList,
    AlignLeft,
} from "lucide-react";

interface SummaryData {
    briefSummary: string;
    keyTakeaways: string[];
    detailedSummary: string;
}

interface SummaryViewerProps {
    pdfText: string;
    documentId: string;
    savedSummary?: SummaryData | null;
    onSummaryGenerated?: (summary: SummaryData) => void;
}

export function SummaryViewer({
    pdfText,
    documentId,
    savedSummary,
    onSummaryGenerated,
}: SummaryViewerProps) {
    const [summary, setSummary] = useState<SummaryData | null>(savedSummary || null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [expandedSection, setExpandedSection] = useState<string>("brief");

    const generateSummary = async () => {
        if (!pdfText) return;
        setIsGenerating(true);
        setError(null);

        try {
            const response = await fetch("/api/generate-summary", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ context: pdfText }),
            });

            if (!response.ok) {
                throw new Error("Failed to generate summary");
            }

            const data: SummaryData = await response.json();
            setSummary(data);
            onSummaryGenerated?.(data);
        } catch (err) {
            console.error("Error generating summary:", err);
            setError("No se pudo generar el resumen. Inténtalo de nuevo.");
        } finally {
            setIsGenerating(false);
        }
    };

    const copyToClipboard = () => {
        if (!summary) return;
        const text = [
            "RESUMEN BREVE",
            summary.briefSummary,
            "",
            "PUNTOS CLAVE",
            summary.keyTakeaways.map((t, i) => `${i + 1}. ${t}`).join("\n"),
            "",
            "RESUMEN DETALLADO",
            summary.detailedSummary,
        ].join("\n");
        navigator.clipboard.writeText(text);
    };

    const downloadSummary = () => {
        if (!summary) return;
        const text = [
            "=== RESUMEN ===\n",
            "RESUMEN BREVE",
            summary.briefSummary,
            "",
            "PUNTOS CLAVE",
            summary.keyTakeaways.map((t, i) => `${i + 1}. ${t}`).join("\n"),
            "",
            "RESUMEN DETALLADO",
            summary.detailedSummary,
        ].join("\n");
        const blob = new Blob([text], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `resumen-${documentId}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    if (!pdfText) {
        return (
            <div className="flex flex-col items-center justify-center h-64 gap-3 text-muted-foreground text-center">
                <FileText className="h-12 w-12 opacity-30" />
                <p className="text-sm">Sube un documento o inicia una conversación para generar un resumen.</p>
            </div>
        );
    }

    if (isGenerating) {
        return (
            <div className="flex flex-col items-center justify-center h-64 gap-4 text-muted-foreground">
                <div className="relative">
                    <div className="h-16 w-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                    <FileText className="absolute inset-0 m-auto h-6 w-6 text-primary" />
                </div>
                <div className="text-center">
                    <p className="font-medium text-foreground">Generando resumen…</p>
                    <p className="text-xs mt-1">Analizando el contenido del documento</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-64 gap-4 text-center">
                <p className="text-destructive text-sm">{error}</p>
                <Button onClick={generateSummary} size="sm">
                    Reintentar
                </Button>
            </div>
        );
    }

    if (!summary) {
        return (
            <div className="flex flex-col items-center justify-center h-64 gap-4 text-muted-foreground text-center">
                <FileText className="h-12 w-12 opacity-30" />
                <div>
                    <p className="text-sm mb-1 font-medium text-foreground">No hay resumen todavía</p>
                    <p className="text-xs">Genera un resumen inteligente del documento</p>
                </div>
                <Button onClick={generateSummary} className="gap-2" disabled={!pdfText}>
                    <FileText className="h-4 w-4" />
                    Generar Resumen
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    Resumen del Documento
                </h3>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={copyToClipboard}>
                        <Copy className="h-3 w-3 mr-1" />
                        Copiar
                    </Button>
                    <Button variant="outline" size="sm" onClick={downloadSummary}>
                        <Download className="h-3 w-3 mr-1" />
                        Descargar
                    </Button>
                </div>
            </div>

            {/* Brief Summary */}
            <Card
                className="p-4 cursor-pointer hover:bg-muted/30 transition-colors border-l-4 border-l-primary"
                onClick={() => setExpandedSection(expandedSection === "brief" ? "" : "brief")}
            >
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <AlignLeft className="h-4 w-4 text-primary" />
                        <span className="font-medium text-sm">Resumen Breve</span>
                    </div>
                    <ChevronRight
                        className={`h-4 w-4 text-muted-foreground transition-transform ${expandedSection === "brief" ? "rotate-90" : ""
                            }`}
                    />
                </div>
                {expandedSection === "brief" && (
                    <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                        {summary.briefSummary}
                    </p>
                )}
            </Card>

            {/* Key Takeaways */}
            <Card
                className="p-4 cursor-pointer hover:bg-muted/30 transition-colors border-l-4 border-l-yellow-500"
                onClick={() => setExpandedSection(expandedSection === "takeaways" ? "" : "takeaways")}
            >
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-yellow-500" />
                        <span className="font-medium text-sm">Puntos Clave</span>
                        <Badge variant="secondary" className="text-xs">
                            {summary.keyTakeaways.length}
                        </Badge>
                    </div>
                    <ChevronRight
                        className={`h-4 w-4 text-muted-foreground transition-transform ${expandedSection === "takeaways" ? "rotate-90" : ""
                            }`}
                    />
                </div>
                {expandedSection === "takeaways" && (
                    <ul className="space-y-2 mt-2">
                        {summary.keyTakeaways.map((takeaway, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 flex items-center justify-center text-xs font-bold mt-0.5">
                                    {idx + 1}
                                </span>
                                <span className="text-muted-foreground leading-relaxed">{takeaway}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </Card>

            {/* Detailed Summary */}
            <Card
                className="p-4 cursor-pointer hover:bg-muted/30 transition-colors border-l-4 border-l-green-500"
                onClick={() => setExpandedSection(expandedSection === "detailed" ? "" : "detailed")}
            >
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <ClipboardList className="h-4 w-4 text-green-500" />
                        <span className="font-medium text-sm">Resumen Detallado</span>
                    </div>
                    <ChevronRight
                        className={`h-4 w-4 text-muted-foreground transition-transform ${expandedSection === "detailed" ? "rotate-90" : ""
                            }`}
                    />
                </div>
                {expandedSection === "detailed" && (
                    <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                        {summary.detailedSummary}
                    </p>
                )}
            </Card>

            {/* Regenerate */}
            <div className="pt-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={generateSummary}
                    className="w-full gap-2"
                >
                    <FileText className="h-4 w-4" />
                    Regenerar Resumen
                </Button>
            </div>
        </div>
    );
}
