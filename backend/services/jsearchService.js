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
    // Validate inputs
    if (!query || query.trim() === '') {
      console.log('Empty search query provided');
      return [];
    }
    
    console.log(`🔍 Searching JSearch for: ${query} (${type})`);
    
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
    
    // Check if response has data
    if (!response.data) {
      console.log('No data received from JSearch API');
      return [];
    }
    
    if (!response.data.data || !Array.isArray(response.data.data) || response.data.data.length === 0) {
      console.log(`No ${type}s found for: ${query}`);
      return [];
    }
    
    // Safely get country name
    let countryName = 'Worldwide';
    try {
      if (countryNameMap && typeof countryNameMap === 'object') {
        countryName = countryNameMap[countryCode] || countryCode || 'Worldwide';
      } else {
        countryName = countryCode || 'Worldwide';
      }
    } catch (error) {
      console.error('Error getting country name:', error.message);
      countryName = countryCode || 'Worldwide';
    }
    
    // Safely map the jobs with error handling for each job
    const results = [];
    for (let i = 0; i < Math.min(response.data.data.length, 3); i++) {
      try {
        const job = response.data.data[i];
        
        // Skip if job is null or undefined
        if (!job) continue;
        
        // Safely extract job properties
        const jobTitle = job.job_title || 'Position Available';
        const employerName = job.employer_name || "Unknown Company";
        const jobLocation = job.job_location || job.job_city || job.job_country || countryName;
        const jobDescription = job.job_description ? job.job_description.substring(0, 200) + "..." : "No description available";
        const jobPublisher = job.job_publisher || "JSearch";
        const employmentType = type === 'internship' ? 'Internship' : (job.job_employment_type || "Full-time");
        const employerLogo = job.employer_logo || null;
        const postedDate = job.job_posted_at_datetime || new Date().toISOString();
        const isRemote = job.job_is_remote || false;
        
        // Safely format salary and get apply link
        let formattedSalary = 'Not specified';
        let applyLink = '#';
        
        try {
          formattedSalary = formatSalary(job);
        } catch (salaryError) {
          console.error(`Error formatting salary for job ${i}:`, salaryError.message);
        }
        
        try {
          applyLink = getBestApplyLink(job);
        } catch (linkError) {
          console.error(`Error getting apply link for job ${i}:`, linkError.message);
        }
        
        const formattedJob = {
          title: jobTitle,
          company: employerName,
          location: jobLocation,
          salary: formattedSalary,
          description: jobDescription,
          applyLink: applyLink,
          source: jobPublisher,
          jobType: employmentType,
          logo: employerLogo,
          postedDate: postedDate,
          remote: isRemote
        };
        
        results.push(formattedJob);
      } catch (jobError) {
        console.error(`Error processing job ${i}:`, jobError.message);
        continue;
      }
    }
    
    console.log(`✅ Found ${results.length} ${type}s for "${query}"`);
    return results;
    
  } catch (error) {
    console.error(`JSearch API error for "${query}":`, error.message);
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      if (error.response.status === 403) {
        console.error('⚠️ Your RAPIDAPI key might be invalid or expired');
      }
    }
    return [];
  }
}

module.exports = { searchJSearch };