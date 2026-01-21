
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

async function listModels() {
    try {
        if (!process.env.GEMINI_API_KEY) {
            console.error("No API KEY found");
            return;
        }
        console.log("Using Key ending in:", process.env.GEMINI_API_KEY.slice(-4));
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // Unable to list models directly via simple SDK call in some versions, 
        // but we can try a simple generation on a few candidate names.

        const candidates = [
            "gemini-1.5-flash",
            "gemini-1.5-flash-001",
            "gemini-1.5-pro",
            "gemini-1.5-pro-001",
            "gemini-pro",
            "gemini-1.0-pro",
            "gemini-1.0-pro-latest"
        ];

        console.log("Starting model test loop...");
        for (const modelName of candidates) {
            console.log(`Testing model: ${modelName}...`);
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("Hello");
                const response = await result.response;
                console.log(`✅ SUCCESS: ${modelName}`);
                break; // Stop at first success
            } catch (error) {
                console.log(`❌ FAILED: ${modelName} - ${error.message.split('\n')[0]}`);
            }
        }
    } catch (e) {
        console.error(e);
    }
}

listModels();
