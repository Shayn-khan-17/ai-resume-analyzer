// process.noDeprecation = true;

// const express = require("express");
// const multer = require("multer");
// const fs = require("fs");
// const pdfParse = require("pdf-parse");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const axios = require('axios');

// const { queryHuggingFace } = require("./hfClient.js");

// dotenv.config();
// const app = express();
// const PORT = process.env.PORT || 5000;

// app.use(cors());
// app.use(express.json());
// const upload = multer({ dest: "uploads/" });

// // ============= QUEUE SYSTEM =============
// const requestQueue = [];
// let isProcessing = false;
// const DELAY_BETWEEN_REQUESTS = 1000;

// async function processQueue() {
//   if (isProcessing || requestQueue.length === 0) return;
  
//   isProcessing = true;
//   const { req, res, handler } = requestQueue.shift();
  
//   try {
//     console.log(`🔄 Processing request. ${requestQueue.length} remaining.`);
//     await handler(req, res);
//   } catch (error) {
//     console.error("❌ Queue error:", error);
//     if (!res.headersSent) {
//       res.status(500).json({ error: "Server error", details: error.message });
//     }
//   } finally {
//     isProcessing = false;
//     setTimeout(processQueue, DELAY_BETWEEN_REQUESTS);
//   }
// }

// function queueRequest(req, res, handler) {
//   requestQueue.push({ req, res, handler });
//   console.log(`📥 Request queued. Queue length: ${requestQueue.length}`);
//   processQueue();
// }
// // ========================================

// app.get("/ping", (req, res) => {
//   res.json({ status: "Server running with JSearch API! 🚀" });
// });

// // Test JSearch connection
// app.get("/test-jsearch", async (req, res) => {
//   try {
//     const options = {
//       method: 'GET',
//       url: 'https://jsearch.p.rapidapi.com/search',
//       params: {
//         query: 'software engineer in Pakistan',
//         page: '1',
//         num_pages: '1'
//       },
//       headers: {
//         'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
//         'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
//       }
//     };
//     const response = await axios.request(options);
//     res.json({ 
//       success: true, 
//       count: response.data.data?.length || 0,
//       jobs: response.data.data?.slice(0, 2)
//     });
//   } catch (error) {
//     res.json({ success: false, error: error.message });
//   }
// });

// // Test Hugging Face connection
// app.get("/test-hf", async (req, res) => {
//   try {
//     const response = await queryHuggingFace({
//       model: "moonshotai/Kimi-K2.5:novita",
//       messages: [{ role: "user", content: "Say hello in one word" }],
//       parameters: { max_new_tokens: 10 }
//     });
//     res.json({ success: true, response: response.choices[0].message.content });
//   } catch (error) {
//     res.json({ success: false, error: error.message });
//   }
// });

// // Helper function to detect education level
// function detectEducationLevel(resumeText) {
//   const text = resumeText.toLowerCase();
  
//   if (text.includes('phd') || text.includes('doctorate') || text.includes('doctoral') || text.includes('ph.d')) {
//     return 'phd';
//   }
  
//   if (text.includes('master') || text.includes('m.s.') || text.includes('m.sc') || text.includes('mba') || text.includes('masters')) {
//     return 'masters';
//   }
  
//   if (text.includes('bachelor') || text.includes('b.s.') || text.includes('b.sc') || text.includes('b.tech') || text.includes('bs') || text.includes('undergraduate')) {
//     return 'bachelors';
//   }
  
//   if (text.includes('high school') || text.includes('f.sc') || text.includes('fsc') || text.includes('intermediate') || text.includes('hssc')) {
//     return 'highschool';
//   }
  
//   if (text.includes('student') || text.includes('studying') || text.includes('pursuing') || (text.includes('current') && text.includes('university'))) {
//     return 'student';
//   }
  
//   return 'unknown';
// }

