const express = require('express');
const router = express.Router();

const openai= require('../utils/openai.js'); // Path to your OpenAI client module


router.post('/generate-text', async (req, res) => {
  try {
    const prompt = req.body.prompt;
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // or another model
      prompt: prompt,
      max_tokens: 150,
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    res.status(500).send('Failed to generate text');
  }
});

module.exports = router;


