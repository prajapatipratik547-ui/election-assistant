import { useState, useRef, useEffect } from "react";

import "./App.css";



const SYSTEM_PROMPT = `You are an Election Process Assistant. You help users understand:
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
If asked about something unrelated to elections, politely redirect the conversation back to election topics.`;

const QUICK_QUESTIONS = {
  en: [
    "How do I register to vote?",
    "How does the election process work in India?",
    "What is EVM and how does it work?",
    "What are the steps on election day?",
    "How are votes counted?",
    "What is Model Code of Conduct?",
  ],
  hi: [
    "मैं मतदाता पंजीकरण कैसे करूं?",
    "भारत में चुनाव प्रक्रिया कैसे काम करती है?",
    "EVM क्या है और यह कैसे काम करता है?",
    "चुनाव के दिन क्या होता है?",
    "वोट कैसे गिने जाते हैं?",
    "आदर्श आचार संहिता क्या है?",
  ],
};

const TIMELINE_STEPS = [
  { icon: "📢", title: "Election Announcement", desc: "Election Commission announces election dates and schedule", color: "#6366f1" },
  { icon: "📋", title: "Voter Registration", desc: "Citizens register to vote. Deadline is usually 30 days before election", color: "#8b5cf6" },
  { icon: "🏛️", title: "Candidate Nomination", desc: "Political parties and independents file nomination papers", color: "#a855f7" },
  { icon: "✅", title: "Scrutiny of Nominations", desc: "Election officers verify all nomination documents", color: "#ec4899" },
  { icon: "🚫", title: "Withdrawal of Candidature", desc: "Candidates can withdraw before the deadline", color: "#f43f5e" },
  { icon: "📣", title: "Election Campaign", desc: "Candidates campaign and present their agenda to voters", color: "#f97316" },
  { icon: "🔇", title: "Campaign Silence Period", desc: "48 hours before polling, all campaigning must stop", color: "#eab308" },
  { icon: "🗳️", title: "Polling Day", desc: "Voters cast their votes at designated polling booths", color: "#22c55e" },
  { icon: "🔢", title: "Vote Counting", desc: "Votes are counted under strict supervision", color: "#06b6d4" },
  { icon: "🏆", title: "Results & Winner", desc: "Winner is declared and forms the government", color: "#3b82f6" },
];

const QUIZ_QUESTIONS = [
  { q: "What does EVM stand for?", options: ["Electronic Voting Machine", "Election Verification Method", "Electoral Vote Monitor", "Electronic Vote Manager"], ans: 0 },
  { q: "Who conducts elections in India?", options: ["Supreme Court", "Parliament", "Election Commission of India", "President of India"], ans: 2 },
  { q: "What is the minimum age to vote in India?", options: ["16", "18", "21", "25"], ans: 1 },
  { q: "What is Model Code of Conduct?", options: ["A law passed by Parliament", "Guidelines for candidates during elections", "Rules for counting votes", "Registration process"], ans: 1 },
  { q: "How many days before election does campaign silence begin?", options: ["24 hours", "48 hours", "72 hours", "1 week"], ans: 1 },
  { q: "What is NOTA in Indian elections?", options: ["None Of The Above", "National Order of Total Abstention", "No Official Total Accounting", "National Other Total Average"], ans: 0 },
];

export default function App() {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "👋 Hello! I'm your Election Process Assistant. I can help you understand how elections work, voter registration, timelines, and much more!\n\nWhat would you like to know about elections?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [copied, setCopied] = useState(null);
  const [lang, setLang] = useState("en");
  const [activeTab, setActiveTab] = useState("chat");
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizAnswered, setQuizAnswered] = useState(null);
  const [quizDone, setQuizDone] = useState(false);
  const chatRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    document.body.className = darkMode ? "dark" : "light";
  }, [darkMode]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText) return;
    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setInput("");
    setLoading(true);
    try {
     const response = await fetch("/api/gemini", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    message: `${SYSTEM_PROMPT}\n\nUser question: ${userText}`,
  }),
});

if (!response.ok) {
  throw new Error("Failed to get response from Gemini");
}

const data = await response.json();

setMessages((prev) => [
  ...prev,
  { role: "assistant", text: data.response },
]);

} catch (error) {
  setMessages((prev) => [
    ...prev,
    { role: "assistant", text: "Error: " + error.message },
  ]);
}

