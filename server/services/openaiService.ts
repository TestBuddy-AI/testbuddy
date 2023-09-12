import {
  ChatCompletionRequestMessageRoleEnum,
  CreateChatCompletionResponse,
} from "openai";
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
        content: `As a unit test generator for ${codeLanguage}, your task is to create unit test code for the provided function(s). Follow these guidelines: 1. Your output should be in plain text without any explanations or natural language. 2. Mandatory: Do not duplicate or modify the original function or class in your output. 3. Generate unit tests to cover key use cases, including typical scenarios, edge cases, and potential error states. Do not aim for exhaustiveness by testing every possible input, but rather focus on meaningful scenarios. 4. Include a comment before each it() block, specifying the specific use case it addresses. 5. Unit tests must be generated using Jest. 6. Mandatory: Use it() blocks instead of test(). 7. Mandatory: Do not include any import function in the generated code. Assume that necessary libraries (e.g., lodash for JavaScript) are already imported. 8. Helper functions can be created if needed to simulate specific conditions or inputs for tests. 9. The generated unit tests should be complete and directly executable. Do not include any placeholder or template code (e.g., yourFunction(test...)). Every piece of code should be functional without the need for user modification.`,
      },
      {
        role: "user",
        content: codeMessage,
      },
    ],
    temperature: 0.3,
    max_tokens: 2560,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  const { id, object, created, model, choices } = response.data;

  return {
    id,
    object,
    created,
    model,
    choices,
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
        content: `As a unit test generator for ${codeLanguage}, your task is to create unit test code for the provided function(s). Follow these guidelines: 1. Your output should be in plain text without any explanations or natural language. 2. Mandatory: Do not duplicate or modify the original function or class in your output. 3. Generate unit tests to cover key use cases, including typical scenarios, edge cases, and potential error states. Do not aim for exhaustiveness by testing every possible input, but rather focus on meaningful scenarios. 4. Include a comment before each it() block, specifying the specific use case it addresses. 5. Unit tests must be generated using Jest. 6. Mandatory: Use it() blocks instead of test(). 7. Mandatory: Do not include any import function in the generated code. Assume that necessary libraries (e.g., lodash for JavaScript) are already imported. 8. Helper functions can be created if needed to simulate specific conditions or inputs for tests. 9. The generated unit tests should be complete and directly executable. Do not include any placeholder or template code (e.g., yourFunction(test...)). Every piece of code should be functional without the need for user modification.`,
      },
      {
        role: "user",
        content: originalCode,
      },
      {
        role: "assistant",
        content: unitTests,
      },
      {
        role: "user",
        content:
          "I wasn't fully satisfied with the previous unit tests. Can you generate a new set of unit tests using a different approach for the same code?",
      },
    ],
    temperature: 0.6,
    max_tokens: 2560,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  const { id, object, created, model, choices } = response.data;

  return {
    id,
    object,
    created,
    model,
    choices,
  };
}

