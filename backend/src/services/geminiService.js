import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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

Be specific, actionable, and never fabricate experience. Focus on better presenting existing qualifications.`;

/**
 * Analyze resume against job description using Gemini
 */
export async function analyzeResume(resumeText, jdText) {
    const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: {
            responseMimeType: 'application/json',
        },
    });

    const prompt = ANALYSIS_PROMPT
        .replace('{resumeText}', resumeText)
        .replace('{jdText}', jdText);

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    return JSON.parse(response);
}
