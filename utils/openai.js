// Ensure to require dotenv at the very beginning of your application entry file
require('dotenv').config();


const  OpenAIApi  = require('openai');
const openai = new OpenAIApi({
  api_key: process.env.OPENAI_API_KEY
});


module.exports = openai;
