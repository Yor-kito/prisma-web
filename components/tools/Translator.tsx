"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Languages, Loader2, ArrowRight, Copy } from "lucide-react";
import { useState } from "react";

const LANGUAGES = [
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
    { code: "it", name: "Italiano", flag: "🇮🇹" },
    { code: "pt", name: "Português", flag: "🇵🇹" },
    { code: "zh", name: "中文", flag: "🇨🇳" },
    { code: "ja", name: "日本語", flag: "🇯🇵" },
    { code: "ko", name: "한국어", flag: "🇰🇷" },
    { code: "ru", name: "Русский", flag: "🇷🇺" },
];

export function Translator() {
    const [sourceText, setSourceText] = useState("");
    const [translatedText, setTranslatedText] = useState("");
    const [sourceLang, setSourceLang] = useState("auto");
    const [targetLang, setTargetLang] = useState("en");
    const [isTranslating, setIsTranslating] = useState(false);

    const translate = async () => {
        if (!sourceText.trim()) return;

        setIsTranslating(true);
        try {
            const response = await fetch("/api/translate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    text: sourceText,
                    sourceLanguage: sourceLang,
                    targetLanguage: targetLang,
                }),
            });

            const data = await response.json();
            setTranslatedText(data.translation);
        } catch (error) {
            console.error("Translation error:", error);
        } finally {
            setIsTranslating(false);
        }
    };

    const swapLanguages = () => {
        if (sourceLang === "auto") return;

        setSourceLang(targetLang);
        setTargetLang(sourceLang);
        setSourceText(translatedText);
        setTranslatedText(sourceText);
    };

    const copyTranslation = () => {
        navigator.clipboard.writeText(translatedText);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <Languages className="h-5 w-5" />
                <h3 className="font-semibold">Traductor</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                {/* Source */}
                <Card className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <Label>Idioma Origen</Label>
                        <Select value={sourceLang} onValueChange={setSourceLang}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="auto">🌐 Auto-detectar</SelectItem>
                                {LANGUAGES.map((lang) => (
                                    <SelectItem key={lang.code} value={lang.code}>
                                        {lang.flag} {lang.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <Textarea
                        placeholder="Escribe o pega el texto aquí..."
                        value={sourceText}
                        onChange={(e) => setSourceText(e.target.value)}
                        className="min-h-[200px] resize-none"
                    />
                    <div className="text-xs text-muted-foreground text-right">
                        {sourceText.length} caracteres
                    </div>
                </Card>

                {/* Target */}
                <Card className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <Label>Idioma Destino</Label>
                        <Select value={targetLang} onValueChange={setTargetLang}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {LANGUAGES.map((lang) => (
                                    <SelectItem key={lang.code} value={lang.code}>
                                        {lang.flag} {lang.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <Textarea
                        placeholder="La traducción aparecerá aquí..."
                        value={translatedText}
                        readOnly
                        className="min-h-[200px] resize-none bg-muted/50"
                    />
                    {translatedText && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={copyTranslation}
                            className="w-full"
                        >
                            <Copy className="h-4 w-4 mr-2" />
                            Copiar Traducción
                        </Button>
                    )}
                </Card>
            </div>

            <div className="flex gap-2 justify-center">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={swapLanguages}
                    disabled={sourceLang === "auto"}
                >
                    <ArrowRight className="h-4 w-4 rotate-90" />
                </Button>
                <Button
                    onClick={translate}
                    disabled={!sourceText || isTranslating}
                    className="flex-1 max-w-xs"
                >
                    {isTranslating ? (
                        <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Traduciendo...
                        </>
                    ) : (
                        <>
                            <Languages className="h-4 w-4 mr-2" />
                            Traducir
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