// // Helper function to get experience level based on education
// function getExperienceLevel(educationLevel) {
//   const levels = {
//     'phd': 'senior',
//     'masters': 'mid',
//     'bachelors': 'entry',
//     'student': 'entry',
//     'highschool': 'intern',
//     'unknown': 'entry'
//   };
//   return levels[educationLevel] || 'entry';
// }

// // Helper function to determine if candidate should get internships
// function shouldSuggestInternships(educationLevel, resumeText) {
//   if (educationLevel === 'student' || educationLevel === 'highschool') {
//     return true;
//   }
  
//   const hasExperience = resumeText && (
//     resumeText.match(/\d+\s*(?:year|yr)s?\s*(?:of)?\s*experience/i) ||
//     resumeText.includes('worked at') ||
//     resumeText.includes('employed') ||
//     resumeText.includes('job') ||
//     resumeText.includes('position')
//   );
  
//   if (educationLevel === 'bachelors' && !hasExperience) {
//     return true;
//   }
  
//   const experienceMatch = resumeText?.match(/(\d+)\s*(?:year|yr)s?\s*(?:of)?\s*experience/i);
//   const yearsExperience = experienceMatch ? parseInt(experienceMatch[1]) : 0;
  
//   return yearsExperience < 2;
// }

// // MAIN ANALYSIS ENDPOINT
// app.post("/analyze", upload.single("resume"), (req, res) => {
//   queueRequest(req, res, async (req, res) => {
//     if (!req.file) return res.status(400).json({ error: "No file uploaded" });

//     const filePath = req.file.path;

//     try {
//       const dataBuffer = fs.readFileSync(filePath);
//       const pdfData = await pdfParse(dataBuffer);
//       const resumeText = pdfData.text;

//       if (!resumeText || resumeText.trim() === "") {
//         return res.status(400).json({ error: "PDF has no readable text" });
//       }

//       const educationLevel = detectEducationLevel(resumeText);
//       const experienceLevel = getExperienceLevel(educationLevel);
      
//       console.log(`📚 Education level detected: ${educationLevel}`);
//       console.log(`💼 Experience level: ${experienceLevel}`);

//       const truncatedText = resumeText.substring(0, 2000);

//       const experienceMatch = resumeText.match(/(\d+)\s*(?:year|yr)s?\s*(?:of)?\s*experience/i);
//       const yearsExperience = experienceMatch ? parseInt(experienceMatch[1]) : 0;
      
//       const suggestInternships = shouldSuggestInternships(educationLevel, resumeText);

//       const hfRequest = {
//         model: "moonshotai/Kimi-K2.5:novita",
//         messages: [
//           {
//             role: "user",
//             content: `Analyze this resume. The candidate's education level is ${educationLevel} (${experienceLevel} level) with ${yearsExperience} years of experience.

// Based on their ACTUAL SKILLS and EXPERIENCE from the resume, suggest appropriate opportunities.

// IMPORTANT: 
// - If they are a student or have less than 2 years experience, suggest BOTH jobs and internships
// - If they have more than 2 years experience, suggest only jobs

// Resume: ${truncatedText}

// Return in this EXACT format:

// RESUME ANALYSIS:
// Skills:
// - [list each skill found in the resume]

// Experience:
// - [list each job/experience from the resume]

// Education:
// - [list each degree from the resume]

// CAREER SUGGESTIONS:
// JOB RECOMMENDATIONS:
// 1. [Job Title 1] - [Why this job matches their skills]
// 2. [Job Title 2] - [Why this job matches their skills]
// 3. [Job Title 3] - [Why this job matches their skills]

// ${suggestInternships ? `INTERNSHIP RECOMMENDATIONS:
// 1. [Internship Title 1] - [Why this matches their student status]
// 2. [Internship Title 2] - [Why this matches their student status]
// 3. [Internship Title 3] - [Why this matches their student status]` : ''}

// Only return in this format, no extra text.`
//           }
//         ],
//         parameters: { max_new_tokens: 1200, temperature: 0.1 }
//       };

