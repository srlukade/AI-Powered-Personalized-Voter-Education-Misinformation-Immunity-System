# VoteWise AI – Smart Voter Education Assistant

## 🔹 Chosen Vertical
Election Process Education

## 🔹 Problem
Voters lack personalized guidance and are vulnerable to misinformation.

## 🔹 Solution
An AI-powered assistant that:
- Assesses knowledge
- Detects fake news
- Provides personalized education

## 🔹 Features
- **AI chatbot (Gemini)**: Ask any election-related questions and get real-time answers.
- **Awareness quiz**: Take a 5-question quiz to test your voting knowledge.
- **Fake news detection**: Paste claims or news snippets to check for authenticity, bias, and get a confidence score.
- **Personalized learning**: Based on your quiz score, the system provides curated content (Beginner, Intermediate, or Advanced) to help you learn more effectively.

## 🔹 Tech Stack
- **Frontend**: HTML, CSS (Glassmorphism), Vanilla JS
- **Backend**: Node.js, Express
- **AI Integration**: Google Gemini API (@google/genai)
- **Database/Hosting**: Firebase

## 🔹 How It Works
1. **User takes quiz**: The user answers a short quiz on the "Knowledge Quiz" tab.
2. **System calculates score**: The frontend evaluates the answers and calculates a percentage score.
3. **AI recommends content**: Based on the score (<50 Beginner, 50-80 Intermediate, >80 Advanced), the app provides specific topics to study.
4. **User interacts with chatbot**: The user can switch to the "AI Chatbot" tab to ask further questions. The bot is aware of their knowledge level (context is passed in the prompt).
5. **Misinformation Scanner**: Users can analyze any claim to verify its truthfulness.

## 🔹 Assumptions
- User has internet access.
- AI responses are advisory, not authoritative. Always verify critical election information with official election commission websites.

## 🔹 Running Locally
1. Clone the repository.
2. Run `npm install` to install backend dependencies.
3. Create a `.env` file in the root directory and add `GEMINI_API_KEY=your_api_key_here`.
4. Run `npm start` and visit `http://localhost:3000`.
