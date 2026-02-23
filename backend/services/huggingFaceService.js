const { queryHuggingFace } = require("../hfClient");

/**
 * Analyze resume using Hugging Face API
 * @param {string} resumeText - Raw resume text
 * @param {string} educationLevel - Detected education level
 * @param {string} experienceLevel - Experience level
 * @param {number} yearsExperience - Years of experience
 * @param {boolean} suggestInternships - Whether to suggest internships
 * @returns {Promise<string>} API response text
 */
async function analyzeResume(resumeText, educationLevel, experienceLevel, yearsExperience, suggestInternships) {
  const truncatedText = resumeText.substring(0, 2000);

  const hfRequest = {
    model: "moonshotai/Kimi-K2.5:novita",
    messages: [
      {
        role: "user",
        content: `Analyze this resume. The candidate's education level is ${educationLevel} (${experienceLevel} level) with ${yearsExperience} years of experience.

Based on their ACTUAL SKILLS and EXPERIENCE from the resume, suggest appropriate opportunities.

IMPORTANT: 
- If they are a student or have less than 2 years experience, suggest BOTH jobs and internships
- If they have more than 2 years experience, suggest only jobs

Resume: ${truncatedText}

Return in this EXACT format:

RESUME ANALYSIS:
Skills:
- [list each skill found in the resume]

Experience:
- [list each job/experience from the resume]

Education:
- [list each degree from the resume]

CAREER SUGGESTIONS:
JOB RECOMMENDATIONS:
1. [Job Title 1] - [Why this job matches their skills]
2. [Job Title 2] - [Why this job matches their skills]
3. [Job Title 3] - [Why this job matches their skills]

${suggestInternships ? `INTERNSHIP RECOMMENDATIONS:
1. [Internship Title 1] - [Why this matches their student status]
2. [Internship Title 2] - [Why this matches their student status]
3. [Internship Title 3] - [Why this matches their student status]` : ''}

Only return in this format, no extra text.`
      }
    ],
    parameters: { max_new_tokens: 1200, temperature: 0.1 }
  };

  const hfResponse = await queryHuggingFace(hfRequest);
  
  let fullResponse = "";
  if (hfResponse && hfResponse.choices && hfResponse.choices.length > 0) {
    fullResponse = hfResponse.choices[0].message.content || "";
  }
  
  return fullResponse;
}

module.exports = { analyzeResume };