"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileText, FileJson } from "lucide-react";

interface ExportMenuProps {
    data: {
        summary?: string;
        flashcards?: any[];
        examQuestions?: any[];
        podcastScript?: string;
        notes?: any[];
        mindMap?: string;
    };
    documentName: string;
}

export function ExportMenu({ data, documentName }: ExportMenuProps) {
    const exportAsText = () => {
        let content = `# ${documentName}\n\n`;

        if (data.summary) {
            content += `## Resumen\n${data.summary}\n\n`;
        }

        if (data.mindMap) {
            content += `## Mapa Mental (Mermaid)\n${data.mindMap}\n\n`;
        }

        if (data.flashcards && data.flashcards.length > 0) {
            content += `## Flashcards\n`;
            data.flashcards.forEach((card: any, i: number) => {
                content += `${i + 1}. **${card.front}**\n   ${card.back}\n\n`;
            });
        }

        if (data.examQuestions && data.examQuestions.length > 0) {
            content += `## Preguntas de Examen\n`;
            data.examQuestions.forEach((q: any, i: number) => {
                content += `${i + 1}. ${q.question}\n`;
                content += `   A) ${q.options.A}\n`;
                content += `   B) ${q.options.B}\n`;
                content += `   C) ${q.options.C}\n`;
                content += `   D) ${q.options.D}\n`;
                content += `   **Respuesta:** ${q.correctAnswer}\n\n`;
            });
        }

        if (data.notes && data.notes.length > 0) {
            content += `## Notas\n`;
            data.notes.forEach((note: any, i: number) => {
                content += `${i + 1}. ${note.content}\n\n`;
            });
        }

        downloadFile(content, `${documentName}.txt`, "text/plain");
    };

    const exportAsMarkdown = () => {
        let content = `# ${documentName}\n\n`;

        if (data.summary) {
            content += `## 📝 Resumen\n\n${data.summary}\n\n---\n\n`;
        }

        if (data.mindMap) {
            content += `## 🗺️ Mapa Mental\n\n\`\`\`mermaid\n${data.mindMap}\n\`\`\`\n\n---\n\n`;
        }

        if (data.flashcards && data.flashcards.length > 0) {
            content += `## 🎴 Flashcards\n\n`;
            data.flashcards.forEach((card: any, i: number) => {
                content += `### ${i + 1}. ${card.front}\n\n`;
                content += `> ${card.back}\n\n`;
            });
            content += `---\n\n`;
        }

        if (data.examQuestions && data.examQuestions.length > 0) {
            content += `## ✅ Preguntas de Examen\n\n`;
            data.examQuestions.forEach((q: any, i: number) => {
                content += `### ${i + 1}. ${q.question}\n\n`;
                content += `- [ ] A) ${q.options.A}\n`;
                content += `- [ ] B) ${q.options.B}\n`;
                content += `- [ ] C) ${q.options.C}\n`;
                content += `- [ ] D) ${q.options.D}\n\n`;
                content += `**Respuesta correcta:** ${q.correctAnswer}\n\n`;
                content += `*Explicación:* ${q.explanation}\n\n`;
            });
            content += `---\n\n`;
        }

        if (data.notes && data.notes.length > 0) {
            content += `## 📌 Notas\n\n`;
            data.notes.forEach((note: any, i: number) => {
                const date = new Date(note.timestamp).toLocaleString('es-ES');
                content += `### Nota ${i + 1} - ${date}\n\n`;
                content += `${note.content}\n\n`;
            });
        }

        downloadFile(content, `${documentName}.md`, "text/markdown");
    };

    const exportAsJSON = () => {
        const jsonData = {
            documentName,
            exportedAt: new Date().toISOString(),
            ...data,
        };

        downloadFile(
            JSON.stringify(jsonData, null, 2),
            `${documentName}.json`,
            "application/json"
        );
    };

    const downloadFile = (content: string, filename: string, mimeType: string) => {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={exportAsText}>
                    <FileText className="h-4 w-4 mr-2" />
                    Exportar como TXT
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportAsMarkdown}>
                    <FileText className="h-4 w-4 mr-2" />
                    Exportar como Markdown
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportAsJSON}>
                    <FileJson className="h-4 w-4 mr-2" />
                    Exportar como JSON
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
