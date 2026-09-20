/**
 * Certificate AI Auto-Extraction Service
 * Automatically extracts certificate name, issuer organization, issue date, start date, and credential link
 * using Gemini multimodal vision API with client-side fallback.
 */

export interface ExtractedCertificateData {
  name: string;
  issuer: string;
  date: string;
  startDate?: string;
  credentialId?: string;
  link?: string;
  recipientName?: string;
  skills?: string[];
}

export async function extractCertificateDetails(
  base64DataUrl: string,
  fileName: string = ''
): Promise<ExtractedCertificateData> {
  // Determine mimeType
  const mimeMatch = base64DataUrl.match(/^data:([^;]+);base64,/);
  const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';

  try {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
    const res = await fetch(`${basePath}/api/gemini/extract-certificate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageBase64: base64DataUrl,
        mimeType,
        fileName,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.extracted) {
        return data.extracted;
      }
    }
  } catch (err) {
    console.warn('API extraction unavailable, using client fallback:', err);
  }

  // Smart heuristic fallback if running in offline or purely static environment
  return clientHeuristicExtractor(fileName);
}

function clientHeuristicExtractor(fileName: string): ExtractedCertificateData {
  const clean = fileName.replace(/\.[^/.]+$/, '').trim();
  const lower = clean.toLowerCase();

  let issuer = 'Verified Organization';
  if (lower.includes('wadhwani')) issuer = 'Wadhwani Foundation';
  else if (lower.includes('coursera')) issuer = 'Coursera';
  else if (lower.includes('udemy')) issuer = 'Udemy';
  else if (lower.includes('google')) issuer = 'Google';
  else if (lower.includes('hackerrank')) issuer = 'HackerRank';
  else if (lower.includes('ibm')) issuer = 'IBM';
  else if (lower.includes('aktu')) issuer = 'Dr. A.P.J. Abdul Kalam Technical University';
  else if (lower.includes('nptel')) issuer = 'NPTEL';
  else if (lower.includes('linkedin')) issuer = 'LinkedIn Learning';

  let name = clean
    .replace(/[_-]/g, ' ')
    .replace(/certificate/gi, '')
    .replace(/completion/gi, '')
    .trim();

  if (!name || name.length < 3) {
    name = 'Professional Course Completion';
  }

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).toUpperCase();

  return {
    name,
    issuer,
    date: formattedDate,
    startDate: '',
    credentialId: '',
    link: '',
    recipientName: 'Abhishek Singh Yadav',
    skills: [],
  };
}
