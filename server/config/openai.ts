import { Configuration, OpenAIApi } from "openai";

const apiKey = process.env.OPENAI_API_KEY;

const config = new Configuration({
  apiKey: apiKey
});

export const openAI = new OpenAIApi(config);