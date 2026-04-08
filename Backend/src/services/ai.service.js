const { GoogleGenAI } = require("@google/genai")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {

    const prompt = `You are an expert technical interviewer. Analyze the candidate's resume, self description, and job description, then generate a detailed interview report.

Resume: ${resume}
Self Description: ${selfDescription}
Job Description: ${jobDescription}

Respond ONLY with a valid JSON object. No markdown, no backticks, no explanation — just raw JSON.
The JSON must strictly follow this structure:

{
  "matchScore": <integer between 0 and 100>,
  "title": "<job title extracted from job description>",
  "technicalQuestions": [
    {
      "question": "<technical question to ask candidate>",
      "intention": "<why interviewer asks this>",
      "answer": "<how candidate should answer, key points to cover>"
    }
  ],
  "behavioralQuestions": [
    {
      "question": "<behavioral question to ask candidate>",
      "intention": "<why interviewer asks this>",
      "answer": "<how candidate should answer using STAR method>"
    }
  ],
  "skillGaps": [
    {
      "skill": "<missing or weak skill>",
      "severity": "<low | medium | high>"
    }
  ],
  "preparationPlan": [
    {
      "day": <day number starting from 1>,
      "focus": "<topic to focus on this day>",
      "tasks": ["<task 1>", "<task 2>", "<task 3>"]
    }
  ]
}

Requirements:
- Generate at least 5 technical questions
- Generate at least 3 behavioral questions  
- Identify all relevant skill gaps
- Create a 7-day preparation plan
- matchScore should reflect how well the resume matches the job description`

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview", // or whichever model worked for you
        contents: prompt,
        config: {
            responseMimeType: "application/json", // keep this
        }
        //  Remove responseSchema entirely — it's not working
    })

    console.log("AI response: ", response.text)
    return JSON.parse(response.text)
}

module.exports = { generateInterviewReport }