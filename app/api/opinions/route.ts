import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function GET() {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS || ''),
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: 'Opinions!A2:E',
    });

    const rows = response.data.values || [];
    
    const opinions = rows.map((row) => ({
      id: row[0],
      name: row[1],
      opinion: row[2],
      createdAt: row[3],
    }));

    return NextResponse.json(opinions);
  } catch (error) {
    console.error('Failed to fetch opinions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch opinions' },
      { status: 500 }
    );
  }
}