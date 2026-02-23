const axios = require('axios');
const { countryNameMap } = require('../config/constants');
const { formatSalary, getBestApplyLink } = require('../utils/helpers');

/**
 * Search for jobs using JSearch API
 * @param {string} query - Search query
 * @param {string} type - 'job' or 'internship'
 * @param {string} countryCode - Country code
 * @returns {Promise<Array>} Array of job objects
 */
async function searchJSearch(query, type, countryCode) {
  try {
    const options = {
      method: 'GET',
      url: 'https://jsearch.p.rapidapi.com/search',
      params: {
        query: query,
        page: '1',
        num_pages: '1',
        date_posted: 'month'
      },
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
      }
    };

    const response = await axios.request(options);
    
    if (!response.data.data || response.data.data.length === 0) {
      return [];
    }
    
    const countryName = countryNameMap[countryCode] || countryCode;
    
    return response.data.data.slice(0, 3).map(job => ({
      title: job.job_title,
      company: job.employer_name || "Unknown Company",
      location: job.job_location || job.job_city || job.job_country || countryName,
      salary: formatSalary(job),
      description: job.job_description ? job.job_description.substring(0, 200) + "..." : "No description available",
      applyLink: getBestApplyLink(job),
      source: job.job_publisher || "JSearch",
      jobType: type === 'internship' ? 'Internship' : (job.job_employment_type || "Full-time"),
      logo: job.employer_logo || null,
      postedDate: job.job_posted_at_datetime || new Date().toISOString(),
      remote: job.job_is_remote || false
    }));
  } catch (error) {
    console.error(`JSearch API error: ${error.message}`);
    return [];
  }
}

module.exports = { searchJSearch };