setLoading(false);
};

  const clearChat = () => {
    chatRef.current = null;
    setMessages([{ role: "assistant", text: "👋 Hello! I'm your Election Process Assistant. What would you like to know about elections?" }]);
  };

  const copyMessage = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleQuizAnswer = (index) => {
    if (quizAnswered !== null) return;
    setQuizAnswered(index);
    if (index === QUIZ_QUESTIONS[quizIndex].ans) setQuizScore((s) => s + 1);
  };

  const nextQuiz = () => {
    if (quizIndex + 1 >= QUIZ_QUESTIONS.length) {
      setQuizDone(true);
    } else {
      setQuizIndex((i) => i + 1);
      setQuizAnswered(null);
    }
  };

  const resetQuiz = () => {
    setQuizIndex(0);
    setQuizScore(0);
    setQuizAnswered(null);
    setQuizDone(false);
  };

  const formatText = (text) =>
    text.split("\n").map((line, i) => (<span key={i}>{line}<br /></span>));

  return (
    <div className={`app ${darkMode ? "dark" : "light"}`}>
      <header className="header">
        <div className="header-icon">🗳️</div>
        <div className="header-text">
          <h1>{lang === "en" ? "Election Assistant" : "चुनाव सहायक"}</h1>
          <p>{lang === "en" ? "Your guide to understanding elections" : "चुनाव समझने में आपका मार्गदर्शक"}</p>
        </div>
        <div className="header-actions">
          <button className="lang-btn" onClick={() => setLang(lang === "en" ? "hi" : "en")}>
            {lang === "en" ? "🇮🇳 हिंदी" : "🇬🇧 English"}
          </button>
          <button className="icon-btn" onClick={clearChat} title="Clear chat">🗑️</button>
          <button className="icon-btn" onClick={() => setDarkMode(!darkMode)} title="Toggle theme">
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>
      </header>

      <div className="tabs">
        {["chat", "timeline", "quiz"].map((tab) => (
          <button key={tab} className={`tab-btn ${activeTab === tab ? "active" : ""}`} onClick={() => setActiveTab(tab)}>
            {tab === "chat" ? "💬 Chat" : tab === "timeline" ? "📅 Timeline" : "🧠 Quiz"}
          </button>
        ))}
      </div>

      {activeTab === "chat" && (
        <>
          <div className="quick-questions">
            {QUICK_QUESTIONS[lang].map((q, i) => (
              <button key={i} className="quick-btn" onClick={() => sendMessage(q)}>{q}</button>
            ))}
          </div>
          <div className="chat-box">
            {messages.map((msg, i) => (
              <div key={i} className={`message ${msg.role}`}>
                <div className="bubble">
                  {formatText(msg.text)}
                  {msg.role === "assistant" && (
                    <button className="copy-btn" onClick={() => copyMessage(msg.text, i)}>
                      {copied === i ? "✅ Copied!" : "📋 Copy"}
                    </button>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="message assistant">
                <div className="bubble typing-bubble">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <div className="input-area">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder={lang === "en" ? "Ask me anything about elections..." : "चुनाव के बारे में कुछ भी पूछें..."}
              disabled={loading}
            />
            <button onClick={() => sendMessage()} disabled={loading}>
              {lang === "en" ? "Send 🚀" : "भेजें 🚀"}
            </button>
          </div>
        </>
      )}

      {activeTab === "timeline" && (
        <div className="timeline-box">
          <h2 className="section-title">🗓️ {lang === "en" ? "Indian Election Timeline" : "भारतीय चुनाव प्रक्रिया"}</h2>
          <div className="timeline">
            {TIMELINE_STEPS.map((step, i) => (
              <div key={i} className="timeline-step">
                <div className="timeline-icon" style={{ background: step.color }}>{step.icon}</div>
                <div className="timeline-line" style={{ background: i < TIMELINE_STEPS.length - 1 ? step.color : "transparent" }}></div>
                <div className="timeline-content">
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "quiz" && (
        <div className="quiz-box">
          {!quizDone ? (
            <>
              <div className="quiz-header">
                <h2>🧠 {lang === "en" ? "Election Knowledge Quiz" : "चुनाव ज्ञान प्रश्नोत्तरी"}</h2>
                <span className="quiz-progress">{quizIndex + 1} / {QUIZ_QUESTIONS.length}</span>
              </div>
              <div className="quiz-score-bar">
                <div className="quiz-score-fill" style={{ width: `${((quizIndex) / QUIZ_QUESTIONS.length) * 100}%` }}></div>
              </div>
              <div className="quiz-question">
                <h3>{QUIZ_QUESTIONS[quizIndex].q}</h3>
                <div className="quiz-options">
                  {QUIZ_QUESTIONS[quizIndex].options.map((opt, i) => (
                    <button
                      key={i}
                      className={`quiz-opt ${quizAnswered !== null ? i === QUIZ_QUESTIONS[quizIndex].ans ? "correct" : i === quizAnswered ? "wrong" : "" : ""}`}
                      onClick={() => handleQuizAnswer(i)}
                      disabled={quizAnswered !== null}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                {quizAnswered !== null && (
                  <button className="next-btn" onClick={nextQuiz}>
                    {quizIndex + 1 >= QUIZ_QUESTIONS.length ? "See Results 🏆" : "Next Question →"}
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="quiz-result">
              <div className="result-icon">{quizScore >= 5 ? "🏆" : quizScore >= 3 ? "👍" : "📚"}</div>
              <h2>{lang === "en" ? "Quiz Complete!" : "प्रश्नोत्तरी पूर्ण!"}</h2>
              <p className="result-score">{quizScore} / {QUIZ_QUESTIONS.length}</p>
              <p className="result-msg">
                {quizScore >= 5 ? "Excellent! You're an election expert! 🌟" : quizScore >= 3 ? "Good job! Keep learning! 👏" : "Keep exploring the Chat tab to learn more! 📖"}
              </p>
              <button className="next-btn" onClick={resetQuiz}>Try Again 🔄</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