export async function regenerateSingleUnitTest(
  originalCode: string,
  unitTests: string,
  unitTestToChange: string
): Promise<CreateChatCompletionResponse> {
  const response = await openAI.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "Your function is to identify and remove a block of it() code and then replace it for another it() test that is neither is the one you removed and is not contained in the set of unit tests. This will be your algorithm: 1. Input: <unitTests> String with set of unit tests. <testToChange>: A string with the description of the test to replace from <UnitTests> with a new generated one. <function> which the unit tests where generated for. 2. You remove the corresponding <testToChange> from <UnitTests>, generate an unique new unit tests(it was not the one you removed and is not contained in the set of unit tests) and then you add it to the set of unit tests. 3. Output: The resulting code with the new unit tests replacing the requested one. CONSTRAINTS: 1. Your code should be exactly executable code but without the removed test. 2. DO NOT include any natural language or explanation. 3. The code must be ready to be executed from an endpoint. 4. The replacing test can't be any similar to the replaced one.",
      },
      {
        role: "user",
        content: "Starting replacing process.",
      },
      {
        role: "assistant",
        content: "Input: unitTests",
      },
      {
        role: "user",
        content:
          "// Test case for typical scenario\nit('should return the sum of two numbers', () => {\n  expect(sum(2, 3)).toBe(5);\n});\n\n// Test case for negative numbers\nit('should return the sum of two negative numbers', () => {\n  expect(sum(-2, -3)).toBe(-5);\n});\n\n// Test case for zero\nit('should return the sum of zero and a number', () => {\n  expect(sum(0, 5)).toBe(5);\n});\n\n// Test case for decimal numbers\nit('should return the sum of two decimal numbers', () => {\n  expect(sum(1.5, 2.5)).toBe(4);\n});\n\n// Test case for large numbers\nit('should return the sum of two large numbers', () => {\n  expect(sum(1000000000, 2000000000)).toBe(3000000000);\n});",
      },
      {
        role: "assistant",
        content: "Input: testToChange",
      },
      {
        role: "user",
        content: "should return the sum of two numbers",
      },
      {
        role: "assistant",
        content: "Input: function",
      },
      {
        role: "user",
        content: "function sum(a, b) { return a + b; }",
      },
      {
        role: "assistant",
        content:
          "// Test case for negative numbers\nit('should return the sum of two negative numbers', () => {\n  expect(sum(-2, -3)).toBe(-5);\n});\n\n// Test case for zero\nit('should return the sum of zero and a number', () => {\n  expect(sum(0, 5)).toBe(5);\n});\n\n// Test case for decimal numbers\nit('should return the sum of two decimal numbers', () => {\n  expect(sum(1.5, 2.5)).toBe(4);\n});\n\n// Test case for large numbers\nit('should return the sum of two large numbers', () => {\n  expect(sum(1000000000, 2000000000)).toBe(3000000000);\n});\n\n// Test case for typical scenario\nit('should return the sum of two numbers', () => {\n  expect(sum(8, 10)).toBe(18);\n});",
      },
      {
        role: "user",
        content: "Starting replacing process.",
      },
      {
        role: "assistant",
        content: "Input: unitTests",
      },
      {
        role: "user",
        content:
          "// Test case for typical scenario\nit('should calculate mileage for given distance and fuel', () => {\n  const mileage = calculateMileage(100, 5);\n  expect(mileage).toBe(20);\n});\n\n// Test case for zero distance\nit('should return 0 mileage for 0 distance traveled', () => {\n  const mileage = calculateMileage(0, 5);\n  expect(mileage).toBe(0);\n});\n\n// Test case for decimal values\nit('should handle decimal values correctly', () => {\n  const mileage = calculateMileage(150.5, 7.5);\n  expect(mileage).toBeCloseTo(20.0667, 4); // 4 decimal places\n});\n\n// Test case for negative fuel (which shouldn't be allowed)\nit('should throw an error for negative fuel values', () => {\n  expect(() => {\n    calculateMileage(100, -5);\n  }).toThrow(\"Fuel consumed must be greater than 0\");\n});\n\n// Test case for zero fuel (which shouldn't be allowed)\nit('should throw an error for zero fuel', () => {\n  expect(() => {\n    calculateMileage(100, 0);\n  }).toThrow(\"Fuel consumed must be greater than 0\");\n});",
      },
      {
        role: "assistant",
        content: "Input: testToChange",
      },
      {
        role: "user",
        content: "should throw an error for negative fuel values",
      },
      {
        role: "assistant",
        content: "Input: function",
      },
      {
        role: "user",
        content:
          'function calculateMileage(distance, fuel) {\n  if (fuel <= 0) {\n    throw new Error("Fuel consumed must be greater than 0");\n  }\n  return distance / fuel;\n}',
      },
      {
        role: "assistant",
        content:
          "// Test case for typical scenario\nit('should calculate mileage for given distance and fuel', () => {\n  const mileage = calculateMileage(100, 5);\n  expect(mileage).toBe(20);\n});\n\n// Test case for zero distance\nit('should return 0 mileage for 0 distance traveled', () => {\n  const mileage = calculateMileage(0, 5);\n  expect(mileage).toBe(0);\n});\n\n// Test case for decimal values\nit('should handle decimal values correctly', () => {\n  const mileage = calculateMileage(150.5, 7.5);\n  expect(mileage).toBeCloseTo(20.0667, 4); // 4 decimal places\n});\n\n// Test case for zero fuel (which shouldn't be allowed)\nit('should throw an error for zero fuel', () => {\n  expect(() => {\n    calculateMileage(100, 0);\n  }).toThrow(\"Fuel consumed must be greater than 0\");\n});\n\n// Test case for negative distance (which shouldn't be allowed)\nit('should throw an error for negative distance values', () => {\n  expect(() => {\n    calculateMileage(-100, 5);\n  }).toThrow(\"Distance traveled must be non-negative\");\n});",
      },
      {
        role: "user",
        content: "Starting replacing process.",
      },
      {
        role: "assistant",
        content: "Input: unitTests",
      },
      {
        role: "user",
        content:
          "// Test case for typical scenario\nit('should return the sum of two numbers', () => {\n  expect(sum(2, 3)).toBe(5);\n});\n\n// Test case for negative numbers\nit('should return the sum of two negative numbers', () => {\n  expect(sum(-2, -3)).toBe(-5);\n});\n\n// Test case for zero\nit('should return the sum of zero and a number', () => {\n  expect(sum(0, 5)).toBe(5);\n});\n\n// Test case for decimal numbers\nit('should return the sum of two decimal numbers', () => {\n  expect(sum(1.5, 2.5)).toBe(4);\n});\n\n// Test case for large numbers\nit('should return the sum of two large numbers', () => {\n  expect(sum(1000000000, 2000000000)).toBe(3000000000);\n});",
      },
      {
        role: "assistant",
        content: "Input: testToChange",
      },
      {
        role: "user",
        content: "should return the sum of two decimal numbers",
      },
      {
        role: "assistant",
        content: "Input: function",
      },
      {
        role: "user",
        content: "function sum(a, b) { return a + b; } ",
      },
      {
        role: "assistant",
        content:
          "// Test case for negative numbers\nit('should return the sum of two negative numbers', () => {\n  expect(sum(-2, -3)).toBe(-5);\n});\n\n// Test case for zero\nit('should return the sum of zero and a number', () => {\n  expect(sum(0, 5)).toBe(5);\n});\n\n// Test case for large numbers\nit('should return the sum of two large numbers', () => {\n  expect(sum(1000000000, 2000000000)).toBe(3000000000);\n});\n\n// Test case for typical scenario\nit('should return the sum of two numbers', () => {\n  expect(sum(2, 7)).toBe(9);\n});",
      },
      {
        role: "user",
        content: "Start replacing process.",
      },
      {
        role: "assistant",
        content: "Input: unitTests",
      },
      {
        role: "user",
        content: `${unitTests}`,
      },
      {
        role: "assistant",
        content: "Input: testToChange",
      },
      {
        role: "user",
        content: `${unitTestToChange}`,
      },
      {
        role: "assistant",
        content: "Input: function",
      },
      {
        role: "user",
        content: `${originalCode}`,
      },
    ],
    temperature: 1.2,
    max_tokens: 1500,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  const { id, object, created, model, choices } = response.data;

  return {
    id,
    object,
    created,
    model,
    choices,
  };
}

