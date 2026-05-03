import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyBmF3O_qhWZsFaIDt9Xpqs7Dx-b6bYGUCk",
  authDomain: "vote-wise-ai-f1f5d.firebaseapp.com",
  projectId: "vote-wise-ai-f1f5d",
  storageBucket: "vote-wise-ai-f1f5d.firebasestorage.app",
  messagingSenderId: "716143344321",
  appId: "1:716143344321:web:a6f1eb01ff84ef5b017240"
};

const app = initializeApp(firebaseConfig);
console.log("Firebase initialized");

let questions = [];
let currentScore = 0;
let userKnowledgeLevel = "Beginner";

// DOM Elements
const tabs = document.querySelectorAll('.tab-btn');
const sections = document.querySelectorAll('.content-section');
const quizContainer = document.getElementById('quiz-container');
const submitQuizBtn = document.getElementById('submit-quiz');
const quizResults = document.getElementById('quiz-results');
const scoreDisplay = document.getElementById('score-display');
const personalizedLearning = document.getElementById('personalized-learning');
const retryBtn = document.getElementById('retry-btn');

const chatBox = document.getElementById('chat-box');
const chatInput = document.getElementById('chat-input');
const sendChatBtn = document.getElementById('send-chat');

const newsInput = document.getElementById('news-input');
const scanBtn = document.getElementById('scan-btn');
const scanResults = document.getElementById('scan-results');

// Tab Navigation
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        sections.forEach(s => s.classList.add('hidden'));
        
        tab.classList.add('active');
        document.getElementById(tab.dataset.target).classList.remove('hidden');
    });
});

// Load Quiz
async function loadQuiz() {
    try {
        const response = await fetch('/data/questions.json');
        questions = await response.json();
        renderQuiz();
    } catch (e) {
        console.error("Failed to load questions", e);
    }
}

function renderQuiz() {
    quizContainer.innerHTML = '';
    questions.forEach((q, index) => {
        const qBlock = document.createElement('div');
        qBlock.className = 'question-block';
        
        const questionText = document.createElement('h3');
        questionText.textContent = `${index + 1}. ${q.question}`;
        qBlock.appendChild(questionText);
        
        const optionsDiv = document.createElement('div');
        optionsDiv.className = 'options';
        
        q.options.forEach((opt, i) => {
            const label = document.createElement('label');
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = `question_${index}`;
            radio.value = i;
            
            label.appendChild(radio);
            label.append(` ${opt}`);
            optionsDiv.appendChild(label);
        });
        
        qBlock.appendChild(optionsDiv);
        quizContainer.appendChild(qBlock);
    });
    submitQuizBtn.classList.remove('hidden');
}

submitQuizBtn.addEventListener('click', () => {
    let score = 0;
    let answeredAll = true;
    
    questions.forEach((q, index) => {
        const selected = document.querySelector(`input[name="question_${index}"]:checked`);
        if (!selected) {
            answeredAll = false;
        } else if (parseInt(selected.value) === q.answer) {
            score++;
        }
    });
    
    if (!answeredAll) {
        alert("Please answer all questions before submitting.");
        return;
    }
    
    const percentage = (score / questions.length) * 100;
    currentScore = percentage;
    scoreDisplay.textContent = percentage;
    
    // Logic for personalized learning
    let content = "";
    if (percentage < 50) {
        userKnowledgeLevel = "Beginner";
        content = `<h4>Beginner Content Recommended</h4>
                   <p>It seems you are new to the voting process. Here is some foundational information:</p>
                   <ul>
                    <li><strong>Voter ID is Essential:</strong> Make sure you are registered and have your Voter ID card.</li>
                    <li><strong>Voting Locations:</strong> Find your polling booth in advance.</li>
                    <li><strong>EVMs:</strong> Electronic Voting Machines are simple. You press the button next to your chosen candidate.</li>
                   </ul>`;
    } else if (percentage <= 80) {
        userKnowledgeLevel = "Intermediate";
        content = `<h4>Intermediate Content Recommended</h4>
                   <p>You have a good grasp of the basics! Let's build on that:</p>
                   <ul>
                    <li><strong>Candidate Backgrounds:</strong> Research the candidates' history and promises before voting.</li>
                    <li><strong>NOTA:</strong> Remember that 'None of the Above' is an option if you reject all candidates.</li>
                   </ul>`;
    } else {
        userKnowledgeLevel = "Advanced";
        content = `<h4>Advanced Content Recommended</h4>
                   <p>Excellent awareness! You can help others:</p>
                   <ul>
                    <li><strong>Spotting Fake News:</strong> Help others verify claims before sharing.</li>
                    <li><strong>Election Commission:</strong> Familiarize yourself with the Model Code of Conduct.</li>
                   </ul>`;
    }
    
    personalizedLearning.innerHTML = content;
    quizContainer.classList.add('hidden');
    submitQuizBtn.classList.add('hidden');
    quizResults.classList.remove('hidden');
});

retryBtn.addEventListener('click', () => {
    quizResults.classList.add('hidden');
    quizContainer.classList.remove('hidden');
    renderQuiz();
});

// Chatbot functionality
async function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;
    
    appendMessage(text, 'user-message');
    chatInput.value = '';
    
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text, context: `User is a ${userKnowledgeLevel} in voter knowledge (Score: ${currentScore}%).` })
        });
        const data = await response.json();
        appendMessage(data.reply, 'ai-message');
    } catch (e) {
        appendMessage("Error communicating with AI.", 'ai-message');
    }
}

function appendMessage(text, className) {
    const msg = document.createElement('div');
    msg.className = `message ${className}`;
    msg.textContent = text;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
}

sendChatBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

// Scanner functionality
scanBtn.addEventListener('click', async () => {
    const claim = newsInput.value.trim();
    if (!claim) return;
    
    scanBtn.textContent = 'Analyzing...';
    scanBtn.disabled = true;
    
    try {
        const response = await fetch('/api/check-news', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ claim })
        });
        const data = await response.json();
        
        document.getElementById('res-auth').textContent = data.authenticity;
        document.getElementById('res-bias').textContent = data.bias;
        document.getElementById('res-conf').textContent = data.confidence;
        document.getElementById('res-details').textContent = data.details || "";
        
        scanResults.classList.remove('hidden');
    } catch (e) {
        alert("Failed to analyze claim.");
    } finally {
        scanBtn.textContent = 'Analyze Claim';
        scanBtn.disabled = false;
    }
});

loadQuiz();
