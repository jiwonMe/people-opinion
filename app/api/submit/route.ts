import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS || ''),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    
    const row = [
      data.sessionId ?? crypto.randomUUID(),
      data.name,
      data.wannabe,
      data.reason,
      data.opinion,
      new Date().toISOString(),
      data.name.slice(0, 1) + '**',
      data.gender,
      data.birth,
      data.address,
      data.email,
      data.phone,
      data.referral,
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SHEET_ID,
      range: 'A3:M',
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