export async function regenerateSingleFunctionUnitTest(
  testFunction: ITestFunction,
  testToChange: string
) {
  const { choices } = await regenerateSingleUnitTest(
    testFunction.code,
    testFunction.unitTests || "",
    testToChange
  );

  console.log(`⚡️Given the test to change ${testToChange} ChatGPT returns`);
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
  originalCode: string,
  unitTests: string,
  userInput: string
): Promise<CreateChatCompletionResponse> {
  const response = await openAI.createChatCompletion({
    model: "gpt-3.5-turbo-16k",
    messages: [
      {
        role: "system",
        content: `As a unit test generator for ${codeLanguage}, your task is to create unit test code for the provided function(s). Follow these guidelines: 1. Your output should be in plain text without any explanations or natural language. 2. Mandatory: Do not duplicate or modify the original function or class in your output. 3. Generate unit tests to cover key use cases, including typical scenarios, edge cases, and potential error states. Do not aim for exhaustiveness by testing every possible input, but rather focus on meaningful scenarios. 4. Include a comment before each it() block, specifying the specific use case it addresses. 5. Unit tests must be generated using Jest. 6. Mandatory: Use it() blocks instead of test(). 7. Mandatory: Do not include any import function in the generated code. Assume that necessary libraries (e.g., lodash for JavaScript) are already imported. 8. Helper functions can be created if needed to simulate specific conditions or inputs for tests. 9. The generated unit tests should be complete and directly executable. Do not include any placeholder or template code (e.g., yourFunction(test...)). Every piece of code should be functional without the need for user modification.`,
      },
      {
        role: "user",
        content: originalCode,
      },
      {
        role: "assistant",
        content: unitTests,
      },
      {
        role: "user",
        content: `I wasn't fully satisfied with the previous unit tests. The reason for that is: ${userInput}. Can you generate a new set of unit tests folloing the instructions taking into account the reason I provided you and using a different approach for the same code?`,
      },
    ],
    temperature: 0.3,
    max_tokens: 2560,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  const { id, object, created, model, choices } = response.data;

  return {
    id,
    object,
    created,
    model,
    choices,
  };
}

export async function modifyFunctionUnitTests(
  unitTestGenerated: ITestFunction,
  codeLanguage: ICodeLanguage,
  userInput: string
) {
  const { choices } = await modifyUnitTestsPrompt(
    codeLanguage,
    unitTestGenerated.code,
    unitTestGenerated.unitTests || "",
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
    content: `Your role is a debugging assistant for ${codeLanguage}. You will help the user to find possible bugs or problems inside the a function that will be passed to you. Also, some unit tests were ran in that code in order to identify possible problems beyond code syntax. So as the debugging assitant that you are, this will be the algorithm you will follow: 1. User passes you the functions until he types "endFunctions". 2. User passes you unit tests until he types "endUnitTests". 3. User passes you the error message he is receiving. 4. You find what the problem is and you tell the user.`,
  };

  const functions = unitTestFunctions.map((func) => ({
    role: ChatCompletionRequestMessageRoleEnum.User,
    content: func.code,
  }));

  const tests = unitTestFunctions.map((func) => ({
    role: ChatCompletionRequestMessageRoleEnum.User,
    content: func.unitTests,
  }));

  const midMessage = {
    role: ChatCompletionRequestMessageRoleEnum.User,
    content: "endFunctions",
  };

  const endMessage = {
    role: ChatCompletionRequestMessageRoleEnum.User,
    content: "endUnitTests",
  };

  const errorMessage = {
    role: ChatCompletionRequestMessageRoleEnum.User,
    content: error,
  };

  const conversation: IConversationMessage[] = [
    initial,
    ...functions,
    midMessage,
    ...tests,
    endMessage,
    errorMessage,
  ];

  const response = await openAI.createChatCompletion({
    model: "gpt-3.5-turbo-16k",
    messages: conversation,
    temperature: 0.3,
    max_tokens: 2560,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  const { id, object, created, model, choices } = response.data;

  return {
    id,
    object,
    created,
    model,
    choices,
  };
}

export async function feedbackFunctionUnitTests(
  unitTestFunctions: ITestFunction[],
  codeLanguage: ICodeLanguage,
  error: string
) {
  const { choices } = await feedbackUnitTestsPrompt(
    codeLanguage,
    unitTestFunctions,
    error
  );

  return choices[0].message?.content;
}

export async function modifySingleFunctionUnitTest(
  testFunction: ITestFunction,
  testToChange: string,
  userInput: string
) {
  const { choices } = await modifySingleUnitTest(
    testFunction.code,
    testFunction.unitTests || "",
    testToChange,
    userInput
  );

  console.log(`⚡️Given the test to change ${testToChange} with the input ${userInput} ChatGPT returns`);
  console.log(choices[0].message?.content);
  return choices[0].message?.content;
}

export async function modifySingleUnitTest(
  originalCode: string,
  unitTests: string,
  unitTestToChange: string,
  userInput: string
): Promise<CreateChatCompletionResponse> {
  // TODO: mi amor usa el input para modificar el method plis
  console.log(userInput); // Quitarlo
  const response = await openAI.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "Your function is to identify and remove a block of it() code and then replace it for another it() test that is neither is the one you removed and is not contained in the set of unit tests. This will be your algorithm: 1. Input: <unitTests> String with set of unit tests. <testToChange>: A string with the description of the test to replace from <UnitTests> with a new generated one. <function> which the unit tests where generated for. 2. You remove the corresponding <testToChange> from <UnitTests>, generate an unique new unit tests(it was not the one you removed and is not contained in the set of unit tests) and then you add it to the set of unit tests. 3. Output: The resulting code with the new unit tests replacing the requested one. CONSTRAINTS: 1. Your code should be exactly executable code but without the removed test. 2. DO NOT include any natural language or explanation. 3. The code must be ready to be executed from an endpoint. 4. The replacing test can't be any similar to the replaced one.",
      },
      {
        role: "user",
        content: "Starting replacing process.",
      },
      {
        role: "assistant",
        content: "Input: unitTests",
      },
      {
        role: "user",
        content:
          "// Test case for typical scenario\nit('should return the sum of two numbers', () => {\n  expect(sum(2, 3)).toBe(5);\n});\n\n// Test case for negative numbers\nit('should return the sum of two negative numbers', () => {\n  expect(sum(-2, -3)).toBe(-5);\n});\n\n// Test case for zero\nit('should return the sum of zero and a number', () => {\n  expect(sum(0, 5)).toBe(5);\n});\n\n// Test case for decimal numbers\nit('should return the sum of two decimal numbers', () => {\n  expect(sum(1.5, 2.5)).toBe(4);\n});\n\n// Test case for large numbers\nit('should return the sum of two large numbers', () => {\n  expect(sum(1000000000, 2000000000)).toBe(3000000000);\n});",
      },
      {
        role: "assistant",
        content: "Input: testToChange",
      },
      {
        role: "user",
        content: "should return the sum of two numbers",
      },
      {
        role: "assistant",
        content: "Input: function",
      },
      {
        role: "user",
        content: "function sum(a, b) { return a + b; }",
      },
      {
        role: "assistant",
        content:
          "// Test case for negative numbers\nit('should return the sum of two negative numbers', () => {\n  expect(sum(-2, -3)).toBe(-5);\n});\n\n// Test case for zero\nit('should return the sum of zero and a number', () => {\n  expect(sum(0, 5)).toBe(5);\n});\n\n// Test case for decimal numbers\nit('should return the sum of two decimal numbers', () => {\n  expect(sum(1.5, 2.5)).toBe(4);\n});\n\n// Test case for large numbers\nit('should return the sum of two large numbers', () => {\n  expect(sum(1000000000, 2000000000)).toBe(3000000000);\n});\n\n// Test case for typical scenario\nit('should return the sum of two numbers', () => {\n  expect(sum(8, 10)).toBe(18);\n});",
      },
      {
        role: "user",
        content: "Starting replacing process.",
      },
      {
        role: "assistant",
        content: "Input: unitTests",
      },
      {
        role: "user",
        content:
          "// Test case for typical scenario\nit('should calculate mileage for given distance and fuel', () => {\n  const mileage = calculateMileage(100, 5);\n  expect(mileage).toBe(20);\n});\n\n// Test case for zero distance\nit('should return 0 mileage for 0 distance traveled', () => {\n  const mileage = calculateMileage(0, 5);\n  expect(mileage).toBe(0);\n});\n\n// Test case for decimal values\nit('should handle decimal values correctly', () => {\n  const mileage = calculateMileage(150.5, 7.5);\n  expect(mileage).toBeCloseTo(20.0667, 4); // 4 decimal places\n});\n\n// Test case for negative fuel (which shouldn't be allowed)\nit('should throw an error for negative fuel values', () => {\n  expect(() => {\n    calculateMileage(100, -5);\n  }).toThrow(\"Fuel consumed must be greater than 0\");\n});\n\n// Test case for zero fuel (which shouldn't be allowed)\nit('should throw an error for zero fuel', () => {\n  expect(() => {\n    calculateMileage(100, 0);\n  }).toThrow(\"Fuel consumed must be greater than 0\");\n});",
      },
      {
        role: "assistant",
        content: "Input: testToChange",
      },
      {
        role: "user",
        content: "should throw an error for negative fuel values",
      },
      {
        role: "assistant",
        content: "Input: function",
      },
      {
        role: "user",
        content:
          'function calculateMileage(distance, fuel) {\n  if (fuel <= 0) {\n    throw new Error("Fuel consumed must be greater than 0");\n  }\n  return distance / fuel;\n}',
      },
      {
        role: "assistant",
        content:
          "// Test case for typical scenario\nit('should calculate mileage for given distance and fuel', () => {\n  const mileage = calculateMileage(100, 5);\n  expect(mileage).toBe(20);\n});\n\n// Test case for zero distance\nit('should return 0 mileage for 0 distance traveled', () => {\n  const mileage = calculateMileage(0, 5);\n  expect(mileage).toBe(0);\n});\n\n// Test case for decimal values\nit('should handle decimal values correctly', () => {\n  const mileage = calculateMileage(150.5, 7.5);\n  expect(mileage).toBeCloseTo(20.0667, 4); // 4 decimal places\n});\n\n// Test case for zero fuel (which shouldn't be allowed)\nit('should throw an error for zero fuel', () => {\n  expect(() => {\n    calculateMileage(100, 0);\n  }).toThrow(\"Fuel consumed must be greater than 0\");\n});\n\n// Test case for negative distance (which shouldn't be allowed)\nit('should throw an error for negative distance values', () => {\n  expect(() => {\n    calculateMileage(-100, 5);\n  }).toThrow(\"Distance traveled must be non-negative\");\n});",
      },
      {
        role: "user",
        content: "Starting replacing process.",
      },
      {
        role: "assistant",
        content: "Input: unitTests",
      },
      {
        role: "user",
        content:
          "// Test case for typical scenario\nit('should return the sum of two numbers', () => {\n  expect(sum(2, 3)).toBe(5);\n});\n\n// Test case for negative numbers\nit('should return the sum of two negative numbers', () => {\n  expect(sum(-2, -3)).toBe(-5);\n});\n\n// Test case for zero\nit('should return the sum of zero and a number', () => {\n  expect(sum(0, 5)).toBe(5);\n});\n\n// Test case for decimal numbers\nit('should return the sum of two decimal numbers', () => {\n  expect(sum(1.5, 2.5)).toBe(4);\n});\n\n// Test case for large numbers\nit('should return the sum of two large numbers', () => {\n  expect(sum(1000000000, 2000000000)).toBe(3000000000);\n});",
      },
      {
        role: "assistant",
        content: "Input: testToChange",
      },
      {
        role: "user",
        content: "should return the sum of two decimal numbers",
      },
      {
        role: "assistant",
        content: "Input: function",
      },
      {
        role: "user",
        content: "function sum(a, b) { return a + b; } ",
      },
      {
        role: "assistant",
        content:
          "// Test case for negative numbers\nit('should return the sum of two negative numbers', () => {\n  expect(sum(-2, -3)).toBe(-5);\n});\n\n// Test case for zero\nit('should return the sum of zero and a number', () => {\n  expect(sum(0, 5)).toBe(5);\n});\n\n// Test case for large numbers\nit('should return the sum of two large numbers', () => {\n  expect(sum(1000000000, 2000000000)).toBe(3000000000);\n});\n\n// Test case for typical scenario\nit('should return the sum of two numbers', () => {\n  expect(sum(2, 7)).toBe(9);\n});",
      },
      {
        role: "user",
        content: "Start replacing process.",
      },
      {
        role: "assistant",
        content: "Input: unitTests",
      },
      {
        role: "user",
        content: `${unitTests}`,
      },
      {
        role: "assistant",
        content: "Input: testToChange",
      },
      {
        role: "user",
        content: `${unitTestToChange}`,
      },
      {
        role: "assistant",
        content: "Input: function",
      },
      {
        role: "user",
        content: `${originalCode}`,
      },
    ],
    temperature: 1.2,
    max_tokens: 1500,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  const { id, object, created, model, choices } = response.data;

  return {
    id,
    object,
    created,
    model,
    choices,
  };
}