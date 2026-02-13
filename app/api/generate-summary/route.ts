import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';

export const maxDuration = 60;

export async function POST(req: Request) {
    try {
        console.log("Received summary generation request");
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

        console.log("Calling Google model for summary generation...");
        const { object } = await generateObject({
            model: google('gemini-2.0-flash-lite'),
            system: `You are Prisma, an educational assistant creating document summaries.
Based on the provided text, create:
1. A brief summary (2-3 sentences) capturing the main idea
2. A list of 3-5 key takeaways (important points to remember)
3. A longer detailed summary (100-150 words) covering main concepts

IMPORTANT: Generate ALL content in the SAME LANGUAGE as the source text.
- If the text is in Spanish, write in Spanish
- If the text is in English, write in English
- Match the language automatically`,
            prompt: context,
            schema: z.object({
                briefSummary: z.string().describe("A brief 2-3 sentence summary"),
                keyTakeaways: z.array(z.string()).describe("List of 3-5 key points to remember"),
                detailedSummary: z.string().describe("A longer, more detailed summary (100-150 words)"),
            }),
        });

        console.log("Generated summary");
        return Response.json(object);
    } catch (error) {
        console.error("Error generating summary:", error);
        return Response.json({ error: "Failed to generate summary." }, { status: 500 });
    }
}
