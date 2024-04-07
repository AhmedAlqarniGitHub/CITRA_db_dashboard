const express = require('express');
const openai = require('../utils/openai.js'); // Path to your OpenAI client module

const app = express();
app.use(express.json());

app.post('/generate-text', async (req, res) => {
  try {
    const prompt = req.body.prompt;
    const response = await openai.createCompletion({
      model: "text-davinci-002", // or another model
      prompt: prompt,
      max_tokens: 150,
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    res.status(500).send('Failed to generate text');
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