//       console.log("📤 Calling Hugging Face...");
//       const hfResponse = await queryHuggingFace(hfRequest);
      
//       let fullResponse = "";
//       if (hfResponse && hfResponse.choices && hfResponse.choices.length > 0) {
//         fullResponse = hfResponse.choices[0].message.content || "";
//       }
//       console.log("✅ Received response from Hugging Face");

//       let analysis = "";
//       let jobSuggestions = "";
//       let internshipSuggestions = "";

//       const analysisMatch = fullResponse.match(/RESUME ANALYSIS:([\s\S]*?)(?=CAREER SUGGESTIONS:|$)/i);
//       if (analysisMatch) {
//         analysis = analysisMatch[1].trim();
//       }

//       const jobsMatch = fullResponse.match(/JOB RECOMMENDATIONS:([\s\S]*?)(?=INTERNSHIP RECOMMENDATIONS:|$)/i);
//       if (jobsMatch) {
//         jobSuggestions = jobsMatch[1].trim();
//       }

//       const internshipsMatch = fullResponse.match(/INTERNSHIP RECOMMENDATIONS:([\s\S]*?)(?=$)/i);
//       if (internshipsMatch) {
//         internshipSuggestions = internshipsMatch[1].trim();
//       }

//       if (!jobSuggestions) {
//         jobSuggestions = generateFallbackJobSuggestions(analysis, educationLevel);
//       }

//       if (suggestInternships && !internshipSuggestions) {
//         internshipSuggestions = generateFallbackInternshipSuggestions(analysis, educationLevel);
//       }

//       const allSuggestions = {
//         jobs: jobSuggestions,
//         internships: internshipSuggestions
//       };

//       res.json({ 
//         success: true,
//         analysis: analysis || "Analysis complete",
//         suggestions: allSuggestions,
//         educationLevel: educationLevel,
//         experienceLevel: experienceLevel,
//         shouldSuggestInternships: suggestInternships,
//         rawResponse: fullResponse
//       });
      
//     } catch (err) {
//       console.error("❌ Error:", err);
//       res.status(500).json({ 
//         error: "Failed to analyze resume", 
//         details: err.message 
//       });
//     } finally {
//       fs.unlink(filePath, (err) => {
//         if (err) console.error("Failed to delete file:", err);
//       });
//     }
//   });
// });

// // Helper function to generate fallback job suggestions
// function generateFallbackJobSuggestions(analysis, educationLevel) {
//   const skillsMatch = analysis.match(/Skills:([\s\S]*?)(?=Experience:|Education:|$)/i);
//   let skills = "";
//   if (skillsMatch) {
//     skills = skillsMatch[1];
//   }
  
//   const skillsLower = skills.toLowerCase();
  
//   let field = "general";
//   if (skillsLower.includes('civil') || skillsLower.includes('structural') || skillsLower.includes('construction')) {
//     field = "civil engineering";
//   } else if (skillsLower.includes('mechanical') || skillsLower.includes('hvac')) {
//     field = "mechanical engineering";
//   } else if (skillsLower.includes('electrical') || skillsLower.includes('circuit')) {
//     field = "electrical engineering";
//   } else if (skillsLower.includes('python') || skillsLower.includes('javascript') || skillsLower.includes('java')) {
//     field = "software development";
//   } else if (skillsLower.includes('data') || skillsLower.includes('machine learning')) {
//     field = "data science";
//   } else if (skillsLower.includes('legal') || skillsLower.includes('law')) {
//     field = "legal";
//   } else if (skillsLower.includes('medical') || skillsLower.includes('nurse')) {
//     field = "healthcare";
//   }
  
//   const level = educationLevel === 'bachelors' || educationLevel === 'student' ? 'Entry Level' : 
//                 educationLevel === 'masters' ? 'Mid-Level' : 'Senior';
  
