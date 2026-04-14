// ─────────────────────────────────────────────
//  NEEV Gemini AI Service
//  Uses Gemini 1.5 Flash for volunteer matching,
//  need parsing, and impact report generation
// ─────────────────────────────────────────────

const GEMINI_ENDPOINT =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

async function callGemini(prompt) {
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const res = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 1500,
      },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
}

/**
 * Function 1 — Match top 3 volunteers to a community need.
 * @param {object} need - The need document
 * @param {object[]} volunteers - Array of volunteer profiles
 * @returns {Promise<object[]>} Array of up to 3 match objects
 */
export async function matchVolunteersToNeed(need, volunteers) {
  const prompt = `You are NEEV's volunteer matching AI for NGOs in India.

Given this community need:
${JSON.stringify(need, null, 2)}

And these available volunteers:
${JSON.stringify(volunteers, null, 2)}

Return ONLY a JSON object (no markdown, no explanation, no code fences) with this exact structure:
{
  "matches": [
    {
      "volunteerId": "string",
      "name": "string",
      "matchScore": 0-100,
      "matchedSkills": ["skill1", "skill2"],
      "reason": "1 sentence explaining why this volunteer is a good match",
      "estimatedImpact": "brief estimate of hours and impact"
    }
  ]
}

Rules:
- Return exactly the top 3 matches sorted by matchScore descending.
- Consider skill overlap, city proximity, availability hours, and past experience.
- matchScore should reflect true relevance (0 = no match, 100 = perfect match).
- Be specific and warm in the reason field.
- Return ONLY the raw JSON, nothing else.`;

  try {
    const text = await callGemini(prompt);
    // Strip any accidental markdown code fences
    const cleaned = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    return parsed?.matches ?? [];
  } catch (err) {
    console.error('Gemini matchVolunteersToNeed error:', err);
    return [];
  }
}

/**
 * Function 2 — Parse structured need fields from free-form NGO text.
 * @param {string} rawText - Free-form description of the need
 * @returns {Promise<object>} { category, urgency, requiredSkills, summary }
 */
export async function parseNeedFromText(rawText) {
  const prompt = `You are NEEV's AI assistant for NGOs in India.
Extract structured information from this free-form need description:

"${rawText}"

Return ONLY a JSON object (no markdown, no code fences):
{
  "category": "one of: Medical, Education, Food & Nutrition, Disaster Relief, Women Empowerment, Environment, Other",
  "urgency": "one of: High, Medium, Low",
  "requiredSkills": ["array", "of", "skills"],
  "summary": "one concise sentence describing the need"
}

Return ONLY the raw JSON, nothing else.`;

  try {
    const text = await callGemini(prompt);
    const cleaned = text.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.error('Gemini parseNeedFromText error:', err);
    return { category: 'Other', urgency: 'Medium', requiredSkills: [], summary: rawText };
  }
}

/**
 * Function 3 — Generate a monthly impact report for an NGO.
 * @param {object[]} completedTasks - Array of completed assignment + need details
 * @returns {Promise<string>} 3-sentence impact report
 */
export async function generateImpactReport(completedTasks) {
  const prompt = `Write a 3-sentence monthly impact report for an NGO based on these completed volunteer tasks:

${JSON.stringify(completedTasks, null, 2)}

Be warm, specific, and data-driven. Mention hours contributed, people served, and community outcomes where possible. No headers, no bullet points, no markdown — just three flowing sentences.`;

  try {
    return await callGemini(prompt);
  } catch (err) {
    console.error('Gemini generateImpactReport error:', err);
    return 'Unable to generate impact report at this time. Please try again later.';
  }
}
