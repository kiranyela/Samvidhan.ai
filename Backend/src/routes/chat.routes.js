import { Router } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = Router();

// Initialize Gemini with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ Use the latest stable model
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Chat route
router.post("/ask", async (req, res) => {
  console.log("problem:", req.body.problem);
  try {
    const { problem, location } = req.body;

    if (!problem) {
      return res.status(400).json({ error: "Problem description is required" });
    }

    // Structured system-level instruction
    const structuredPrompt = `
You are an **AI-powered legal rights assistant for Indian citizens**.  
The user will describe their problem. You must:
1. Identify which **fundamental rights** or **laws** of the Indian Constitution apply.  
2. Explain what rights the user has in clear, simple language.  
3. Mention the **specific articles, acts, or sections of law** that protect those rights.  
4. Suggest **what the user can do next** (step-by-step).  
5. Tell them **where they can file a complaint** — include relevant **government websites, offices, helplines, and addresses** if possible.  
6. If the user provides their **location**, suggest **verified legal aid offices or lawyers nearby** (in general form, no personal info).  
7. Always end with:  
   _"Please verify from official government sources or consult a lawyer before taking any legal action."_

User's problem: "${problem}"
User's location: "${location || "Not provided"}"
`;

    const result = await model.generateContent(structuredPrompt);
    const text = result.response.text();

    return res.status(200).json({ response: text });
  } catch (error) {
    console.error("Gemini API Error:", error.message);
    return res.status(500).json({ error: "Failed to get response from Gemini" });
  }
});

export default router;
