const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

// Load env locally since dotenv might not be installed
try {
  const envPath = path.resolve(__dirname, '.env.local');
  const envContent = fs.readFileSync(envPath, 'utf8');
  const match = envContent.match(/GEMINI_API_KEY=(.*)/);
  if (match) {
    process.env.GEMINI_API_KEY = match[1].trim();
  }
} catch (e) {
  console.log("Could not read .env.local");
}

async function listModels() {
  if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY not found.");
    return;
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
  try {
    // For listing models, we might need to access the model service directly
    // The SDK simplifies this, but let's try to just get a model and see if it works
    // or if we can use the listModels method if exposed (it is exposed on the manager usually)
    // Actually, looking at docs, genAI.getGenerativeModel is the main entry.
    // There is no direct listModels on the standard GoogleGenerativeAI instance in some versions.
    // However, we can try to infer or just test a fallback 'gemini-pro'.
    
    // Let's try 'gemini-pro' as a test.
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent("Test");
    console.log("gemini-pro works!");
  } catch (error) {
    console.error("gemini-pro failed:", error.message);
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Test");
    console.log("gemini-1.5-flash works!");
  } catch (error) {
    console.error("gemini-1.5-flash failed:", error.message);
  }
}

listModels();
