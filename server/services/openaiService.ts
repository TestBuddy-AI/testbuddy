import { ChatCompletionRequestMessageRoleEnum, CreateChatCompletionResponse } from "openai";
import { openAI } from "../config/openai";
import { ITestFunction } from "../db/models/dbModels";
import { ICodeLanguage } from "../types";

export const unitTestsPrompt = async (
  codeMessage: string,
  codeLanguage: ICodeLanguage
): Promise<CreateChatCompletionResponse> => {
  const response = await openAI.createChatCompletion({
    model: "gpt-3.5-turbo-16k",
    messages: [
      {
        role: "system",
        content: `As a unit test generator for ${codeLanguage}, your task is to create unit test code for the provided function(s). Follow these guidelines: 1. Your output should be in plain text without any explanations or natural language. 2. Mandatory: Do not duplicate or modify the original function or class in your output. 3. Generate unit tests to cover key use cases, including typical scenarios, edge cases, and potential error states. Do not aim for exhaustiveness by testing every possible input, but rather focus on meaningful scenarios. 4. Include a comment before each it() block, specifying the specific use case it addresses. 5. Unit tests must be generated using Jest. 6. Mandatory: Use it() blocks instead of test(). 7. Mandatory: Do not include any import function in the generated code. Assume that necessary libraries (e.g., lodash for JavaScript) are already imported. 8. Helper functions can be created if needed to simulate specific conditions or inputs for tests. 9. The generated unit tests should be complete and directly executable. Do not include any placeholder or template code (e.g., yourFunction(test...)). Every piece of code should be functional without the need for user modification.`
      },
      {
        role: "user",
        content: codeMessage
      }
    ],
    temperature: 0.3,
    max_tokens: 2560,
    top_p: 1,
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
};

export async function generateFunctionUnitTests(
  fn: ITestFunction,
  lang: ICodeLanguage
) {
  const { choices } = await unitTestsPrompt(fn.code, lang);

  return choices[0].message?.content;
}

export async function regenerateUnitTestsPrompt(
  originalCode: string,
  unitTests: string,
  codeLanguage: ICodeLanguage
): Promise<CreateChatCompletionResponse> {
  const response = await openAI.createChatCompletion({
    model: "gpt-3.5-turbo-16k",
    messages: [
      {
        role: "system",
        content: `As a unit test generator for ${codeLanguage}, your task is to create unit test code for the provided function(s). Follow these guidelines: 1. Your output should be in plain text without any explanations or natural language. 2. Mandatory: Do not duplicate or modify the original function or class in your output. 3. Generate unit tests to cover key use cases, including typical scenarios, edge cases, and potential error states. Do not aim for exhaustiveness by testing every possible input, but rather focus on meaningful scenarios. 4. Include a comment before each it() block, specifying the specific use case it addresses. 5. Unit tests must be generated using Jest. 6. Mandatory: Use it() blocks instead of test(). 7. Mandatory: Do not include any import function in the generated code. Assume that necessary libraries (e.g., lodash for JavaScript) are already imported. 8. Helper functions can be created if needed to simulate specific conditions or inputs for tests. 9. The generated unit tests should be complete and directly executable. Do not include any placeholder or template code (e.g., yourFunction(test...)). Every piece of code should be functional without the need for user modification.`
      },
      {
        role: "user",
        content: originalCode
      },
      {
        role: "assistant",
        content: unitTests
      },
      {
        role: "user",
        content:
          "I wasn't fully satisfied with the previous unit tests. Can you generate a new set of unit tests using a different approach for the same code?"
      }
    ],
    temperature: 0.6,
    max_tokens: 2560,
    top_p: 1,
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

export async function regenerateSingleUnitTest(
  originalCode: string,
  unitTests: string,
  codeLanguage: ICodeLanguage,
  unitTestToChange: string
): Promise<CreateChatCompletionResponse> {
  const response = await openAI.createChatCompletion({
    model: "gpt-3.5-turbo-16k",
    messages: [
      {
        role: "system",
        content: `You created the following tests ${unitTests} for the user based on ${originalCode}. The user wants to perform a change.`
      },
      {
        role: "user",
        content: `Regenerate the code for the following string code block ${unitTestToChange} by using a different approach. The rest of the tests should remain the same. Integrate the changes with the original string.`
      }
    ],
    temperature: 1,
    max_tokens: 2560,
    top_p: 1,
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

export async function regenerateSingleFunctionUnitTest(
  testFunction: ITestFunction,
  codeLanguage: ICodeLanguage,
  testToChange: string
) {
  const { choices } = await regenerateSingleUnitTest(
    testFunction.code,
    testFunction.unitTests || "",
    codeLanguage,
    testToChange
  );

  console.log(`⚡️Given the test to change ${testToChange} ChatGPT returns`);
  console.log("❤️", testToChange);
  console.log(choices[0].message?.content);
  return choices[0].message?.content;
}

export async function regenerateFunctionUnitTests(
  testFunction: ITestFunction,
  codeLanguage: ICodeLanguage
) {
  const { choices } = await regenerateUnitTestsPrompt(
    testFunction.code,
    testFunction.unitTests || "",
    codeLanguage
  );

  return choices[0].message?.content;
}

export async function modifyUnitTestsPrompt(
  codeLanguage: ICodeLanguage,
  unitTestGenerated: ITestFunction,
  userInput: string
): Promise<CreateChatCompletionResponse> {
  const response = await openAI.createChatCompletion({
    model: "gpt-3.5-turbo-16k",
    messages: [
      {
        role: "system",
        content: `As a unit test generator for ${codeLanguage}, your task is to create unit test code for the provided function(s). Follow these guidelines: 1. Your output should be in plain text without any explanations or natural language. 2. Mandatory: Do not duplicate or modify the original function or class in your output. 3. Generate unit tests to cover key use cases, including typical scenarios, edge cases, and potential error states. Do not aim for exhaustiveness by testing every possible input, but rather focus on meaningful scenarios. 4. Include a comment before each it() block, specifying the specific use case it addresses. 5. Unit tests must be generated using Jest. 6. Mandatory: Use it() blocks instead of test(). 7. Mandatory: Do not include any import function in the generated code. Assume that necessary libraries (e.g., lodash for JavaScript) are already imported. 8. Helper functions can be created if needed to simulate specific conditions or inputs for tests. 9. The generated unit tests should be complete and directly executable. Do not include any placeholder or template code (e.g., yourFunction(test...)). Every piece of code should be functional without the need for user modification.`
      },
      {
        role: "user",
        content: unitTestGenerated.code
      },
      {
        role: "assistant",
        content: unitTestGenerated.unitTests
      },
      {
        role: "user",
        content: `I wasn't fully satisfied with the previous unit tests. The reason for that is: ${userInput}. Can you generate a new set of unit tests folloing the instructions taking into account the reason I provided you and using a different approach for the same code?`
      }
    ],
    temperature: 0.3,
    max_tokens: 2560,
    top_p: 1,
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

export async function modifyFunctionUnitTests(
  codeLanguage: ICodeLanguage,
  unitTestGenerated: ITestFunction,
  userInput: string
) {
  const { choices } = await modifyUnitTestsPrompt(
    codeLanguage,
    unitTestGenerated,
    userInput
  );

  return choices[0].message?.content;
}

interface IConversationMessage {
  role: ChatCompletionRequestMessageRoleEnum;
  content: string | undefined;
}

export async function feedbackUnitTestsPrompt(
  codeLanguage: ICodeLanguage,
  unitTestFunctions: ITestFunction[],
  error: string
): Promise<CreateChatCompletionResponse> {
  const initial = {
    role: ChatCompletionRequestMessageRoleEnum.System,
    content: `Your role is a debugging assistant for ${codeLanguage}. You will help the user to find possible bugs or problems inside the a function that will be passed to you. Also, some unit tests were ran in that code in order to identify possible problems beyond code syntax. So as the debugging assitant that you are, this will be the algorithm you will follow: 1. User passes you the functions until he types "endFunctions". 2. User passes you unit tests until he types "endUnitTests". 3. User passes you the error message he is receiving. 4. You find what the problem is and you tell the user.`
  };

  const functions = unitTestFunctions.map((func) => ({
    role: ChatCompletionRequestMessageRoleEnum.User,
    content: func.code
  }));

  const tests = unitTestFunctions.map((func) => ({
    role: ChatCompletionRequestMessageRoleEnum.User,
    content: func.unitTests
  }));

  const midMessage = {
    role: ChatCompletionRequestMessageRoleEnum.User,
    content: "endFunctions"
  };

  const endMessage = {
    role: ChatCompletionRequestMessageRoleEnum.User,
    content: "endUnitTests"
  };

  const errorMessage = {
    role: ChatCompletionRequestMessageRoleEnum.User,
    content: error
  };

  const conversation: IConversationMessage[] = [
    initial,
    ...functions,
    midMessage,
    ...tests,
    endMessage,
    errorMessage
  ];

  const response = await openAI.createChatCompletion({
    model: "gpt-3.5-turbo-16k",
    messages: conversation,
    temperature: 0.3,
    max_tokens: 2560,
    top_p: 1,
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

export async function feedbackFunctionUnitTests(
  codeLanguage: ICodeLanguage,
  unitTestFunctions: ITestFunction[],
  error: string
) {
  const { choices } = await feedbackUnitTestsPrompt(
    codeLanguage,
    unitTestFunctions,
    error
  );

  return choices[0].message?.content;
}
