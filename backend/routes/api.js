const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');

router.post('/chat', async (req, res) => {
  const { message, context } = req.body;
  if (!message) return res.status(400).json({ error: 'Message is required' });
  
  const reply = await aiService.chatWithAssistant(message, context);
  res.json({ reply });
});

router.post('/check-news', async (req, res) => {
  const { claim } = req.body;
  if (!claim) return res.status(400).json({ error: 'Claim is required' });
  
  const result = await aiService.checkMisinformation(claim);
  res.json(result);
});

module.exports = router;
