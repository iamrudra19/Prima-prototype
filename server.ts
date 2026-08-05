import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const isProd = process.env.NODE_ENV === "production";
const PORT = 3000;

let aiInstance: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined in Settings > Secrets. Please set it in AI Studio to use the live AI Spec Collector.");
    }
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // API Route for live AI Spec collection
  app.post("/api/spec-collector", async (req, res) => {
    try {
      const { rawEnquiry, messages } = req.body;
      
      const ai = getGeminiClient();

      const prompt = `
You are Prima Equipment's technical enquiry assistant for CEMS (Continuous Emission Monitoring System) / OCEMS (Online Continuous Emission Monitoring System), CAAQMS (Continuous Ambient Air Quality Monitoring System), gas detection and gas analyzers.
We are compiling a technical 'Enquiry Brief' for a sales engineer.

The raw enquiry received was:
"${rawEnquiry}"

Here is the conversation history so far:
${messages.map((m: any) => `${m.sender === 'user' ? 'Customer' : 'AI'}: ${m.text}`).join('\n')}

Based on the raw enquiry and conversation history, extract or update the following 8 fields.
If a field is not yet known or not mentioned, return null for it.

Fields:
1. industryPlantType: Industry and plant type (e.g., Cement, Power, Chemical, Sugar, Pharma, Refinery, Steel, Fertilizer).
2. complianceDriver: Must be EXACTLY one of: "CPCB OCEMS mandate", "SPCB consent condition", "MoEFCC EC condition", "internal", or null if not provided.
3. parametersToMonitor: Parameters to monitor (e.g., SO2, NOx, PM, CO, CO2, O2, flow, temperature, Cl2, NH3, H2S).
4. monitoringPointsCount: Number of stacks or monitoring points, e.g. "1 stack", "3 boilers".
5. stackDetails: Sizing, physical and gas specifications (height, temperature, dust load, diameter, etc.).
6. newOrRetrofit: Must be: "New installation" or "Retrofit/replacement" or null if not provided.
7. timeline: e.g. "Immediate", "Within 3 months", "Budgetary stage only".
8. budgetStage: e.g. "Approved budget", "Budgetary pricing needed", "Awaiting approval".

Also check if the customer looks like a reseller, dealer, trader, or consultant (e.g., "representing a client", "procurement agent", "EPC contractor", "trading company" etc.).
- isResellerTrader: true/false. Set to true if they look like a reseller, contractor, trader or consultant.
- isEndCustomerClarified: true if we already know the end customer's name and location (especially who the end user is and where the facility is), false otherwise.

Next Question Logic:
- If isResellerTrader is true AND isEndCustomerClarified is false, ask one polite question to qualify the end-customer name and location. E.g., "Could you please specify the name and location of the end customer/facility where the systems will be installed?"
- Otherwise, ask EXACTLY ONE follow-up question for the most important missing field among the 8 fields. Do not ask for multiple fields at once. Keep the question friendly, professional, and targeted.
- Keep the tone highly professional, polite, and technical.
- If the latest customer response is in Hindi (or primarily Hindi like 'Humare boiler...', 'sir, hume...'), reply in fluent professional Hindi.
- If all 8 fields are filled with non-null values, nextQuestion can be a polite summary greeting indicating that the brief is ready, and set emailDraft to a professional auto-drafted email summarizing the collected specs and thanking them, signed by Prima Technical Support Team.
- Otherwise, if any fields are missing, emailDraft must be null.
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              industryPlantType: { type: Type.STRING, description: "Extracted industry and plant type, or null." },
              complianceDriver: { type: Type.STRING, description: "Compliance driver. Must be exactly: 'CPCB OCEMS mandate', 'SPCB consent condition', 'MoEFCC EC condition', 'internal', or null." },
              parametersToMonitor: { type: Type.STRING, description: "Parameters to monitor, or null." },
              monitoringPointsCount: { type: Type.STRING, description: "Number of stacks or monitoring points, or null." },
              stackDetails: { type: Type.STRING, description: "Stack details such as height, temperature, dust load, or null." },
              newOrRetrofit: { type: Type.STRING, description: "Is this a new plant or retrofit, or null." },
              timeline: { type: Type.STRING, description: "Project timeline, or null." },
              budgetStage: { type: Type.STRING, description: "Budget stage, or null." },
              isResellerTrader: { type: Type.BOOLEAN, description: "Set to true if the sender is a reseller/consultant." },
              isEndCustomerClarified: { type: Type.BOOLEAN, description: "Has the end customer been clarified?" },
              nextQuestion: { type: Type.STRING, description: "Polite, professional response or follow-up question. Hindi if customer wrote in Hindi." },
              emailDraft: { type: Type.STRING, description: "If all 8 fields are filled, auto-draft email, otherwise null." },
            },
            required: [
              "industryPlantType",
              "complianceDriver",
              "parametersToMonitor",
              "monitoringPointsCount",
              "stackDetails",
              "newOrRetrofit",
              "timeline",
              "budgetStage",
              "isResellerTrader",
              "isEndCustomerClarified",
              "nextQuestion",
              "emailDraft"
            ]
          }
        }
      });

      const responseText = response.text;
      if (!responseText) {
        return res.status(500).json({ error: "Empty response received from the Gemini API model" });
      }

      res.setHeader("Content-Type", "application/json");
      res.send(responseText);
    } catch (error: any) {
      console.error("Error in spec-collector route:", error);
      res.status(500).json({ error: error.message || "An error occurred during Gemini API extraction." });
    }
  });

  // API Route for live AI Outreach email generation
  app.post("/api/generate-outreach-draft", async (req, res) => {
    try {
      const { company, contactPerson, designation, location, triggerContext } = req.body;
      const ai = getGeminiClient();

      const prompt = `
You are a senior sales manager at Prima Equipment, India's leading manufacturer of high-end CEMS (Continuous Emission Monitoring System) and online pollution analyzers.
Draft a highly personalized, professional B2B intro email (Email 1) targeting a plant stakeholder with the following details:
- Company Name: ${company}
- Contact Person: ${contactPerson}
- Designation: ${designation}
- Location: ${location}
- Environmental Compliance Trigger context: ${triggerContext || "Interested in state-of-the-art CEMS analyzers"}

Guidelines:
1. Tone: Professional Indian B2B, respectful, solution-oriented. Refer to Indian environmental standards (CPCB, SPCB guidelines).
2. Explicitly reference their compliance trigger (e.g. their new Consent to Operate/Establish, or local pollution control board deadline) if provided.
3. Keep it under 120 words.
4. Structure:
   - Subject: [Clear, high-intent, and professional subject line]
   - Dear [Contact Person Name],
   - [Body paragraphs referencing the recent state approval/trigger and our CEMS/OCEMS solutions that match SPCB/CPCB mandates. Mention that we provide certified, robust systems with excellent local service support.]
   - [A brief, polite CTA to schedule a brief technical call or discuss stack dimensions.]
   - Best regards,
   - Team Prima Equipment
5. Return ONLY the drafted email with Subject and Body. Do not include any extra notes, explanations, markdown, or chatty commentary.
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
      });

      const responseText = response.text;
      if (!responseText) {
        return res.status(500).json({ error: "Empty response received from the Gemini API model" });
      }

      res.json({ draft: responseText });
    } catch (error: any) {
      console.error("Error in generate-outreach-draft route:", error);
      res.status(500).json({ error: error.message || "An error occurred during draft generation." });
    }
  });

  // Serve static files or setup Vite in dev mode
  if (!isProd) {
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
    console.log(`Server running on http://0.0.0.0:${PORT} (Prod: ${isProd})`);
  });
}

startServer();
