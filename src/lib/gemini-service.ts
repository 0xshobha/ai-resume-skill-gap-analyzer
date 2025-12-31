'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { ResumeAnalysis } from './types';

// Maximum text lengths to prevent excessive API costs
const MAX_RESUME_LENGTH = 50000;
const MAX_JOB_DESCRIPTION_LENGTH = 10000;

/**
 * Analyze resume using Google Gemini API
 */
export async function analyzeResume(
  extractedText: string,
  jobDescription?: string
): Promise<ResumeAnalysis> {
  const apiKey = process.env.GEMINI_API_KEY;

  console.log('GEMINI_API_KEY exists:', !!apiKey);
  console.log('GEMINI_API_KEY length:', apiKey?.length || 0);

  if (!apiKey) {
    console.error('GEMINI_API_KEY is not set in environment variables');
    throw new Error('Gemini API key is not configured. Please set GEMINI_API_KEY in your environment variables.');
  }

  // Validate and truncate inputs to prevent excessive API usage
  if (!extractedText || extractedText.trim().length === 0) {
    throw new Error('No resume text provided for analysis.');
  }

  const truncatedResumeText = extractedText.slice(0, MAX_RESUME_LENGTH);
  const truncatedJobDescription = jobDescription?.slice(0, MAX_JOB_DESCRIPTION_LENGTH);

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = buildAnalysisPrompt(truncatedResumeText, truncatedJobDescription);

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    const analysis = parseGeminiResponse(text, truncatedResumeText, truncatedJobDescription);
    return analysis;
  } catch (error) {
    console.error('Gemini API error:', error);
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        throw new Error('Invalid Gemini API key. Please check your configuration.');
      }
      if (error.message.includes('rate limit') || error.message.includes('quota')) {
        throw new Error('API rate limit exceeded. Please try again in a few minutes.');
      }
    }
    throw new Error(`Failed to analyze resume: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Build the analysis prompt for Gemini
 */
function buildAnalysisPrompt(resumeText: string, jobDescription?: string): string {
  const jobMatchSection = jobDescription
    ? `
## Job Description for Matching
${jobDescription}

Please also calculate a job match score (0-100) and identify missing keywords from the job description.
`
    : '';

  return `You are an expert resume analyzer and career coach. Analyze the following resume and provide detailed feedback.

## Resume Content
${resumeText}

${jobMatchSection}

Please analyze this resume and provide a response in the following JSON format (and ONLY JSON, no markdown code blocks):

{
  "overallScore": <number 0-100>,
  "atsScore": <number 0-100>,
  ${jobDescription ? '"jobMatchScore": <number 0-100>,' : ''}
  "sections": {
    "contact": {
      "present": <boolean>,
      "score": <number 0-100>,
      "feedback": "<string with specific feedback>"
    },
    "summary": {
      "present": <boolean>,
      "score": <number 0-100>,
      "feedback": "<string with specific feedback>"
    },
    "experience": {
      "present": <boolean>,
      "score": <number 0-100>,
      "feedback": "<string with specific feedback>"
    },
    "education": {
      "present": <boolean>,
      "score": <number 0-100>,
      "feedback": "<string with specific feedback>"
    },
    "skills": {
      "present": <boolean>,
      "score": <number 0-100>,
      "feedback": "<string with specific feedback>"
    }
  },
  "skills": {
    "identified": ["<skill1>", "<skill2>", ...]${jobDescription ? ',\n    "missing": ["<missing_skill1>", "<missing_skill2>", ...]' : ''}
  },
  "improvements": [
    {
      "category": "<content|format|keywords|structure>",
      "priority": "<high|medium|low>",
      "title": "<short title>",
      "description": "<detailed description>",
      "example": "<optional example>"
    }
  ],
  "atsIssues": [
    {
      "issue": "<description of ATS issue>",
      "impact": "<high|medium|low>",
      "solution": "<how to fix it>"
    }
  ]
}

Provide at least 3-5 improvement suggestions and identify any ATS compatibility issues.
Be specific and actionable in your feedback.
Ensure all scores are integers between 0 and 100.
`;
}

/**
 * Parse and validate Gemini response
 */
function parseGeminiResponse(
  responseText: string,
  extractedText: string,
  jobDescription?: string
): ResumeAnalysis {
  try {
    // Clean the response - remove markdown code blocks if present
    let cleanedResponse = responseText.trim();
    if (cleanedResponse.startsWith('```json')) {
      cleanedResponse = cleanedResponse.slice(7);
    }
    if (cleanedResponse.startsWith('```')) {
      cleanedResponse = cleanedResponse.slice(3);
    }
    if (cleanedResponse.endsWith('```')) {
      cleanedResponse = cleanedResponse.slice(0, -3);
    }
    cleanedResponse = cleanedResponse.trim();

    const parsed = JSON.parse(cleanedResponse);

    // Validate and ensure all required fields exist
    const analysis: ResumeAnalysis = {
      overallScore: clampScore(parsed.overallScore),
      atsScore: clampScore(parsed.atsScore),
      jobMatchScore: jobDescription ? clampScore(parsed.jobMatchScore) : undefined,
      sections: {
        contact: validateSection(parsed.sections?.contact),
        summary: validateSection(parsed.sections?.summary),
        experience: validateSection(parsed.sections?.experience),
        education: validateSection(parsed.sections?.education),
        skills: validateSection(parsed.sections?.skills),
      },
      skills: {
        identified: Array.isArray(parsed.skills?.identified) ? parsed.skills.identified : [],
        missing: jobDescription && Array.isArray(parsed.skills?.missing) ? parsed.skills.missing : undefined,
      },
      improvements: Array.isArray(parsed.improvements)
        ? parsed.improvements.map(validateImprovement)
        : [],
      atsIssues: Array.isArray(parsed.atsIssues)
        ? parsed.atsIssues.map(validateATSIssue)
        : [],
      extractedText,
      analyzedAt: new Date().toISOString(),
    };

    return analysis;
  } catch (error) {
    console.error('Failed to parse Gemini response:', error);
    console.error('Response text:', responseText);
    throw new Error('Failed to parse analysis results. Please try again.');
  }
}

