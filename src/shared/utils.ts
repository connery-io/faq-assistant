import { JWT } from 'google-auth-library';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { FaqItem } from './types.js';

export async function authorizeAndGetSheet(jsonKey: string, spreadsheetId: string): Promise<any> {
  const credentials = JSON.parse(jsonKey);

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

export function getIndexFromFunctionName(functionName: string): number {
  return parseInt(functionName.replace('faq', ''));
}

export function generateFunctionSchema(faqList: FaqItem[]): any[] {
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
