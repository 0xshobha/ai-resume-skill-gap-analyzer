import { NextResponse } from 'next/server';

export async function GET() {
  const hasGeminiKey = !!process.env.GEMINI_API_KEY;
  const keyLength = process.env.GEMINI_API_KEY?.length || 0;
  
  return NextResponse.json({
    status: 'ok',
    geminiKeyConfigured: hasGeminiKey,
    keyLength: keyLength,
    timestamp: new Date().toISOString(),
  });
}
