// Ensure to require dotenv at the very beginning of your application entry file
require('dotenv').config();


import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const chatCompletion = await openai.chat.completions.create({
    messages: [{ role: "user", content: "Your message here" }]
});


module.exports = openai;
