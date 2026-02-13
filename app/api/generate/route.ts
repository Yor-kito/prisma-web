import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';

export const maxDuration = 60;

export async function POST(req: Request) {
    try {
        console.log("Received generate request");
        const { context } = await req.json();
        console.log("Context length:", context?.length);

        if (!context) {
            console.error("No context provided");
            return Response.json({ error: "Context is required" }, { status: 400 });
        }

        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
        console.log("API Key present:", !!apiKey);
        if (!apiKey) {
            console.error("Missing GOOGLE_GENERATIVE_AI_API_KEY");
            return Response.json({ error: "Server configuration error: Missing API Key" }, { status: 500 });
        }

        console.log("Calling Google model...");
        const { object } = await generateObject({
            model: google('gemini-2.0-flash-lite'),
            system: `You are PRISMA AI. Based on the provided study material, generate a set of study aids.
        
        1. A Mermaid.js graph definition (Flowchart) representing the key hierarchy of concepts.
           - Start with "graph TD"
           - Use valid node names (alphanumeric only) and labels in brackets: A[Concept Label]
           - Connect them with arrows: A --> B
           - DO NOT use special characters (like quotes, parentheses, brackets, or commas) INSIDE labels if possible, or use double quotes if necessary: A["Label with, comma"]
           - Keep the hierarchy simple (maximum 15-20 nodes).
        
        2. A set of 5-10 flashcards (Front/Back) focusing on key facts and definitions.
        
        CRITICAL: Detect the language of the provided text and extract ALL information in that same language.
        If the text is Spanish, everything must be in Spanish.
        `,
            prompt: context,
            schema: z.object({
                mindMap: z.string().describe("A valid mermaid.js graph definition string."),
                flashcards: z.array(z.object({
                    front: z.string(),
                    back: z.string(),
                })).describe("A list of flashcards for studying."),
            }),
        });

        console.log("Generation successful. MindMap snippet:", object.mindMap.substring(0, 100));
        return Response.json(object);
    } catch (error: any) {
        console.error("Error generating artifacts:", error);
        console.error("Error details:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
        return Response.json({
            error: "Failed to generate study aids.",
            details: error.message
        }, { status: 500 });
    }
}
