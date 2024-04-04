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
      key: 'searchStatus',
      title: 'Search Status',
      description:
        'Status of the search. If the search was successful, the status will be "found". If the search was unsuccessful, the status will be "not_found".',
      type: 'string',
      validation: {
        required: true,
      },
    },
    {
      key: 'faqQuestion',
      title: 'FAQ Question',
      description: 'Question from the FAQ list.',
      type: 'string',
    },
    {
      key: 'faqAnswer',
      title: 'FAQ Answer',
      description: 'Answer from the FAQ list.',
      type: 'string',
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
  const result: any = {
    searchStatus: 'not_found',
    faqQuestion: undefined,
    faqAnswer: undefined,
  };
  const functionCall = chatResult.additional_kwargs?.function_call;
  if (functionCall) {
    const faq = faqList[getIndexFromFunctionName(functionCall.name)];
    result.searchStatus = 'found';
    result.faqQuestion = faq.question;
    result.faqAnswer = faq.answer;
  }

  // Log the search to a separate Google Sheet
  const logSheet = await authorizeAndGetSheet(configuration.jsonKey, configuration.faqLogSheetId);
  await logSheet.addRow({
    'Question Prompt': input.questionPrompt,
    'Search Status': result.searchStatus,
    'FAQ Question': result.faqQuestion,
    'FAQ Answer': result.faqAnswer,
    'Search Timestamp': new Date().toISOString(),
  });

  // Return the output parameters
  return result;
}
