import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function callLLM(
  systemPrompt: string,
  userPrompt: string,
  model: string = 'gemini-2.0-flash'
): Promise<string> {
  const genModel = genAI.getGenerativeModel({
    model,
    systemInstruction: systemPrompt,
  });

  const result = await genModel.generateContent(userPrompt);
  const response = result.response;
  const text = response.text();

  if (!text) {
    throw new Error('No text content in Gemini response');
  }

  return text;
}
