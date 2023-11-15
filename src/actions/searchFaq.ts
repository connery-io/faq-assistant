import { ActionDefinition, ActionContext, OutputParametersObject } from '@connery-io/sdk';
import { authorizeAndGetSheetsClient } from '../shared/utils';
import { FaqItem } from '../shared/types';
import { ChatOpenAI, HumanMessage, SystemMessage } from '../shared/lanchainWrapper';

const action: ActionDefinition = {
  key: 'searchFaq',
  title: 'Search FAQ',
  description: 'Search the FAQ list for the most relevant answer to the question prompt. Every access to the FAQs will be logged to a separate Google Sheet.',
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
      description: 'Status of the search. If the search was successful, the status will be "found". If the search was unsuccessful, the status will be "not_found".',
      type: 'string',
      validation: {
        required: true
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
export default action;

export async function handler({
  inputParameters,
  configurationParameters,
}: ActionContext): Promise<OutputParametersObject> {
  const doc = await authorizeAndGetSheetsClient(
    configurationParameters.jsonKey,
    configurationParameters.faqListSheetId,
  );

  const sheet = doc.sheetsByIndex[0];
  const rows = await sheet.getRows();

  // Convert the response to a list of FAQs
  const faqList: FaqItem[] = rows.map((row) => ({
    question: row.get('Question'),
    answer: row.get('Answer'),
  }));

  const chat = new ChatOpenAI({
    openAIApiKey: configurationParameters.openAiApiKey,
    modelName: 'gpt-3.5-turbo-0613',
  }).bind({
    functions: generateFunctionSchema(faqList),
  });

  const chatResult = await chat.invoke([
    new SystemMessage(
      `You are an FAQ agent of our firm and want to provide the most helpful answer based on the predefined list of FAQs.`,
    ),
    new HumanMessage(inputParameters.questionPrompt),
  ]);

  const functionCall = chatResult.additional_kwargs?.function_call;

  if (functionCall) {
    const faq = faqList[getIndexFromFunctionName(functionCall.name)];
    return {
      searchStatus: 'found',
      faqQuestion: faq.question,
      faqAnswer: faq.answer,
    };
  } else {
    return {
      searchStatus: 'not_found',
    };
  }
}

function getIndexFromFunctionName(functionName: string) {
  return parseInt(functionName.replace('faq', ''));
}

function generateFunctionSchema(faqList: FaqItem[]) {
  // generate function calling scema from faqList to pass it to OpenAI
  const functionSchema = [];

  for (var i = 0; i < faqList.length; i++) {
    functionSchema.push({
      name: `faq${i}`,
      description: faqList[i].question,
      parameters: {
        type: 'object',
        properties: {},
        required: [],
      },
    });
  }

  return functionSchema;
}
