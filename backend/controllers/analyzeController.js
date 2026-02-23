const fs = require("fs");
const pdfParse = require("pdf-parse");
const { analyzeResume } = require("../services/huggingFaceService");
const { 
  detectEducationLevel, 
  getExperienceLevel, 
  shouldSuggestInternships,
  extractYearsOfExperience 
} = require("../utils/educationDetector");
const { 
  generateFallbackJobSuggestions, 
  generateFallbackInternshipSuggestions 
} = require("../utils/suggestionGenerator");
const { experienceLevels } = require("../config/constants");

/**
 * Controller for resume analysis endpoint
 */
async function analyzeResumeController(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const filePath = req.file.path;

  try {
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    const resumeText = pdfData.text;

    if (!resumeText || resumeText.trim() === "") {
      return res.status(400).json({ error: "PDF has no readable text" });
    }

    const educationLevel = detectEducationLevel(resumeText);
    const experienceLevel = getExperienceLevel(educationLevel, experienceLevels);
    const yearsExperience = extractYearsOfExperience(resumeText);
    const suggestInternships = shouldSuggestInternships(educationLevel, resumeText);
    
    console.log(`📚 Education level detected: ${educationLevel}`);
    console.log(`💼 Experience level: ${experienceLevel}`);

    const fullResponse = await analyzeResume(
      resumeText, 
      educationLevel, 
      experienceLevel, 
      yearsExperience, 
      suggestInternships
    );

    let analysis = "";
    let jobSuggestions = "";
    let internshipSuggestions = "";

    const analysisMatch = fullResponse.match(/RESUME ANALYSIS:([\s\S]*?)(?=CAREER SUGGESTIONS:|$)/i);
    if (analysisMatch) {
      analysis = analysisMatch[1].trim();
    }

    const jobsMatch = fullResponse.match(/JOB RECOMMENDATIONS:([\s\S]*?)(?=INTERNSHIP RECOMMENDATIONS:|$)/i);
    if (jobsMatch) {
      jobSuggestions = jobsMatch[1].trim();
    }

    const internshipsMatch = fullResponse.match(/INTERNSHIP RECOMMENDATIONS:([\s\S]*?)(?=$)/i);
    if (internshipsMatch) {
      internshipSuggestions = internshipsMatch[1].trim();
    }

    if (!jobSuggestions) {
      jobSuggestions = generateFallbackJobSuggestions(analysis, educationLevel);
    }

    if (suggestInternships && !internshipSuggestions) {
      internshipSuggestions = generateFallbackInternshipSuggestions(analysis, educationLevel);
    }

    const allSuggestions = {
      jobs: jobSuggestions,
      internships: internshipSuggestions
    };

    res.json({ 
      success: true,
      analysis: analysis || "Analysis complete",
      suggestions: allSuggestions,
      educationLevel: educationLevel,
      experienceLevel: experienceLevel,
      shouldSuggestInternships: suggestInternships,
      rawResponse: fullResponse
    });
    
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ 
      error: "Failed to analyze resume", 
      details: err.message 
    });
  } finally {
    // Clean up uploaded file
    fs.unlink(filePath, (err) => {
      if (err) console.error("Failed to delete file:", err);
    });
  }
}

module.exports = { analyzeResumeController };