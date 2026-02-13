import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export const maxDuration = 60;

export async function POST(req: Request) {
    try {
        const { text, targetLanguage, sourceLanguage = 'auto' } = await req.json();

        if (!text || !targetLanguage) {
            return Response.json({
                error: "Text and target language are required"
            }, { status: 400 });
        }

        const languageNames: Record<string, string> = {
            es: "español",
            en: "inglés",
            fr: "francés",
            de: "alemán",
            it: "italiano",
            pt: "portugués",
            zh: "chino",
            ja: "japonés",
            ko: "coreano",
            ru: "ruso",
        };

        const targetLangName = languageNames[targetLanguage] || targetLanguage;
        const sourceLangName = sourceLanguage === 'auto'
            ? "el idioma detectado automáticamente"
            : languageNames[sourceLanguage];

        const { text: translation } = await generateText({
            model: google('gemini-2.0-flash-lite'),
            system: `Eres un traductor profesional experto.

Tu tarea es traducir texto de forma precisa y natural, manteniendo:
- El significado original
- El tono y estilo
- Los términos técnicos apropiados
- La estructura cuando sea posible

Proporciona SOLO la traducción, sin explicaciones adicionales.`,
            prompt: `Traduce el siguiente texto de ${sourceLangName} a ${targetLangName}:

${text}`,
        });

        return Response.json({
            translation,
            detectedLanguage: sourceLanguage
        });
    } catch (error: any) {
        console.error("Error translating:", error);
        return Response.json({
            error: "Failed to translate text.",
            details: error.message
        }, { status: 500 });
    }
}
