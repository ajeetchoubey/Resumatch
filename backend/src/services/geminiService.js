import Groq from 'groq-sdk';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

const ANALYSIS_PROMPT = `You are an expert resume consultant and ATS optimization specialist. Analyze the following resume against the job description and provide detailed optimization suggestions.

## Resume:
{resumeText}

## Job Description:
{jdText}

## Your Task:
Provide a comprehensive analysis in JSON format with the following structure:

{
  "matchScore": <number 0-100>,
  "summary": "<brief overall assessment>",
  "keywordAnalysis": {
    "matched": ["<keywords found in both>"],
    "missing": ["<important JD keywords not in resume>"],
    "suggestions": ["<keywords to add if applicable>"]
  },
  "sections": {
    "experience": {
      "score": <number 0-100>,
      "suggestions": [
        {
          "original": "<original bullet point or null if new>",
          "optimized": "<rewritten version>",
          "reason": "<why this change helps>"
        }
      ]
    },
    "skills": {
      "score": <number 0-100>,
      "suggestions": ["<skill-related suggestions>"]
    },
    "summary": {
      "score": <number 0-100>,
      "optimized": "<rewritten professional summary tailored to JD>"
    }
  },
  "atsIssues": ["<any formatting or content issues that hurt ATS parsing>"],
  "topPriorities": ["<top 3-5 most impactful changes to make>"]
}

IMPORTANT: Return ONLY valid JSON, no markdown code blocks, no extra text. Be specific, actionable, and never fabricate experience.`;

/**
 * Analyze resume against job description using Groq (Llama 3.3)
 */
export async function analyzeResume(resumeText, jdText) {
    const prompt = ANALYSIS_PROMPT
        .replace('{resumeText}', resumeText)
        .replace('{jdText}', jdText);

    const completion = await groq.chat.completions.create({
        messages: [
            {
                role: 'user',
                content: prompt,
            },
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.3,
        response_format: { type: 'json_object' },
    });

    const response = completion.choices[0]?.message?.content;
    return JSON.parse(response);
}
