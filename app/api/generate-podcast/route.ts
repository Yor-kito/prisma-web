import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export const maxDuration = 60;

export async function POST(req: Request) {
    try {
        console.log("Received podcast generation request");
        const { context } = await req.json();
        console.log("Context length:", context?.length);

        if (!context) {
            console.error("No context provided");
            return Response.json({ error: "Context is required" }, { status: 400 });
        }

        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
        if (!apiKey) {
            console.error("Missing GOOGLE_GENERATIVE_AI_API_KEY");
            return Response.json({ error: "Server configuration error: Missing API Key" }, { status: 500 });
        }

        console.log("Generating podcast script...");
        const { text: script } = await generateText({
            model: google('gemini-2.0-flash-lite'),
            system: `Eres Prisma, un asistente educativo que crea guías de estudio en formato audio.

Tu tarea es transformar el contenido educativo en un script conversacional natural, diseñado para ser escuchado.

REGLAS CRÍTICAS:
1. NO incluyas NINGUNA anotación técnica como "(Intro Music)", "(Host:)", "(Pause)", etc.
2. NO uses formato de guion de podcast con etiquetas de locutor
3. Escribe SOLO el texto que debe ser leído en voz alta
4. Usa un tono amigable y conversacional, como si estuvieras explicando a un amigo

ESTRUCTURA (5-10 minutos de audio):
- Saludo breve e introducción del tema
- Explicación de los conceptos principales con ejemplos claros
- Puntos clave para recordar
- Conclusión breve

ESTILO:
- Usa frases como "vamos a explorar...", "aquí viene lo interesante...", "recuerda que..."
- Divide las ideas complejas en partes simples
- Escribe en oraciones completas diseñadas para ser habladas
- Mantén un ritmo natural de conversación

IDIOMA: Genera el script en el MISMO IDIOMA del contenido fuente.
- Contenido en español → Script en español
- Contenido en inglés → Script en inglés

¡Hazlo interesante y fácil de seguir!`,
            prompt: `Crea una guía de estudio en audio a partir de este contenido. Recuerda: SOLO texto para ser leído, sin anotaciones técnicas:\n\n${context}`,
        });

        console.log("Podcast script generated, length:", script.length);

        return Response.json({
            script,
            estimatedDuration: Math.ceil(script.length / 150) // rough estimate: 150 chars per minute
        });
    } catch (error: any) {
        console.error("Error generating podcast:", error);
        console.error("Error details:", JSON.stringify(error, Object.getOwnPropertyNames(error)));

        // Check if it's a quota error
        const errorMessage = error.message || '';
        if (errorMessage.includes('quota') || errorMessage.includes('Quota exceeded')) {
            return Response.json({
                error: "Límite de API alcanzado. Por favor, espera un momento e inténtalo de nuevo.",
                details: "Has alcanzado el límite de solicitudes gratuitas. La cuota se reinicia cada minuto."
            }, { status: 429 });
        }

        return Response.json({
            error: "Failed to generate podcast script.",
            details: error.message
        }, { status: 500 });
    }
}