//   if (field === "civil engineering") {
//     return `1. ${level} Civil Engineer - Based on your civil engineering skills
// 2. ${level} Structural Engineer - Matches your structural analysis experience
// 3. ${level} Construction Project Coordinator - Utilizes your construction knowledge`;
//   } else if (field === "software development") {
//     return `1. ${level} Software Developer - Based on your programming skills
// 2. ${level} Web Developer - Utilizes your frontend/backend experience
// 3. Junior Application Developer - Matches your coding abilities`;
//   } else if (field === "data science") {
//     return `1. ${level} Data Analyst - Based on your data analysis skills
// 2. ${level} Machine Learning Engineer - Utilizes your ML knowledge
// 3. Business Intelligence Analyst - Matches your analytical abilities`;
//   } else if (field === "mechanical engineering") {
//     return `1. ${level} Mechanical Engineer - Based on your mechanical skills
// 2. ${level} HVAC Engineer - Utilizes your thermal systems knowledge
// 3. Manufacturing Engineer - Matches your production experience`;
//   } else if (field === "electrical engineering") {
//     return `1. ${level} Electrical Engineer - Based on your electrical skills
// 2. ${level} Electronics Engineer - Utilizes your circuit design knowledge
// 3. Power Systems Engineer - Matches your power distribution experience`;
//   } else if (field === "legal") {
//     return `1. ${level} Paralegal - Based on your legal research skills
// 2. ${level} Legal Assistant - Utilizes your documentation abilities
// 3. Junior Associate - Matches your legal knowledge`;
//   } else {
//     return `1. ${level} Professional - Based on your skills and experience
// 2. Junior Associate - Entry level position matching your qualifications
// 3. Graduate Trainee - Development program for new graduates`;
//   }
// }

// // Helper function to generate fallback internship suggestions
// function generateFallbackInternshipSuggestions(analysis, educationLevel) {
//   const skillsMatch = analysis.match(/Skills:([\s\S]*?)(?=Experience:|Education:|$)/i);
//   let skills = "";
//   if (skillsMatch) {
//     skills = skillsMatch[1];
//   }
  
//   const skillsLower = skills.toLowerCase();
  
//   let field = "general";
//   if (skillsLower.includes('civil') || skillsLower.includes('structural') || skillsLower.includes('construction')) {
//     field = "civil engineering";
//   } else if (skillsLower.includes('mechanical') || skillsLower.includes('hvac')) {
//     field = "mechanical engineering";
//   } else if (skillsLower.includes('electrical') || skillsLower.includes('circuit')) {
//     field = "electrical engineering";
//   } else if (skillsLower.includes('python') || skillsLower.includes('javascript') || skillsLower.includes('java')) {
//     field = "software development";
//   } else if (skillsLower.includes('data') || skillsLower.includes('machine learning')) {
//     field = "data science";
//   } else if (skillsLower.includes('legal') || skillsLower.includes('law')) {
//     field = "legal";
//   } else if (skillsLower.includes('medical') || skillsLower.includes('nurse')) {
//     field = "healthcare";
//   }
  
//   if (field === "civil engineering") {
//     return `1. Civil Engineering Intern - Hands-on experience with structural analysis
// 2. Construction Project Intern - Learn project management in construction
// 3. Site Engineering Intern - Field experience with civil projects`;
//   } else if (field === "software development") {
//     return `1. Software Development Intern - Build real applications with mentorship
// 2. Web Development Intern - Create websites using modern frameworks
// 3. QA Testing Intern - Learn quality assurance processes`;
//   } else if (field === "data science") {
//     return `1. Data Science Intern - Work with real datasets and ML models
// 2. Business Intelligence Intern - Learn data visualization and reporting
// 3. Analytics Intern - Gain experience with data analysis tools`;
//   } else if (field === "mechanical engineering") {
//     return `1. Mechanical Engineering Intern - Hands-on with CAD and design
// 2. HVAC Intern - Learn thermal systems design
// 3. Manufacturing Intern - Experience with production processes`;
//   } else if (field === "electrical engineering") {
//     return `1. Electrical Engineering Intern - Work with circuit design
// 2. Electronics Intern - Learn embedded systems
// 3. Power Systems Intern - Experience with electrical distribution`;
//   } else if (field === "legal") {
//     return `1. Legal Intern - Assist with research and documentation
// 2. Paralegal Intern - Learn legal procedures
// 3. Law Firm Intern - Experience with client cases`;
//   } else {
//     return `1. General Internship - Gain professional experience
// 2. Business Intern - Learn corporate operations
// 3. Administrative Intern - Develop office skills`;
//   }
// }

