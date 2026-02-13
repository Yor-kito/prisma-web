import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export const maxDuration = 60;

export async function POST(req: Request) {
    try {
        const { messages, context, data } = await req.json();

        console.log("=== Chat Request ===");
        console.log("Messages count:", messages?.length);
        if (data) console.log("Attachments included");

        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

        if (!apiKey) {
            return new Response(JSON.stringify({ error: "API key not configured" }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Detect language from context
        const detectLanguage = (text: string): string => {
            if (!text) return 'Spanish';

            const spanishWords = ['el', 'la', 'de', 'que', 'y', 'en', 'un', 'ser', 'se', 'no', 'haber', 'por', 'con', 'su', 'para', 'como', 'estar', 'tener', 'le', 'lo', 'todo', 'pero', 'más', 'hacer', 'o', 'poder', 'decir', 'este', 'ir', 'otro', 'ese', 'la', 'si', 'me', 'ya', 'ver', 'porque', 'dar', 'cuando', 'él', 'muy', 'sin', 'vez', 'mucho', 'saber', 'qué', 'sobre', 'mi', 'alguno', 'mismo', 'yo', 'también', 'hasta', 'año', 'dos', 'querer', 'entre', 'así', 'primero', 'desde', 'grande', 'eso', 'ni', 'nos', 'llegar', 'pasar', 'tiempo', 'ella', 'sí', 'día', 'uno', 'bien', 'poco', 'deber', 'entonces', 'poner', 'cosa', 'tanto', 'hombre', 'parecer', 'nuestro', 'tan', 'donde', 'ahora', 'parte', 'después', 'vida', 'quedar', 'siempre', 'creer', 'hablar', 'llevar', 'dejar', 'nada', 'cada', 'seguir', 'menos', 'nuevo', 'encontrar', 'algo', 'solo', 'decir', 'salir', 'volver', 'tomar', 'conocer', 'vivir', 'sentir', 'tratar', 'mirar', 'contar', 'empezar', 'esperar', 'buscar', 'existir', 'entrar', 'trabajar', 'escribir', 'perder', 'producir', 'ocurrir', 'entender', 'pedir', 'recibir', 'recordar', 'terminar', 'permitir', 'aparecer', 'conseguir', 'comenzar', 'servir', 'sacar', 'necesitar', 'mantener', 'resultar', 'leer', 'caer', 'cambiar', 'presentar', 'crear', 'abrir', 'considerar', 'oír', 'acabar', 'mil', 'contra', 'cual'];
            const englishWords = ['the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us'];

            const lowerText = text.toLowerCase();
            let spanishCount = 0;
            let englishCount = 0;

            spanishWords.forEach(word => {
                if (lowerText.includes(` ${word} `)) spanishCount++;
            });

            englishWords.forEach(word => {
                if (lowerText.includes(` ${word} `)) englishCount++;
            });

            return spanishCount > englishCount ? 'Spanish' : 'English';
        };

        const documentLanguage = detectLanguage(context || '');

        const systemPrompt = `You are an intelligent study assistant named PRISMA AI.
Your goal is to help students understand their study material better using the Socratic method.

CRITICAL: You MUST respond in ${documentLanguage}. This is the language of the student's document.

${context ? `Context from student's document:\n${context.substring(0, 15000)}` : 'No document provides yet.'}

Guidelines:
1. ALWAYS respond in ${documentLanguage}, matching the language of the document or text provided.
2. If the user sends an IMAGE, analyze it carefully to help with questions, diagrams, or handwritten notes.
3. Use the Socratic method: guide students to discover answers through thoughtful questions.
4. If context is provided, prioritize answering based on that context.
5. Use markdown for formatting.
6. Keep responses educational and encouraging.`;

        // Prepare content for multimodal support
        const lastMessage = messages[messages.length - 1];
        let content: any[] = [{ type: 'text', text: lastMessage.content }];

        // Add images if provided
        if (data && Array.isArray(data)) {
            data.forEach((item: any) => {
                if (item.type === 'image') {
                    content.push({
                        type: 'image',
                        image: item.image, // base64 string
                        mimeType: item.mimeType || 'image/jpeg'
                    });
                }
            });
        }

        // Update the last message with multimodal content
        const updatedMessages = [
            ...messages.slice(0, messages.length - 1),
            { ...lastMessage, content: content }
        ];

        const result = streamText({
            model: google('gemini-2.0-flash-lite'), // Vision capable
            system: systemPrompt,
            messages: updatedMessages,
        });

        return result.toTextStreamResponse();

    } catch (error: any) {
        console.error("=== Chat Error ===");
        console.error("Error:", error.message);

        return new Response(JSON.stringify({
            error: error.message || String(error)
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
