/**
 * Extract job titles from suggestions text
 * @param {string} suggestions - Raw suggestions text
 * @param {string} educationLevel - Detected education level
 * @param {boolean} isInternship - Whether extracting internship titles
 * @returns {string[]} Array of job titles
 */
function extractJobTitlesFromSuggestions(suggestions, educationLevel, isInternship = false) {
  if (!suggestions) return [];
  
  const lines = suggestions.split('\n');
  const titles = [];
  
  lines.forEach(line => {
    const match = line.match(/^\d+\.\s*(.+?)(?:\s*-|$)/);
    if (match) {
      let title = match[1].trim();
      
      if (!isInternship) {
        if (educationLevel === 'bachelors' || educationLevel === 'student') {
          if (!title.toLowerCase().includes('junior') && !title.toLowerCase().includes('entry')) {
            titles.push(`Junior ${title}`);
            titles.push(`Entry Level ${title}`);
          }
        } else if (educationLevel === 'masters') {
          if (!title.toLowerCase().includes('senior')) {
            titles.push(`Senior ${title}`);
          }
        }
      }
      titles.push(title);
    }
  });
  
  return [...new Set(titles)];
}

/**
 * Clean job title for search
 * @param {string} title - Raw job title
 * @returns {string} Cleaned title
 */
function cleanJobTitle(title) {
  let cleanTitle = title.replace(/^\d+\.\s*/, '').trim();
  cleanTitle = cleanTitle.split('-')[0].trim();
  cleanTitle = cleanTitle.replace(/^(Entry Level|Junior|Senior|Lead|Principal)\s+/i, '');
  return cleanTitle;
}

/**
 * Format salary for display
 * @param {Object} job - Job object from API
 * @returns {string} Formatted salary
 */
function formatSalary(job) {
  if (job.job_min_salary && job.job_max_salary) {
    return `$${job.job_min_salary} - $${job.job_max_salary}`;
  } else if (job.job_salary) {
    return job.job_salary;
  }
  return "Not specified";
}

/**
 * Get best apply link from job options
 * @param {Object} job - Job object from API
 * @returns {string} Best apply link
 */
function getBestApplyLink(job) {
  let applyLink = job.job_apply_link;
  if (job.apply_options && job.apply_options.length > 0) {
    const directOption = job.apply_options.find(opt => opt.is_direct);
    applyLink = directOption ? directOption.apply_link : job.apply_options[0].apply_link;
  }
  return applyLink || '#';
}

module.exports = {
  extractJobTitlesFromSuggestions,
  cleanJobTitle,
  formatSalary,
  getBestApplyLink
};