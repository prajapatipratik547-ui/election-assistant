# 🗳️ Election Assistant

> An AI-powered interactive assistant that helps users understand the election process, voter registration, timelines, and election-related concepts in a simple and accessible way.

<p align="center">

  <strong>Built with React + Vite + Google Gemini AI</strong>

</p>

---

## 🚀 Overview

Election Assistant is an AI-powered web application designed to make election-related information easier to understand.

The application combines a conversational AI assistant with an interactive election timeline and knowledge quiz, allowing users to learn about elections through conversation and interactive experiences.

The AI assistant is powered by **Google Gemini 2.5 Flash** and uses a custom system prompt to keep responses focused on election-related topics.

---

## 🎯 Problem

Election processes can involve many steps, rules, deadlines, and concepts that may be difficult for citizens to understand.

Users may have questions such as:

- How do I register to vote?
- How does the election process work?
- What is an EVM?
- How are votes counted?
- What happens on polling day?
- What is the Model Code of Conduct?

Election Assistant provides a simple conversational interface for exploring these topics.

---

## 💡 Solution

The application provides three main experiences:

### 💬 AI Election Assistant

Users can ask questions about elections and receive AI-generated explanations powered by Google Gemini.

The assistant is guided by a custom system prompt covering topics such as:

- Election processes
- Voter registration
- Election timelines
- Polling places
- Vote counting
- Candidate nomination
- Electoral systems
- Indian election processes
- ECI
- EVMs
- Model Code of Conduct

The assistant also redirects unrelated questions back toward election topics.

---

### 📅 Interactive Election Timeline

The application presents a 10-step election process:

1. Election Announcement
2. Voter Registration
3. Candidate Nomination
4. Scrutiny of Nominations
5. Withdrawal of Candidature
6. Election Campaign
7. Campaign Silence Period
8. Polling Day
9. Vote Counting
10. Results & Winner

This gives users a visual way to understand the overall election process.

---

### 🧠 Election Knowledge Quiz

Users can test their understanding through an interactive quiz.

The quiz includes questions covering concepts such as:

- EVM
- Election Commission of India
- Voting age
- Model Code of Conduct
- Campaign silence period
- NOTA

The application tracks the user's score and provides a final result.

---

## ✨ Key Features

- 🤖 AI-powered election assistant
- 🧠 Google Gemini 2.5 Flash integration
- 💬 Conversational chat interface
- 🎯 Election-focused AI system prompt
- 🇮🇳 English/Hindi interface support
- 📅 Interactive election timeline
- 🧠 Election knowledge quiz
- 📊 Quiz scoring system
- 📋 Copy AI responses
- 🗑️ Clear conversation
- 🌙 Dark/light mode
- ⚡ Typing/loading animation
- 💡 Quick-question suggestions
- 📱 Responsive user interface

---

## 🛠️ Tech Stack

### Frontend

- React
- Vite
- JavaScript
- CSS3

### AI

- Google Gemini API
- Gemini 2.5 Flash
- Prompt-based AI interaction

### Development

- npm
- ESLint
- Git
- GitHub

---

## 🧠 AI Architecture

The application follows a simple conversational AI architecture:

```text
User
  │
  ▼
React Chat Interface
  │
  ▼
User Question
  │
  ▼
Election System Prompt
  │
  ▼
Google Gemini 2.5 Flash
  │
  ▼
AI Response
  │
  ▼
React Chat Interface