/**
 * Clamp score to 0-100 range
 */
function clampScore(score: unknown): number {
  const num = typeof score === 'number' ? score : parseInt(String(score), 10);
  if (isNaN(num)) return 50;
  return Math.max(0, Math.min(100, Math.round(num)));
}

/**
 * Validate section analysis
 */
function validateSection(section: unknown): {
  present: boolean;
  score: number;
  feedback: string;
} {
  if (!section || typeof section !== 'object') {
    return { present: false, score: 0, feedback: 'Section not found in resume.' };
  }
  const s = section as Record<string, unknown>;
  return {
    present: Boolean(s.present),
    score: clampScore(s.score),
    feedback: typeof s.feedback === 'string' ? s.feedback : 'No feedback available.',
  };
}

/**
 * Validate improvement
 */
function validateImprovement(imp: unknown): {
  category: 'content' | 'format' | 'keywords' | 'structure';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  example?: string;
} {
  const i = (imp || {}) as Record<string, unknown>;
  const categories = ['content', 'format', 'keywords', 'structure'] as const;
  const priorities = ['high', 'medium', 'low'] as const;

  return {
    category: categories.includes(i.category as (typeof categories)[number])
      ? (i.category as (typeof categories)[number])
      : 'content',
    priority: priorities.includes(i.priority as (typeof priorities)[number])
      ? (i.priority as (typeof priorities)[number])
      : 'medium',
    title: typeof i.title === 'string' ? i.title : 'Improvement suggestion',
    description: typeof i.description === 'string' ? i.description : 'No description available.',
    example: typeof i.example === 'string' ? i.example : undefined,
  };
}

/**
 * Validate ATS issue
 */
function validateATSIssue(issue: unknown): {
  issue: string;
  impact: 'high' | 'medium' | 'low';
  solution: string;
} {
  const i = (issue || {}) as Record<string, unknown>;
  const impacts = ['high', 'medium', 'low'] as const;

  return {
    issue: typeof i.issue === 'string' ? i.issue : 'Unknown issue',
    impact: impacts.includes(i.impact as (typeof impacts)[number])
      ? (i.impact as (typeof impacts)[number])
      : 'medium',
    solution: typeof i.solution === 'string' ? i.solution : 'No solution provided.',
  };
}
