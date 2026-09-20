import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    if (!data || typeof data !== 'object') {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'public', 'portfolio-data.json');
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');

    return NextResponse.json({ 
      success: true, 
      message: 'Portfolio data synchronized to public/portfolio-data.json' 
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to write file';
    console.error('Failed to save portfolio data to file:', err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
