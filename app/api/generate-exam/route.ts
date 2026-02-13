import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';

export const maxDuration = 60;

export async function POST(req: Request) {
    try {
        console.log("Received exam generation request");
        const { context, numQuestions = 10 } = await req.json();
        console.log("Context length:", context?.length, "Num questions:", numQuestions);

        if (!context) {
            console.error("No context provided");
            return Response.json({ error: "Context is required" }, { status: 400 });
        }

        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
        if (!apiKey) {
            console.error("Missing GOOGLE_GENERATIVE_AI_API_KEY");
            return Response.json({ error: "Server configuration error: Missing API Key" }, { status: 500 });
        }

        console.log("Calling Google model for exam generation...");
        const { object } = await generateObject({
            model: google('gemini-2.0-flash-lite'),
            system: `Eres Prisma, un asistente educativo que crea preguntas de examen.
Basándote en el texto proporcionado, genera ${numQuestions} preguntas de opción múltiple que evalúen la comprensión de los conceptos clave.
Cada pregunta debe tener 4 opciones de respuesta (A, B, C, D) con solo una respuesta correcta.
Proporciona una explicación clara de por qué la respuesta correcta es la adecuada.

IMPORTANTE: Genera las preguntas del examen en el MISMO IDIOMA que el texto fuente.
- Si el texto está en español, escribe las preguntas en español
- Si el texto está en inglés, escribe las preguntas en inglés
- Detecta y usa el idioma automáticamente según la entrada`,
            prompt: context,
            schema: z.object({
                questions: z.array(z.object({
                    question: z.string().describe("The question text"),
                    options: z.object({
                        A: z.string(),
                        B: z.string(),
                        C: z.string(),
                        D: z.string(),
                    }).describe("Four answer options"),
                    correctAnswer: z.enum(['A', 'B', 'C', 'D']).describe("The letter of the correct answer"),
                    explanation: z.string().describe("Explanation of why this answer is correct"),
                })).describe(`Array of exactly ${numQuestions} exam questions`),
            }),
        });

        console.log("Generated", object.questions.length, "questions");
        return Response.json(object);
    } catch (error) {
        console.error("Error generating exam:", error);
        return Response.json({ error: "Failed to generate exam." }, { status: 500 });
    }
}
