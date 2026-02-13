"use client";

import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, FileText, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface SearchResult {
    documentId: string;
    documentName: string;
    subjectName: string;
    snippet: string;
    matchType: "title" | "content" | "notes";
}

export function SmartSearch() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        if (query.length < 2) {
            setResults([]);
            return;
        }

        const timeoutId = setTimeout(() => {
            performSearch(query);
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [query]);

    const performSearch = (searchQuery: string) => {
        setIsSearching(true);
        const lowerQuery = searchQuery.toLowerCase();
        const foundResults: SearchResult[] = [];

        // Search in documents
        const documents = JSON.parse(localStorage.getItem("prisma-documents") || "[]");
        const subjects = JSON.parse(localStorage.getItem("prisma-subjects") || "[]");

        documents.forEach((doc: any) => {
            const subject = subjects.find((s: any) => s.id === doc.subjectId);

            // Search in document name
            if (doc.name.toLowerCase().includes(lowerQuery)) {
                foundResults.push({
                    documentId: doc.id,
                    documentName: doc.name,
                    subjectName: subject?.name || "Sin asignatura",
                    snippet: doc.name,
                    matchType: "title",
                });
            }

            // Search in document content
            if (doc.pdfText && doc.pdfText.toLowerCase().includes(lowerQuery)) {
                const index = doc.pdfText.toLowerCase().indexOf(lowerQuery);
                const start = Math.max(0, index - 50);
                const end = Math.min(doc.pdfText.length, index + 100);
                const snippet = "..." + doc.pdfText.substring(start, end) + "...";

                foundResults.push({
                    documentId: doc.id,
                    documentName: doc.name,
                    subjectName: subject?.name || "Sin asignatura",
                    snippet,
                    matchType: "content",
                });
            }

            // Search in notes
            const notes = JSON.parse(localStorage.getItem(`notes-${doc.id}`) || "[]");
            notes.forEach((note: any) => {
                if (note.content.toLowerCase().includes(lowerQuery)) {
                    foundResults.push({
                        documentId: doc.id,
                        documentName: doc.name,
                        subjectName: subject?.name || "Sin asignatura",
                        snippet: note.content.substring(0, 150),
                        matchType: "notes",
                    });
                }
            });
        });

        setResults(foundResults.slice(0, 20)); // Limit to 20 results
        setIsSearching(false);
    };

    const clearSearch = () => {
        setQuery("");
        setResults([]);
    };

    const getMatchTypeBadge = (type: string) => {
        const badges = {
            title: { label: "Título", variant: "default" as const },
            content: { label: "Contenido", variant: "secondary" as const },
            notes: { label: "Notas", variant: "outline" as const },
        };
        return badges[type as keyof typeof badges] || badges.content;
    };

    return (
        <div className="space-y-4">
            {/* Search Input */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Buscar en documentos, notas..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-10 pr-10"
                />
                {query && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
                        onClick={clearSearch}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>

            {/* Results */}
            {query.length >= 2 && (
                <div className="space-y-2">
                    {isSearching ? (
                        <Card className="p-8 text-center">
                            <p className="text-muted-foreground">Buscando...</p>
                        </Card>
                    ) : results.length === 0 ? (
                        <Card className="p-8 text-center">
                            <Search className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                            <p className="text-muted-foreground">
                                No se encontraron resultados para "{query}"
                            </p>
                        </Card>
                    ) : (
                        <>
                            <p className="text-sm text-muted-foreground">
                                {results.length} resultado{results.length !== 1 ? "s" : ""}
                            </p>
                            {results.map((result, index) => {
                                const badge = getMatchTypeBadge(result.matchType);
                                return (
                                    <Card
                                        key={`${result.documentId}-${index}`}
                                        className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
                                        onClick={() => {
                                            window.location.href = `/workspace/${result.documentId}`;
                                        }}
                                    >
                                        <div className="space-y-2">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex items-center gap-2 flex-1">
                                                    <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium truncate">
                                                            {result.documentName}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {result.subjectName}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Badge variant={badge.variant} className="shrink-0">
                                                    {badge.label}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                {result.snippet}
                                            </p>
                                        </div>
                                    </Card>
                                );
                            })}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
