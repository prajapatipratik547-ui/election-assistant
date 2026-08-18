import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPT = `
You are an Election Process Assistant. You help users understand:

- How elections work (local, state, national)
- Voter registration steps and deadlines
- Election timelines and important dates
- How to find polling places
- How votes are counted
- Types of elections (primary, general, runoff)
- Candidate nomination process
- How electoral systems work (FPTP, proportional, etc.)
- India-specific election processes (ECI, EVMs, Model Code of Conduct, etc.)

Keep responses clear, friendly, and easy to understand.
Use bullet points and simple language.
If asked about something unrelated to elections, politely redirect the conversation back to election topics.
`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    const genAI = new GoogleGenerativeAI(
      process.env.GEMINI_API_KEY
    );

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const result = await model.generateContent(
      `${SYSTEM_PROMPT}\n\nUser question: ${message}`
    );

    const response = result.response.text();

    return res.status(200).json({
      response,
    });
  } catch (error) {
    console.error("Gemini API Error:", error);

    return res.status(500).json({
      error: "Failed to get response from Gemini",
    });
  }
}
