const express = require('express');
const router = express.Router();

const openai= require('../utils/openai.js'); // Path to your OpenAI client module


router.post('/generate-text', async (req, res) => {
  try {
    const prompt = req.body.prompt;
    const response = await openai.chat.completions.create({
      model: "gpt-4", // or another model
      messages: [{"role": "user", "content": prompt}],

    });
    console.log(response.choices[0].message);
    res.json(response.choices[0].message.content);
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    res.status(500).send('Failed to generate text');
  }
});

module.exports = router;