// // Helper function to extract job titles from suggestions
// function extractJobTitlesFromSuggestions(suggestions, educationLevel, isInternship = false) {
//   if (!suggestions) return [];
  
//   const lines = suggestions.split('\n');
//   const titles = [];
  
//   lines.forEach(line => {
//     const match = line.match(/^\d+\.\s*(.+?)(?:\s*-|$)/);
//     if (match) {
//       let title = match[1].trim();
      
//       if (!isInternship) {
//         if (educationLevel === 'bachelors' || educationLevel === 'student') {
//           if (!title.toLowerCase().includes('junior') && !title.toLowerCase().includes('entry')) {
//             titles.push(`Junior ${title}`);
//             titles.push(`Entry Level ${title}`);
//           }
//         } else if (educationLevel === 'masters') {
//           if (!title.toLowerCase().includes('senior')) {
//             titles.push(`Senior ${title}`);
//           }
//         }
//       }
//       titles.push(title);
//     }
//   });
  
//   return [...new Set(titles)];
// }

// // IMPROVED: Fetch opportunities endpoint with better search logic
// app.post("/fetch-opportunities", async (req, res) => {
//   try {
//     const { jobTitles, internshipTitles, profileType, educationLevel = 'bachelors', country = 'us' } = req.body;
    
//     console.log("🔍 Fetching opportunities from JSearch for:", { jobTitles, internshipTitles, profileType, educationLevel, country });
    
//     let allOpportunities = {
//       jobs: [],
//       internships: []
//     };

//     // Generate search titles - with better cleaning
//     let searchJobTitles = [];
//     let searchInternshipTitles = [];
    
//     if (jobTitles && jobTitles.length > 0) {
//       searchJobTitles = jobTitles.map(title => {
//         let cleanTitle = title.replace(/^\d+\.\s*/, '').trim();
//         cleanTitle = cleanTitle.split('-')[0].trim();
//         cleanTitle = cleanTitle.replace(/^(Entry Level|Junior|Senior|Lead|Principal)\s+/i, '');
//         return cleanTitle;
//       }).filter(t => t.length > 3);
//     }
    
//     if (searchJobTitles.length === 0) {
//       searchJobTitles = ['Software Engineer', 'Developer', 'Engineer', 'Data Analyst', 'Project Manager'];
//     }
    
//     if (internshipTitles && internshipTitles.length > 0) {
//       searchInternshipTitles = internshipTitles.map(title => {
//         let cleanTitle = title.replace(/^\d+\.\s*/, '').trim();
//         cleanTitle = cleanTitle.split('-')[0].trim();
//         return cleanTitle;
//       }).filter(t => t.length > 3);
//     } else {
//       searchInternshipTitles = ['Intern', 'Internship', 'Trainee'];
//     }

//     const countryNameMap = {
//       'us': 'United States',
//       'gb': 'United Kingdom',
//       'ca': 'Canada',
//       'au': 'Australia',
//       'de': 'Germany',
//       'fr': 'France',
//       'nl': 'Netherlands',
//       'es': 'Spain',
//       'it': 'Italy',
//       'ie': 'Ireland',
//       'in': 'India',
//       'pk': 'Pakistan',
//       'ae': 'UAE',
//       'sa': 'Saudi Arabia',
//       'za': 'South Africa',
//       'br': 'Brazil',
//       'ar': 'Argentina',
//       'mx': 'Mexico',
//       'jp': 'Japan',
//       'kr': 'South Korea',
//       'nz': 'New Zealand',
//       'sg': 'Singapore'
//     };

