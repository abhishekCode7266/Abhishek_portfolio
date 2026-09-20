import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageBase64, mimeType = 'image/jpeg', fileName } = body;

    if (!imageBase64) {
      return NextResponse.json(
        { error: 'No image data provided' },
        { status: 400 }
      );
    }

    // Clean base64 string if it contains data prefix
    const cleanBase64 = imageBase64.replace(/^data:[^;]+;base64,/, '');

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Fallback heuristics if API key is not yet set in local environment
      return NextResponse.json({
        success: true,
        fallback: true,
        extracted: fallbackExtractor(fileName || ''),
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const prompt = `You are an expert document and certificate OCR analyzer.
Analyze this uploaded certificate or credential document carefully.
Extract the following information:
1. "name": The exact, complete title or course name of the certification (e.g. "Fundamentals of Artificial Intelligence", "Java Programming Masterclass", "AWS Certified Cloud Practitioner").
2. "issuer": The organization, academy, university, platform, or authority that issued it (e.g. "Wadhwani Foundation", "Google", "Coursera", "HackerRank", "IBM", "Udemy", "AKTU").
3. "date": The completion date, issue date, or award date formatted cleanly (e.g. "18/JULY/2026", "July 2026", or "DD/MM/YYYY").
4. "startDate": The start date if mentioned, otherwise leave empty string.
5. "credentialId": Credential ID, certificate number, or verification code if visible, otherwise empty string.
6. "link": Verification link or official verification URL printed on the certificate, or the official website of the issuer.
7. "recipientName": The recipient's full name printed on the certificate.
8. "skills": An array of technical or domain skills mentioned or covered (e.g. ["Artificial Intelligence", "Machine Learning", "Python"]).

Be accurate and make sure not to confuse the student name with the issuer.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType || 'image/jpeg',
              data: cleanBase64,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: {
              type: Type.STRING,
              description: 'Official name of the certificate or course',
            },
            issuer: {
              type: Type.STRING,
              description: 'Issuing organization or platform',
            },
            date: {
              type: Type.STRING,
              description: 'Completion or issue date',
            },
            startDate: {
              type: Type.STRING,
              description: 'Start date if available',
            },
            credentialId: {
              type: Type.STRING,
              description: 'Credential ID or Certificate number',
            },
            link: {
              type: Type.STRING,
              description: 'Verification URL or organization website',
            },
            recipientName: {
              type: Type.STRING,
              description: 'Name of the recipient on the certificate',
            },
            skills: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Skills or topics covered',
            },
          },
          required: ['name', 'issuer', 'date'],
        },
      },
    });

    const text = response.text;
    if (!text) {
      return NextResponse.json({
        success: true,
        fallback: true,
        extracted: fallbackExtractor(fileName || ''),
      });
    }

    const parsed = JSON.parse(text);
    return NextResponse.json({
      success: true,
      extracted: {
        name: parsed.name || 'Professional Certification',
        issuer: parsed.issuer || 'Verified Organization',
        date: parsed.date || new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase(),
        startDate: parsed.startDate || '',
        credentialId: parsed.credentialId || '',
        link: parsed.link || '',
        recipientName: parsed.recipientName || '',
        skills: Array.isArray(parsed.skills) ? parsed.skills : [],
      },
    });
  } catch (error) {
    console.error('Certificate extraction error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Extraction failed',
      },
      { status: 500 }
    );
  }
}

function fallbackExtractor(fileName: string) {
  const cleanName = fileName.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
  return {
    name: cleanName || 'Verified Certification',
    issuer: 'Professional Organization',
    date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase(),
    startDate: '',
    credentialId: '',
    link: '',
    recipientName: 'Abhishek Singh Yadav',
    skills: [],
  };
}
