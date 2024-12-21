import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS || ''),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    
    const row = [
      crypto.randomUUID(),
      data.name,
      data.opinion,
      new Date().toISOString(),
      JSON.stringify({
        gender: data.gender,
        age: data.age,
        address: data.address,
      }),
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SHEET_ID,
      range: 'Opinions!A2:E',
      valueInputOption: 'RAW',
      requestBody: {
        values: [row],
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to submit opinion:', error);
    return NextResponse.json(
      { error: 'Failed to submit opinion' },
      { status: 500 }
    );
  }
}