//     const countryName = countryNameMap[country] || country;

//     async function searchOpportunities(titles, type) {
//       const opportunities = [];
      
//       if (!titles || titles.length === 0) return opportunities;
      
//       for (const title of titles.slice(0, 3)) {
//         try {
//           const cleanTitle = title.trim();
          
//           // Try multiple search variations
//           const searchVariations = [
//             `${cleanTitle} in ${countryName}`,
//             `${cleanTitle} ${countryName}`,
//             cleanTitle
//           ];
          
//           for (const searchQuery of searchVariations) {
//             console.log(`📡 Searching JSearch for ${type}: ${searchQuery}`);
            
//             const options = {
//               method: 'GET',
//               url: 'https://jsearch.p.rapidapi.com/search',
//               params: {
//                 query: searchQuery,
//                 page: '1',
//                 num_pages: '1',
//                 date_posted: 'month'
//               },
//               headers: {
//                 'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
//                 'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
//               }
//             };

//             const response = await axios.request(options);
            
//             if (response.data.data && response.data.data.length > 0) {
//               console.log(`✅ Found ${response.data.data.length} jobs for "${searchQuery}"`);
              
//               const processed = response.data.data.slice(0, 3).map(job => {
//                 let applyLink = job.job_apply_link;
//                 if (job.apply_options && job.apply_options.length > 0) {
//                   const directOption = job.apply_options.find(opt => opt.is_direct);
//                   applyLink = directOption ? directOption.apply_link : job.apply_options[0].apply_link;
//                 }
                
//                 let salary = "Not specified";
//                 if (job.job_min_salary && job.job_max_salary) {
//                   salary = `$${job.job_min_salary} - $${job.job_max_salary}`;
//                 } else if (job.job_salary) {
//                   salary = job.job_salary;
//                 }
                
//                 return {
//                   title: job.job_title || title,
//                   company: job.employer_name || "Unknown Company",
//                   location: job.job_location || job.job_city || job.job_country || countryName,
//                   salary: salary,
//                   description: job.job_description ? job.job_description.substring(0, 200) + "..." : "No description available",
//                   applyLink: applyLink || '#',
//                   source: job.job_publisher || "JSearch",
//                   jobType: type === 'internship' ? 'Internship' : (job.job_employment_type || "Full-time"),
//                   logo: job.employer_logo || null,
//                   postedDate: job.job_posted_at_datetime || new Date().toISOString(),
//                   remote: job.job_is_remote || false
//                 };
//               });
//               opportunities.push(...processed);
//               break; // Found jobs for this title, move to next
//             }
//           }
          
//           await new Promise(resolve => setTimeout(resolve, 500));
          
//         } catch (error) {
//           console.error(`Error searching for ${title}:`, error.message);
//         }
//       }
      
//       return opportunities;
//     }

//     const [jobResults, internshipResults] = await Promise.all([
//       searchOpportunities(searchJobTitles, 'job'),
//       searchOpportunities(searchInternshipTitles, 'internship')
//     ]);

//     allOpportunities.jobs = jobResults;
//     allOpportunities.internships = internshipResults;

//     console.log(`✅ Found ${jobResults.length} jobs and ${internshipResults.length} internships`);

//     res.json({ 
//       success: true, 
//       opportunities: allOpportunities,
//       educationLevel: educationLevel,
//       country: country
//     });
    
//   } catch (error) {
//     console.error("❌ Error fetching opportunities:", error);
//     res.json({ 
//       success: true, 
//       opportunities: {
//         jobs: [],
//         internships: []
//       }
//     });
//   }
// });

// app.listen(PORT, () => console.log(`🚀 Server on port ${PORT} with JSearch API`));


process.noDeprecation = true;

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const apiRoutes = require("./routes/apiRoutes");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Use API routes
app.use("/", apiRoutes);

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT} with JSearch API`));