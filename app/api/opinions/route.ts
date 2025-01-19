import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const onlyCount = url.searchParams.get('onlyCount') === 'true';

    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS || ''),
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Fetch the total count from B1
    const countResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: 'B1',
    });
    const totalCount = countResponse.data.values ? countResponse.data.values[0][0] : 0;

    // If only count is requested, return only the count
    if (onlyCount) {
      return NextResponse.json({ totalCount });
    }

    // Fetch the opinions data
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: 'A3:E',
    });

    const rows = response.data.values || [];

    const opinions = rows.map((row) => ({
      id: row[0],
      name: row[1],
      opinion: row[2],
      createdAt: row[3],
      metadata: JSON.parse(row[4]),
    }));

    // Include the total count in the response
    return NextResponse.json({ totalCount, opinions });
  } catch (error) {
    console.error('Failed to fetch opinions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch opinions' },
      { status: 500 }
    );
  }
}