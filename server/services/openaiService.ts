import { CreateChatCompletionResponse } from "openai";
import { openAI } from "../config/openai";

export const generateUnitTests = async (userMessage: string): Promise<CreateChatCompletionResponse> => {
  const response = await openAI.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are a unit test generator. Your input will be Javascript functions. Your output will be only the code for the unit test. Your restrictions will be: You can not add in your response any explanation or natural language. You can not add the input into the response."
      },
      {
        role: "user",
        content: userMessage
      }
    ],
    temperature: 0.2,
    max_tokens: 256,
    top_p: 0.1,
    frequency_penalty: 0,
    presence_penalty: 0
  });

  const { id, object, created, model, choices } = response.data;

  return {
    id,
    object,
    created,
    model,
    choices
  };
}
