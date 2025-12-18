import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "No API Key found" }, { status: 500 });
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const modelsToTest = [
    "gemini-1.5-flash",
    "gemini-1.5-flash-latest",
    "gemini-1.5-flash-001",
    "gemini-1.5-flash-8b",
    "gemini-1.5-pro",
    "gemini-1.5-pro-latest",
    "gemini-pro",
    "gemini-1.0-pro"
  ];

  const results: Record<string, string> = {};

  for (const modelName of modelsToTest) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      await model.generateContent("Test");
      results[modelName] = "OK";
    } catch (error: unknown) {
      results[modelName] = error instanceof Error ? error.message : String(error);
    }
  }

  return NextResponse.json({
    apiKeyPrefix: apiKey.substring(0, 4) + "...",
    results
  });
}
