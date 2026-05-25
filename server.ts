import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API ROUTES ---

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Gemini AI Chat Proxy
  app.post("/api/gemini/chat", async (req, res) => {
    try {
      const { messages } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Invalid messages array" });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.json({ 
          text: "I am ready to help you plan your Himalayan adventure! (Note: Please set GEMINI_API_KEY inside your Settings menu to get fully-functional AI recommendations)." 
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const contents = messages.map((m: any) => ({
        role: m.role === 'bot' ? 'model' : 'user',
        parts: [{ text: m.text }]
      }));

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction: "You are Tripetrip's personal travel assistant. You help users plan trips, find hidden gems, and manage their travel business. REBRANDING NOTE: Never use the word 'Hotels', always use 'Stays' (which includes BnBs, camping, hostels, etc.). Be helpful, enthusiastic, and local-first. ALWAYS use Markdown for structure (headers, bold text, bullet points) to ensure responses are beautiful and easy to read. Keep responses concise and friendly."
        }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: error.message || "Failed to generate content" });
    }
  });

  // Gemini AI Insights Proxy
  app.post("/api/gemini/insights", async (req, res) => {
    try {
      const { bookingData } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.json({ 
          text: "To get actual business insights on pricing and occupancy trends, please set GEMINI_API_KEY in the Settings menu." 
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `You are a business advice bot for Tripetrip travel marketplace vendors. Review this vendor metrics: ${JSON.stringify(bookingData)}. Based on listingsCount, revenue and occupancy, output 3 actionable, bulleted insights in markdown styling on custom marketing actions, booking slots optimizations or rates adjustments. Keep it positive and under 150 words.`,
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini Insights Error:", error);
      res.status(500).json({ error: error.message || "Failed to generate insights" });
    }
  });

  // Razorpay Escrow Order Creation (Example)
  app.post("/api/payments/create-order", async (req, res) => {
    try {
      // In a real app, you'd use razorpay SDK here with your secret key
      // const razorpay = new Razorpay({ key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
      // const order = await razorpay.orders.create({ amount, currency: 'INR', receipt: 'receipt#1' });
      res.json({ message: "Order creation endpoint ready (Secret Key Secured)", order_id: "fake_order_123" });
    } catch (error) {
      res.status(500).json({ error: "Payment initiation failed" });
    }
  });

  // Cloudinary Signed Uploads (Security)
  app.get("/api/cloudinary/sign", (req, res) => {
    // Return signature for frontend to upload directly to Cloudinary
    res.json({ signature: "fake_sig", timestamp: Date.now() });
  });

  // --- VITE MIDDLEWARE ---

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Tripetrip Server running on http://localhost:${PORT}`);
  });
}

startServer();
