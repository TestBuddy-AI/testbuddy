import { CreateChatCompletionResponse } from "openai";
import { openAI } from "../config/openai";
import { ICodeLanguage } from "../types";
import { readJSorTSFile } from "./codeFileService";

export const unitTestsPrompt = async (codeMessage: string, codeLanguage: ICodeLanguage): Promise<CreateChatCompletionResponse> => {
  const response = await openAI.createChatCompletion({
    model: "gpt-3.5-turbo-16k",
    messages: [
      {
        role: "system",
        content: `As a unit test generator for ${codeLanguage}, your task is to create unit test code. Follow these guidelines:\n\n1. Your output should not include any explanations or natural language.\n2. Mandatory: Do not duplicate the original function in your output.\n3. Generate unit tests that cover all possible use cases.\n4. Include a comment for each unit test, specifying the specific use case it addresses. \n5. Generate the output in plain text. \n6. Unit tests must be generated using Jest. \n7. Mandatory: Use it() blocks instead of test().`
      },
      {
        role: "user",
        content: codeMessage
      }
    ],
    temperature: 0.2,
    max_tokens: 2560,
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

export function generateUnitTests() {
  const { functions, lang } = readJSorTSFile();

  if (functions.length === 0) throw new Error("No functions found in file");

  return functions.map(async (fn) => {
    const { choices } = await unitTestsPrompt(fn, lang);
    return choices[0].message?.content;
  });
}
