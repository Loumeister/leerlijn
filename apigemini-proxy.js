// Bestandsnaam: /api/gemini-proxy.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is verplicht' });
  }

  // Haal de geheime API-sleutel op uit de server-omgeving
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
     return res.status(500).json({ error: 'API sleutel is niet geconfigureerd op de server.' });
  }

  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
  const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };

  try {
    const geminiResponse = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!geminiResponse.ok) {
      throw new Error(`Gemini API Error: ${geminiResponse.statusText}`);
    }
    const geminiData = await geminiResponse.json();
    return res.status(200).json(geminiData);
  } catch (error) {
    console.error('Proxy Error:', error);
    return res.status(500).json({ error: 'Interne serverfout in de proxy.' });
  }
}
