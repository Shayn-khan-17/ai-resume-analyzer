const { searchJSearch } = require("../services/jsearchService");
const { 
  extractJobTitlesFromSuggestions, 
  cleanJobTitle 
} = require("../utils/helpers");
const { defaultJobTitles, countryNameMap } = require("../config/constants");

/**
 * Controller for fetching jobs
 */
async function fetchJobsController(req, res) {
  try {
    const { jobTitles, internshipTitles, profileType, educationLevel = 'bachelors', country = 'us' } = req.body;
    
    console.log("🔍 Fetching opportunities from JSearch for:", { 
      jobTitles, 
      internshipTitles, 
      profileType, 
      educationLevel, 
      country 
    });
    
    let allOpportunities = {
      jobs: [],
      internships: []
    };

    // Generate search titles
    let searchJobTitles = [];
    let searchInternshipTitles = [];
    
    if (jobTitles && jobTitles.length > 0) {
      searchJobTitles = jobTitles.map(cleanJobTitle).filter(t => t.length > 3);
    }
    
    if (searchJobTitles.length === 0) {
      searchJobTitles = defaultJobTitles.general;
    }
    
    if (internshipTitles && internshipTitles.length > 0) {
      searchInternshipTitles = internshipTitles.map(cleanJobTitle).filter(t => t.length > 3);
    } else {
      searchInternshipTitles = defaultJobTitles.internships;
    }

    async function searchOpportunities(titles, type) {
      const opportunities = [];
      
      if (!titles || titles.length === 0) return opportunities;
      
      for (const title of titles.slice(0, 3)) {
        try {
          const cleanTitle = title.trim();
          
          // Try multiple search variations
          const searchVariations = [
            `${cleanTitle} in ${countryNameMap[country] || country}`,
            `${cleanTitle} ${countryNameMap[country] || country}`,
            cleanTitle
          ];
          
          for (const searchQuery of searchVariations) {
            console.log(`📡 Searching JSearch for ${type}: ${searchQuery}`);
            
            const results = await searchJSearch(searchQuery, type, country);
            
            if (results.length > 0) {
              console.log(`✅ Found ${results.length} jobs for "${searchQuery}"`);
              opportunities.push(...results);
              break; // Found jobs, move to next title
            }
          }
          
          // Small delay to avoid rate limits
          await new Promise(resolve => setTimeout(resolve, 500));
          
        } catch (error) {
          console.error(`Error searching for ${title}:`, error.message);
        }
      }
      
      return opportunities;
    }

    const [jobResults, internshipResults] = await Promise.all([
      searchOpportunities(searchJobTitles, 'job'),
      searchOpportunities(searchInternshipTitles, 'internship')
    ]);

    allOpportunities.jobs = jobResults;
    allOpportunities.internships = internshipResults;

    console.log(`✅ Found ${jobResults.length} jobs and ${internshipResults.length} internships`);

    res.json({ 
      success: true, 
      opportunities: allOpportunities,
      educationLevel: educationLevel,
      country: country
    });
    
  } catch (error) {
    console.error("❌ Error fetching opportunities:", error);
    res.json({ 
      success: true, 
      opportunities: {
        jobs: [],
        internships: []
      }
    });
  }
}

module.exports = { fetchJobsController };