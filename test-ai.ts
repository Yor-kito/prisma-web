
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function testModel(modelName: string) {
    try {
        console.log(`Testing ${modelName}...`);
        const { text } = await generateText({
            model: google(modelName),
            prompt: 'Hello, are you working?',
        });
        console.log(`SUCCESS with ${modelName}:`, text);
        return true;
    } catch (error: any) {
        console.error(`FAILED with ${modelName}:`, error.message?.substring(0, 100) || error);
        return false;
    }
}

async function run() {
    await testModel('gemini-2.0-flash-lite');
    await testModel('gemini-2.0-flash');
}

run();
