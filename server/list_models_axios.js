
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;
const URL = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

async function listModels() {
    try {
        const response = await axios.get(URL);
        const models = response.data.models;
        const fs = await import('fs');
        const validModels = models.map(m => m.name).filter(n => n.includes('gemini'));
        fs.writeFile('working_models.txt', validModels.join('\n'), (err) => {
            if (err) console.error(err);
            else console.log("Saved to working_models.txt");
        });
    } catch (error) {
        console.error("Error fetching models:", error.response?.data || error.message);
    }
}

listModels();
