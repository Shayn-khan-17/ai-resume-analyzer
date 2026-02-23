/**
 * Generate fallback job suggestions based on skills
 * @param {string} analysis - Resume analysis text
 * @param {string} educationLevel - Detected education level
 * @returns {string} Formatted job suggestions
 */
function generateFallbackJobSuggestions(analysis, educationLevel) {
  const skillsMatch = analysis.match(/Skills:([\s\S]*?)(?=Experience:|Education:|$)/i);
  let skills = "";
  if (skillsMatch) {
    skills = skillsMatch[1];
  }
  
  const skillsLower = skills.toLowerCase();
  
  let field = "general";
  if (skillsLower.includes('civil') || skillsLower.includes('structural') || skillsLower.includes('construction')) {
    field = "civil engineering";
  } else if (skillsLower.includes('mechanical') || skillsLower.includes('hvac')) {
    field = "mechanical engineering";
  } else if (skillsLower.includes('electrical') || skillsLower.includes('circuit')) {
    field = "electrical engineering";
  } else if (skillsLower.includes('python') || skillsLower.includes('javascript') || skillsLower.includes('java')) {
    field = "software development";
  } else if (skillsLower.includes('data') || skillsLower.includes('machine learning')) {
    field = "data science";
  } else if (skillsLower.includes('legal') || skillsLower.includes('law')) {
    field = "legal";
  } else if (skillsLower.includes('medical') || skillsLower.includes('nurse')) {
    field = "healthcare";
  }
  
  const level = educationLevel === 'bachelors' || educationLevel === 'student' ? 'Entry Level' : 
                educationLevel === 'masters' ? 'Mid-Level' : 'Senior';
  
  const suggestions = {
    "civil engineering": `1. ${level} Civil Engineer - Based on your civil engineering skills\n2. ${level} Structural Engineer - Matches your structural analysis experience\n3. ${level} Construction Project Coordinator - Utilizes your construction knowledge`,
    "software development": `1. ${level} Software Developer - Based on your programming skills\n2. ${level} Web Developer - Utilizes your frontend/backend experience\n3. Junior Application Developer - Matches your coding abilities`,
    "data science": `1. ${level} Data Analyst - Based on your data analysis skills\n2. ${level} Machine Learning Engineer - Utilizes your ML knowledge\n3. Business Intelligence Analyst - Matches your analytical abilities`,
    "mechanical engineering": `1. ${level} Mechanical Engineer - Based on your mechanical skills\n2. ${level} HVAC Engineer - Utilizes your thermal systems knowledge\n3. Manufacturing Engineer - Matches your production experience`,
    "electrical engineering": `1. ${level} Electrical Engineer - Based on your electrical skills\n2. ${level} Electronics Engineer - Utilizes your circuit design knowledge\n3. Power Systems Engineer - Matches your power distribution experience`,
    "legal": `1. ${level} Paralegal - Based on your legal research skills\n2. ${level} Legal Assistant - Utilizes your documentation abilities\n3. Junior Associate - Matches your legal knowledge`
  };
  
  return suggestions[field] || `1. ${level} Professional - Based on your skills and experience\n2. Junior Associate - Entry level position matching your qualifications\n3. Graduate Trainee - Development program for new graduates`;
}

/**
 * Generate fallback internship suggestions
 * @param {string} analysis - Resume analysis text
 * @param {string} educationLevel - Detected education level
 * @returns {string} Formatted internship suggestions
 */
function generateFallbackInternshipSuggestions(analysis, educationLevel) {
  const skillsMatch = analysis.match(/Skills:([\s\S]*?)(?=Experience:|Education:|$)/i);
  let skills = "";
  if (skillsMatch) {
    skills = skillsMatch[1];
  }
  
  const skillsLower = skills.toLowerCase();
  
  let field = "general";
  if (skillsLower.includes('civil') || skillsLower.includes('structural') || skillsLower.includes('construction')) {
    field = "civil engineering";
  } else if (skillsLower.includes('mechanical') || skillsLower.includes('hvac')) {
    field = "mechanical engineering";
  } else if (skillsLower.includes('electrical') || skillsLower.includes('circuit')) {
    field = "electrical engineering";
  } else if (skillsLower.includes('python') || skillsLower.includes('javascript') || skillsLower.includes('java')) {
    field = "software development";
  } else if (skillsLower.includes('data') || skillsLower.includes('machine learning')) {
    field = "data science";
  } else if (skillsLower.includes('legal') || skillsLower.includes('law')) {
    field = "legal";
  } else if (skillsLower.includes('medical') || skillsLower.includes('nurse')) {
    field = "healthcare";
  }
  
  const suggestions = {
    "civil engineering": `1. Civil Engineering Intern - Hands-on experience with structural analysis\n2. Construction Project Intern - Learn project management in construction\n3. Site Engineering Intern - Field experience with civil projects`,
    "software development": `1. Software Development Intern - Build real applications with mentorship\n2. Web Development Intern - Create websites using modern frameworks\n3. QA Testing Intern - Learn quality assurance processes`,
    "data science": `1. Data Science Intern - Work with real datasets and ML models\n2. Business Intelligence Intern - Learn data visualization and reporting\n3. Analytics Intern - Gain experience with data analysis tools`,
    "mechanical engineering": `1. Mechanical Engineering Intern - Hands-on with CAD and design\n2. HVAC Intern - Learn thermal systems design\n3. Manufacturing Intern - Experience with production processes`,
    "electrical engineering": `1. Electrical Engineering Intern - Work with circuit design\n2. Electronics Intern - Learn embedded systems\n3. Power Systems Intern - Experience with electrical distribution`,
    "legal": `1. Legal Intern - Assist with research and documentation\n2. Paralegal Intern - Learn legal procedures\n3. Law Firm Intern - Experience with client cases`
  };
  
  return suggestions[field] || `1. General Internship - Gain professional experience\n2. Business Intern - Learn corporate operations\n3. Administrative Intern - Develop office skills`;
}

module.exports = {
  generateFallbackJobSuggestions,
  generateFallbackInternshipSuggestions
};