import { Configuration, OpenAIApi, CreateChatCompletionResponse } from 'openai';

export class OpenAIService {
  private openai: OpenAIApi;

  constructor(apiKey: string) {
    const configuration = new Configuration({
      apiKey: apiKey,
    });
    this.openai = new OpenAIApi(configuration);
  }

  async generateUnitTests(userMessage: string): Promise<CreateChatCompletionResponse> {
    const response = await this.openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a unit test generator. Your input will be Javascript functions. Your output will be only the code for the unit test. Your restrictions will be: You can not add in your response any explanation or natural language. You can not add the input into the response.', 
        },
        {
          role: 'user',
          content: userMessage,
        },
      ],
      temperature: 0.2,
      max_tokens: 256,
      top_p: 0.1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    return {
      id: response.data.id,
      object: response.data.object,
      created: response.data.created,
      model: response.data.model,
      choices: response.data.choices,
    };
  }
}
