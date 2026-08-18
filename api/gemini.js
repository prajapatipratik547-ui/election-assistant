const { GoogleGenerativeAI } = require("@google/generative-ai");

const SYSTEM_PROMPT = `
You are an Election Process Assistant. You help users understand:
- How elections work (local, state, national)
- Voter registration steps and deadlines
- Election timelines and important dates
- How to find polling places
- How votes are counted
- Types of elections (primary, general, runoff)
- Candidate nomination process
- How electoral systems work
- India-specific election processes
- EVMs, Model Code of Conduct, and related election topics

Keep responses clear, friendly, and easy to understand.
Use bullet points and simple language.
If asked about something unrelated to elections, politely redirect the conversation back to election topics.
`;

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    const genAI = new GoogleGenerativeAI(
      process.env.GEMINI_API_KEY
    );

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const chat = model.startChat({
      history: [],
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });

    await chat.sendMessage(SYSTEM_PROMPT);

    const result = await chat.sendMessage(message);

    const response = result.response.text();

    return res.status(200).json({ response });
  } catch (error) {
    console.error("Gemini API Error:", error);

    return res.status(500).json({
      error: "Failed to get response from Gemini",
    });
  }
};
