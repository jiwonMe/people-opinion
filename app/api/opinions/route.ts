import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export const dynamic = 'force-dynamic';

// Cache object to store fetched data
let cache: { data: any; timestamp: number } | null = null;
// const CACHE_DURATION = 5 * 60 * 1000; // Cache duration in milliseconds (e.g., 5 minutes)
const CACHE_DURATION = 0

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const onlyCount = url.searchParams.get('onlyCount') === 'true';

    // Check if cache is valid
    if (cache && Date.now() - cache.timestamp < CACHE_DURATION) {
      console.log('Returning cached data');
      return NextResponse.json(cache.data);
    }

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
      const responseData = { totalCount };
      cache = { data: responseData, timestamp: Date.now() };
      return NextResponse.json(responseData);
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
    const responseData = { totalCount, opinions };
    cache = { data: responseData, timestamp: Date.now() };
    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Failed to fetch opinions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch opinions' },
      { status: 500 }
    );
  }
}