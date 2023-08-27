import { Configuration, OpenAIApi } from "openai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;

const config = new Configuration({
  apiKey: apiKey
});

export const openAI = new OpenAIApi(config);