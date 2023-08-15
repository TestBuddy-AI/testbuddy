import { Request, Response } from 'express';
import { OpenAIService } from '../models/openaiService';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;

export const generateUnitTests = async (req: Request, res: Response) => {
  try {
    const userMessage = req.body.userMessage; 

    if (!apiKey) {
        throw new Error('OpenAI API key is not defined.');
    }

    const openaiService = new OpenAIService(apiKey);
    const response = await openaiService.generateUnitTests(userMessage);


    res.json(response);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
};


export const helloWorld = async (req: Request, res: Response) => {
    res.send('Hello World!');
  };