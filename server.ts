import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Google GenAI
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// API Route for Wellness Search Grounding with Gemini 3.8-flash and Google Search tool
app.post('/api/search-grounding', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    const systemInstruction = `You are a certified nutritional scientist and wellness researcher for Go Global Edge.
Your task is to provide objective, educational, evidence-based nutritional summaries of botanical ingredients, vitamins, and minerals.
STRICT COMPLIANCE RULES:
1. Do NOT make unsupported medical claims.
2. Do NOT claim that dietary supplements or ingredients cure, treat, or prevent cancer, infertility, erectile dysfunction, diabetes, kidney stones, or other diseases.
3. Clarify that supplements support general body vitality, metabolism, and normal cellular functions as part of a balanced lifestyle.
4. Ground your answer in recent reputable dietary research.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `${systemInstruction}\n\nUser Question: ${query}`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const candidate = response.candidates?.[0];
    const text = response.text || 'No scientific summary available.';
    const groundingMetadata = candidate?.groundingMetadata;

    const sources: Array<{ title: string; url: string }> = [];
    if (groundingMetadata?.groundingChunks) {
      for (const chunk of groundingMetadata.groundingChunks) {
        if (chunk.web?.uri) {
          sources.push({
            title: chunk.web.title || 'Scientific Reference',
            url: chunk.web.uri,
          });
        }
      }
    }

    const searchQueries: string[] = groundingMetadata?.webSearchQueries || [];

    res.json({
      text,
      sources,
      searchQueries,
    });
  } catch (error: any) {
    console.error('Gemini Search Grounding error:', error);
    res.status(500).json({
      error: error.message || 'Failed to fetch search grounding results',
      text: 'Grounded search is currently offline. Please ensure GEMINI_API_KEY is configured.',
      sources: [],
      searchQueries: [],
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Mount Vite or serve static
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Go Global Edge server running at http://localhost:${PORT}`);
  });
}

startServer();
