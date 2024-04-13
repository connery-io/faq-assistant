import { ActionDefinition, ActionContext, OutputObject } from 'connery';
import { authorizeAndGetSheet, generateFunctionSchema, getIndexFromFunctionName } from '../shared/utils.js';
import { FaqItem } from '../shared/types.js';
import { HumanMessage, SystemMessage } from 'langchain/schema';
import { ChatOpenAI } from 'langchain/chat_models/openai';

const actionDefinition: ActionDefinition = {
  key: 'searchFaq',
  title: 'Search FAQ',
  description:
    'Search the FAQ list for the most relevant answer to the question prompt. Every access to the FAQs will be logged to a separate Google Sheet.',
  type: 'read',
  inputParameters: [
    {
      key: 'questionPrompt',
      title: 'Question prompt',
      description: 'The question prompt to search the FAQ list for the most relevant answer.',
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
      title: 'Text response',
      description: 'The text response of the search result.',
      type: 'string',
      validation: {
        required: true,
      },
    },
  ],
};
export default actionDefinition;

export async function handler({ input, configuration }: ActionContext): Promise<OutputObject> {
  const sheet = await authorizeAndGetSheet(configuration.jsonKey, configuration.faqListSheetId);
  const rows = await sheet.getRows();

  // Convert the response to a list of FAQs
  const faqList: FaqItem[] = rows.map((row: any) => ({
    question: row.get('Question'),
    answer: row.get('Answer'),
  }));

  // Search the FAQ list for the most relevant answer to the question prompt
  const chat = new ChatOpenAI({
    openAIApiKey: configuration.openAiApiKey,
    modelName: configuration.openAiModel,
  }).bind({
    functions: generateFunctionSchema(faqList),
  });

  const chatResult = await chat.invoke([
    new SystemMessage(
      `You are an FAQ agent of our firm and want to provide the most helpful answer based on the predefined list of FAQs.`,
    ),
    new HumanMessage(input.questionPrompt),
  ]);

  // Convert the chat result to the output parameters
  let textResponse: string;
  const functionCall = chatResult.additional_kwargs?.function_call;
  if (functionCall) {
    const faq = faqList[getIndexFromFunctionName(functionCall.name)];

    textResponse =
      'Here is an FAQ that is most relevant to your question prompt:\n\n' +
      `*Question*: ${faq.question}\n` +
      `*Answer*: ${faq.answer}\n\n` +
      `If this is not the FAQ you are looking for, please report the missing FAQ to the manager.`;

    await logRequest(
      configuration.jsonKey,
      configuration.faqLogSheetId,
      configuration.questionPrompt,
      'found',
      faq.question,
      faq.answer,
    );
  } else {
    textResponse =
      'Sorry, I could not find any relevant FAQs on the list.\n\nPlease report the missing FAQ to the manager.';

    await logRequest(
      configuration.jsonKey,
      configuration.faqLogSheetId,
      input.questionPrompt,
      'not_found',
    );
  }

  // Return the output parameters
  return {
    textResponse,
  };
}

// Log the search to a separate Google Sheet
async function logRequest(jsonKey, faqLogSheetId, questionPrompt, searchStatus, faqQuestion = '', faqAnswer = '') {
  const logSheet = await authorizeAndGetSheet(jsonKey, faqLogSheetId);
  await logSheet.addRow({
    'Question Prompt': questionPrompt,
    'Search Status': searchStatus,
    'FAQ Question': faqQuestion,
    'FAQ Answer': faqAnswer,
    'Search Timestamp': new Date().toISOString(),
  });
}
