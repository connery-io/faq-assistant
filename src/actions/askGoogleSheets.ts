import { ActionDefinition, ActionContext, OutputObject } from 'connery';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import OpenAI from 'openai';

export type FaqItem = {
  question: string;
  answer: string;
};

const actionDefinition: ActionDefinition = {
  key: 'askGoogleSheets',
  name: 'Ask Google Sheets',
  description:
    'This action enables users to ask questions and receive answers from a knowledge base hosted on Google Sheets.',
  type: 'read',
  inputParameters: [
    {
      key: 'faqListSheetId',
      name: 'FAQ List Sheet ID',
      description: 'ID of the Google Sheet with the list of FAQs.',
      type: 'string',
      validation: {
        required: true,
      },
    },
    {
      key: 'jsonKey',
      name: 'JSON Key',
      description: 'JSON key of the Google Cloud service account with access to the Google Sheets.',
      type: 'string',
      validation: {
        required: true,
      },
    },
    {
      key: 'openAiApiKey',
      name: 'OpenAI API Key',
      description: 'OpenAI API key to access the OpenAI API to generate the answer to the user question.',
      type: 'string',
      validation: {
        required: true,
      },
    },
    {
      key: 'openAiModel',
      name: 'OpenAI Model',
      description: 'OpenAI model to use to generate the answer to the user question.',
      type: 'string',
      validation: {
        required: true,
      },
    },
    {
      key: 'question',
      name: 'Question',
      description: 'The question to ask the FAQ list.',
      type: 'string',
      validation: {
        required: true,
      },
    },
  ],
  operation: {
    handler: handler,
  },
  outputParameters: [
    {
      key: 'textResponse',
      name: 'Text response',
      type: 'string',
      validation: {
        required: true,
      },
    },
  ],
};
export default actionDefinition;

export async function handler({ input }: ActionContext): Promise<OutputObject> {
  const sheet = await authorizeAndGetSheet(input.jsonKey, input.faqListSheetId);

  const rows = await sheet.getRows();

  // Convert the response to a list of FAQs
  const faqList: FaqItem[] = rows.map((row: any) => ({
    question: row.get('Question'),
    answer: row.get('Answer'),
  }));

  // Convert the list of FAQs to a formatted multi-line string
  const formattedFaqList = faqList
    .map((faq: FaqItem, index: number) => `${index + 1}. Question: ${faq.question}\nAnswer: ${faq.answer}`)
    .join('\n\n');

  // Ask OpenAI to generate an answer to the user's question
  const answer = await askOpenAI(input.openAiApiKey, input.openAiModel, formattedFaqList, input.question);

  return { textResponse: answer };
}

async function askOpenAI(
  openaiApiKey: string,
  openaiModel: string,
  content: string,
  question: string,
): Promise<string> {
  // Initialize OpenAI with the provided API key
  const openai = new OpenAI({ apiKey: openaiApiKey });

  // Create the system message with instructions for the model
  const systemMessage = `You are an FAQ expert. 
    When asked a question or given a request related to a specific topic, you provide an accurate and concise answer based strictly on the content provided. 
    You respond in the same language as the user’s input and adjust your answer to fit the context of the request, whether it’s a direct question or an indirect inquiry.
    You never guess or paraphrase — only answer if the explicit content for that request is available. 
    If there are any disclaimers or indications in the content that it should not be shared with clients or is a work in progress, include that information only if it is explicitly mentioned.
    
    If you are not confident that the content fully addresses the request, respond with: 
    'I don’t have enough information to answer your question.'

    Here is the content you should use to generate your answer:

    ${content}
    `;

  // Set the user's question separately
  const userQuestion = `Please respond to the following request or question with high confidence:

    ${question}`;

  // Request completion from OpenAI using the specified model
  const response = await openai.chat.completions.create({
    model: openaiModel,
    messages: [
      { role: 'system', content: systemMessage },
      { role: 'user', content: userQuestion },
    ],
  });

  // Log and handle the response
  if (!response.choices || response.choices.length === 0) {
    console.error('Model did not respond with any choices.');
    throw new Error('Model did not respond.');
  }

  const messageContent = response.choices[0].message.content;

  if (messageContent === null || messageContent.trim().length === 0) {
    console.error("Model's answer length is too short.");
    throw new Error("Model's answer is too short.");
  }

  const answer = messageContent.trim();

  return answer;
}

export async function authorizeAndGetSheet(jsonKey: string, spreadsheetId: string): Promise<any> {
  const credentials = JSON.parse(jsonKey);

  console.log(credentials);

  const serviceAccountAuth = new JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const doc = new GoogleSpreadsheet(spreadsheetId, serviceAccountAuth);
  await doc.loadInfo();

  const sheet = doc.sheetsByIndex[0];
  return sheet;
}
