import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export const maxDuration = 60;

export async function POST(req: Request) {
    try {
        const { topic, context, essayType = 'argumentative', wordCount = 500 } = await req.json();

        if (!topic) {
            return Response.json({ error: "Topic is required" }, { status: 400 });
        }

        const essayTypes = {
            argumentative: "argumentativo con tesis clara, argumentos y contraargumentos",
            expository: "expositivo que explique el tema de forma clara y objetiva",
            narrative: "narrativo que cuente una historia relacionada con el tema",
            descriptive: "descriptivo que detalle el tema con precisión",
        };

        const typeDescription = essayTypes[essayType as keyof typeof essayTypes] || essayTypes.argumentative;

        const result = await streamText({
            model: google('gemini-2.0-flash-lite'),
            system: `Eres Prisma, un asistente educativo experto en redacción académica.

Tu tarea es ayudar a estructurar y desarrollar ensayos de alta calidad.

IMPORTANTE: Genera el ensayo en el MISMO IDIOMA que el tema proporcionado.
- Si el tema está en español, escribe en español
- Si el tema está en inglés, escribe en inglés

Estructura del ensayo:
1. **Introducción**: Presenta el tema y la tesis principal
2. **Desarrollo**: 3-4 párrafos con argumentos bien fundamentados
3. **Conclusión**: Cierra el ensayo reforzando la tesis

Características:
- Usa lenguaje académico pero accesible
- Incluye transiciones fluidas entre párrafos
- Cita ejemplos cuando sea relevante
- Mantén coherencia y cohesión
- Aproximadamente ${wordCount} palabras`,
            prompt: `Tema: ${topic}

Tipo de ensayo: ${typeDescription}

${context ? `Contexto adicional:\n${context}` : ''}

Genera un ensayo completo y bien estructurado.`,
        });

        return result.toTextStreamResponse();
    } catch (error: any) {
        console.error("Error generating essay:", error);
        return Response.json({
            error: "Failed to generate essay.",
            details: error.message
        }, { status: 500 });
    }
}
