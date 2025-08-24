// app/api/recommend-query/route.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_API_KEY } from "@/lib/env";

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title } = body;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are helping to recommend YouTube videos. Given this video title: "${title}", 
suggest a short YouTube search query (5 words max) that would bring up closely related videos and also make sure that youtube doesn't return the same videos in the suggestion  
Only return the query, nothing else.`;

    const result = await model.generateContent(prompt);
    const query = result.response.text().trim();

    return new Response(JSON.stringify({ query }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Gemini API error:", err);
    return new Response(JSON.stringify({ error: "Gemini failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
