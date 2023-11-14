import { GoogleSpreadsheet } from './googleSpreadsheetWrapper';
import { JWT } from 'google-auth-library';

export async function authorizeAndGetSheetsClient(jsonKey: string, spreadsheetId: string): Promise<any> {
  const credentials = JSON.parse(jsonKey);

  const serviceAccountAuth = new JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const doc = new GoogleSpreadsheet(spreadsheetId, serviceAccountAuth);
  await doc.loadInfo();

  return doc;
}

/*
import { google, sheets_v4 } from 'googleapis';

export async function authorizeAndGetSheetsClient(jsonKey: string): Promise<sheets_v4.Sheets> {
  const credentials = JSON.parse(jsonKey);

  // Configure a JWT client with the service account
  const jwtClient = new google.auth.JWT(credentials.client_email, undefined, credentials.private_key, [
    'https://www.googleapis.com/auth/spreadsheets',
  ]);

  // Authenticate request
  await jwtClient.authorize();

  // Create Google Sheets API client
  const sheets = google.sheets({ version: 'v4', auth: jwtClient });

  return sheets;
}
*/
