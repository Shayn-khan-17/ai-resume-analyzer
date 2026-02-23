/**
 * Detect education level from resume text
 * @param {string} resumeText - Raw text from resume
 * @returns {string} Education level
 */
function detectEducationLevel(resumeText) {
  const text = resumeText.toLowerCase();
  
  if (text.includes('phd') || text.includes('doctorate') || text.includes('doctoral') || text.includes('ph.d')) {
    return 'phd';
  }
  
  if (text.includes('master') || text.includes('m.s.') || text.includes('m.sc') || text.includes('mba') || text.includes('masters')) {
    return 'masters';
  }
  
  if (text.includes('bachelor') || text.includes('b.s.') || text.includes('b.sc') || text.includes('b.tech') || text.includes('bs') || text.includes('undergraduate')) {
    return 'bachelors';
  }
  
  if (text.includes('high school') || text.includes('f.sc') || text.includes('fsc') || text.includes('intermediate') || text.includes('hssc')) {
    return 'highschool';
  }
  
  if (text.includes('student') || text.includes('studying') || text.includes('pursuing') || (text.includes('current') && text.includes('university'))) {
    return 'student';
  }
  
  return 'unknown';
}

/**
 * Get experience level based on education
 * @param {string} educationLevel - Detected education level
 * @param {Object} experienceLevels - Mapping of education to experience
 * @returns {string} Experience level
 */
function getExperienceLevel(educationLevel, experienceLevels) {
  return experienceLevels[educationLevel] || 'entry';
}

/**
 * Determine if candidate should get internship suggestions
 * @param {string} educationLevel - Detected education level
 * @param {string} resumeText - Raw resume text
 * @returns {boolean} Whether to suggest internships
 */
function shouldSuggestInternships(educationLevel, resumeText) {
  if (educationLevel === 'student' || educationLevel === 'highschool') {
    return true;
  }
  
  const hasExperience = resumeText && (
    resumeText.match(/\d+\s*(?:year|yr)s?\s*(?:of)?\s*experience/i) ||
    resumeText.includes('worked at') ||
    resumeText.includes('employed') ||
    resumeText.includes('job') ||
    resumeText.includes('position')
  );
  
  if (educationLevel === 'bachelors' && !hasExperience) {
    return true;
  }
  
  const experienceMatch = resumeText?.match(/(\d+)\s*(?:year|yr)s?\s*(?:of)?\s*experience/i);
  const yearsExperience = experienceMatch ? parseInt(experienceMatch[1]) : 0;
  
  return yearsExperience < 2;
}

/**
 * Extract years of experience from resume
 * @param {string} resumeText - Raw resume text
 * @returns {number} Years of experience
 */
function extractYearsOfExperience(resumeText) {
  const experienceMatch = resumeText.match(/(\d+)\s*(?:year|yr)s?\s*(?:of)?\s*experience/i);
  return experienceMatch ? parseInt(experienceMatch[1]) : 0;
}

module.exports = {
  detectEducationLevel,
  getExperienceLevel,
  shouldSuggestInternships,
  extractYearsOfExperience
};