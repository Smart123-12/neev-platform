/* global process */

const GEMINI_ENDPOINT =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server' });
  }

  let body = req.body || {};
  if (typeof req.body === 'string') {
    try {
      body = JSON.parse(req.body);
    } catch (error) {
      console.error('Invalid JSON body:', error);
      return res.status(400).json({ error: 'Invalid JSON body' });
    }
  }
  const prompt = body.prompt?.trim();
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const geminiRes = await fetch(GEMINI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 1500,
        },
      }),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error('Gemini upstream error:', geminiRes.status, errText);
      return res.status(geminiRes.status).json({ error: 'Gemini request failed' });
    }

    const data = await geminiRes.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    return res.status(200).json({ text });
  } catch (error) {
    console.error('Gemini proxy error:', error);
    return res.status(500).json({ error: 'Failed to call Gemini' });
  }
}
