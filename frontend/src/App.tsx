// import { useState, useEffect } from "react";
// import axios from "axios";
// import "./App.css";

// function App() {
//   const [file, setFile] = useState<File | null>(null);
//   const [analysis, setAnalysis] = useState<string>("");
//   const [jobSuggestions, setJobSuggestions] = useState<string>("");
//   const [internshipSuggestions, setInternshipSuggestions] = useState<string>("");
//   const [jobs, setJobs] = useState<any[]>([]);
//   const [filteredJobs, setFilteredJobs] = useState<any[]>([]);
//   const [internships, setInternships] = useState<any[]>([]);
//   const [filteredInternships, setFilteredInternships] = useState<any[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [opportunityLoading, setOpportunityLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string>("");
//   const [fileName, setFileName] = useState<string>("");
//   const [activeTab, setActiveTab] = useState<string>("analysis");
  
//   // Country selection state
//   const [selectedCountries, setSelectedCountries] = useState<string[]>(["us"]);
//   const [showCountrySelector, setShowCountrySelector] = useState<boolean>(false);
  
//   // Filter states
//   const [jobFilter, setJobFilter] = useState<string>("all");
//   const [internshipFilter, setInternshipFilter] = useState<string>("all");
//   const [showJobFilters, setShowJobFilters] = useState<boolean>(false);
//   const [showInternshipFilters, setShowInternshipFilters] = useState<boolean>(false);

//   // Store job titles for refetching when countries change
//   const [storedJobTitles, setStoredJobTitles] = useState<string[]>([]);
//   const [storedInternshipTitles, setStoredInternshipTitles] = useState<string[]>([]);
//   const [storedProfileType, setStoredProfileType] = useState<string>("general");

//   // Define your exact countries list
//   const countriesList = [
//     { code: 'us', name: 'United States' },
//     { code: 'ca', name: 'Canada' },
//     { code: 'mx', name: 'Mexico' },
//     { code: 'gb', name: 'United Kingdom' },
//     { code: 'de', name: 'Germany' },
//     { code: 'fr', name: 'France' },
//     { code: 'nl', name: 'Netherlands' },
//     { code: 'es', name: 'Spain' },
//     { code: 'it', name: 'Italy' },
//     { code: 'ie', name: 'Ireland' },
//     { code: 'au', name: 'Australia' },
//     { code: 'nz', name: 'New Zealand' },
//     { code: 'sg', name: 'Singapore' },
//     { code: 'jp', name: 'Japan' },
//     { code: 'kr', name: 'South Korea' },
//     { code: 'in', name: 'India' },
//     { code: 'pk', name: 'Pakistan' },
//     { code: 'ae', name: 'UAE' },
//     { code: 'sa', name: 'Saudi Arabia' },
//     { code: 'za', name: 'South Africa' },
//     { code: 'br', name: 'Brazil' },
//     { code: 'ar', name: 'Argentina' }
//   ];

//   const countriesByRegion = {
//     'North America': countriesList.slice(0, 3),
//     'Europe': countriesList.slice(3, 10),
//     'Asia Pacific': countriesList.slice(10, 15),
//     'South Asia': countriesList.slice(15, 17),
//     'Middle East': countriesList.slice(17, 19),
//     'Africa': countriesList.slice(19, 20),
//     'South America': countriesList.slice(20, 22)
//   };

//   const handleCountryChange = (countryCode: string) => {
//     setSelectedCountries(prev => {
//       if (prev.includes(countryCode)) {
//         if (prev.length > 1) {
//           return prev.filter(c => c !== countryCode);
//         }
//         return prev;
//       } else {
//         if (prev.length < 3) {
//           return [...prev, countryCode];
//         }
//         return prev;
//       }
//     });
//   };

//   const selectAllRegion = (regionCountries: any[]) => {
//     const regionCodes = regionCountries.map(c => c.code);
//     setSelectedCountries(prev => {
//       const newSelection = [...prev];
//       regionCodes.forEach(code => {
//         if (!newSelection.includes(code) && newSelection.length < 3) {
//           newSelection.push(code);
//         }
//       });
//       return newSelection.slice(0, 3);
//     });
//   };

//   useEffect(() => {
//     applyJobFilter();
//   }, [jobs, jobFilter]);

//   useEffect(() => {
//     applyInternshipFilter();
//   }, [internships, internshipFilter]);

//   const applyJobFilter = () => {
//     if (jobFilter === "all") {
//       setFilteredJobs(jobs);
//     } else {
//       const filtered = jobs.filter(job => {
//         const location = job.location?.toLowerCase() || "";
//         if (jobFilter === "remote") return location.includes("remote");
//         if (jobFilter === "onsite") return !location.includes("remote") && !location.includes("hybrid");
//         if (jobFilter === "hybrid") return location.includes("hybrid");
//         return true;
//       });
//       setFilteredJobs(filtered);
//     }
//   };

//   const applyInternshipFilter = () => {
//     if (internshipFilter === "all") {
//       setFilteredInternships(internships);
//     } else {
//       const filtered = internships.filter(internship => {
//         const location = internship.location?.toLowerCase() || "";
//         if (internshipFilter === "remote") return location.includes("remote");
//         if (internshipFilter === "onsite") return !location.includes("remote") && !location.includes("hybrid");
//         if (internshipFilter === "hybrid") return location.includes("hybrid");
//         return true;
//       });
//       setFilteredInternships(filtered);
//     }
//   };

//   const handleFilterChange = (type: string, filterValue: string) => {
//     if (type === 'job') {
//       setJobFilter(filterValue);
//     } else {
//       setInternshipFilter(filterValue);
//     }
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       const selectedFile = e.target.files[0];
//       if (selectedFile.type !== "application/pdf") {
//         setError("Please select a PDF file");
//         setFile(null);
//         setFileName("");
//         return;
//       }
      
//       setFile(selectedFile);
//       setFileName(selectedFile.name);
//       setError("");
//       setAnalysis("");
//       setJobSuggestions("");
//       setInternshipSuggestions("");
//       setJobs([]);
//       setFilteredJobs([]);
//       setInternships([]);
//       setFilteredInternships([]);
//       setJobFilter("all");
//       setInternshipFilter("all");
//       setStoredJobTitles([]);
//       setStoredInternshipTitles([]);
//     }
//   };

//   const extractJobTitles = (suggestions: string): string[] => {
//     if (!suggestions) return [];
//     const lines = suggestions.split('\n');
//     return lines
//       .filter(line => line.match(/^\d+\./))
//       .map(line => {
//         const titlePart = line.replace(/^\d+\.\s*/, '').split('-')[0].trim();
//         return titlePart;
//       });
//   };

//   const detectProfileType = (analysis: string): string => {
//     const lowerAnalysis = analysis.toLowerCase();
//     if (lowerAnalysis.includes('legal') || lowerAnalysis.includes('law') || lowerAnalysis.includes('attorney')) {
//       return 'legal';
//     }
//     if (lowerAnalysis.includes('medical') || lowerAnalysis.includes('nurse') || lowerAnalysis.includes('doctor')) {
//       return 'medical';
//     }
//     if (lowerAnalysis.includes('teacher') || lowerAnalysis.includes('education')) {
//       return 'education';
//     }
//     return 'general';
//   };

//   const handleUpload = async () => {
//     if (!file) {
//       setError("Please select a PDF file!");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("resume", file);

//     try {
//       setLoading(true);
//       setError("");

//       const res = await axios.post("http://localhost:5000/analyze", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       console.log("Analysis response:", res.data);
      
//       setAnalysis(res.data.analysis || "No analysis available");
      
//       if (res.data.suggestions) {
//         setJobSuggestions(res.data.suggestions.jobs || "");
//         setInternshipSuggestions(res.data.suggestions.internships || "");
        
//         const extractedJobTitles = extractJobTitles(res.data.suggestions.jobs || "");
//         const extractedInternshipTitles = extractJobTitles(res.data.suggestions.internships || "");
//         const profileType = detectProfileType(res.data.analysis || "");
        
//         setStoredJobTitles(extractedJobTitles);
//         setStoredInternshipTitles(extractedInternshipTitles);
//         setStoredProfileType(profileType);
        
//         setShowCountrySelector(true);
//       }
      
//     } catch (err: any) {
//       console.error("Upload error:", err);
//       setError(err.response?.data?.error || "Failed to connect to server");
//       setAnalysis("");
//       setJobSuggestions("");
//       setInternshipSuggestions("");
//       setJobs([]);
//       setFilteredJobs([]);
//       setInternships([]);
//       setFilteredInternships([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchOpportunities = async () => {
//     if (selectedCountries.length === 0) {
//       setError("Please select at least one country");
//       return;
//     }

//     if (storedJobTitles.length === 0 && storedInternshipTitles.length === 0) {
//       setError("No job titles available. Please upload a resume first.");
//       return;
//     }

//     try {
//       setOpportunityLoading(true);
//       setJobs([]);
//       setInternships([]);
      
//       console.log("🔍 Fetching jobs for countries:", selectedCountries);
      
//       const countryPromises = selectedCountries.map(countryCode => 
//         axios.post("http://localhost:5000/fetch-opportunities", {
//           jobTitles: storedJobTitles,
//           internshipTitles: storedInternshipTitles,
//           profileType: storedProfileType,
//           country: countryCode
//         })
//       );
      
//       const responses = await Promise.all(countryPromises);
      
//       let allJobs: any[] = [];
//       let allInternships: any[] = [];
      
//       responses.forEach((response) => {
//         if (response.data.success) {
//           const countryJobs = response.data.opportunities.jobs || [];
//           const countryInternships = response.data.opportunities.internships || [];
          
//           allJobs = [...allJobs, ...countryJobs];
//           allInternships = [...allInternships, ...countryInternships];
//         }
//       });
      
//       const uniqueJobs = Array.from(
//         new Map(allJobs.map(job => [job.title + job.company, job])).values()
//       );
      
//       const uniqueInternships = Array.from(
//         new Map(allInternships.map(internship => [internship.title + internship.company, internship])).values()
//       );
      
//       setJobs(uniqueJobs);
//       setInternships(uniqueInternships);
      
//       if (uniqueJobs.length > 0) {
//         setActiveTab("jobs");
//       } else if (uniqueInternships.length > 0) {
//         setActiveTab("internships");
//       }
      
//     } catch (error) {
//       console.error("Error fetching opportunities:", error);
//     } finally {
//       setOpportunityLoading(false);
//     }
//   };

//   const handleDragOver = (e: React.DragEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//   };

//   const handleDrop = (e: React.DragEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
    
//     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//       const droppedFile = e.dataTransfer.files[0];
//       if (droppedFile.type === "application/pdf") {
//         setFile(droppedFile);
//         setFileName(droppedFile.name);
//         setError("");
//       } else {
//         setError("Please drop a PDF file");
//       }
//     }
//   };

//   const toggleJobFilters = () => {
//     setShowJobFilters(!showJobFilters);
//   };

//   const toggleInternshipFilters = () => {
//     setShowInternshipFilters(!showInternshipFilters);
//   };

//   const renderFilterBar = (type: string, count: number) => {
//     const isJob = type === 'job';
//     const showFilters = isJob ? showJobFilters : showInternshipFilters;
//     const currentFilter = isJob ? jobFilter : internshipFilter;
    
//     return (
//       <div className="modern-filter-bar">
//         <div className="modern-filter-header" onClick={isJob ? toggleJobFilters : toggleInternshipFilters}>
//           <span className="modern-filter-title">
//             <span className="filter-icon">🔍</span> Filter {isJob ? 'Jobs' : 'Internships'}
//           </span>
//           <span className="modern-filter-count">{count} available</span>
//           <span className="modern-arrow">{showFilters ? '▼' : '▶'}</span>
//         </div>
        
//         {showFilters && (
//           <div className="modern-filter-options">
//             <button 
//               className={`modern-filter-btn ${currentFilter === 'all' ? 'active' : ''}`}
//               onClick={() => handleFilterChange(type, 'all')}
//             >
//               All
//             </button>
//             <button 
//               className={`modern-filter-btn ${currentFilter === 'remote' ? 'active' : ''}`}
//               onClick={() => handleFilterChange(type, 'remote')}
//             >
//               🏠 Remote
//             </button>
//             <button 
//               className={`modern-filter-btn ${currentFilter === 'onsite' ? 'active' : ''}`}
//               onClick={() => handleFilterChange(type, 'onsite')}
//             >
//               🏢 On-site
//             </button>
//             <button 
//               className={`modern-filter-btn ${currentFilter === 'hybrid' ? 'active' : ''}`}
//               onClick={() => handleFilterChange(type, 'hybrid')}
//             >
//               🔄 Hybrid
//             </button>
//           </div>
//         )}
//       </div>
//     );
//   };

//   const renderCountrySelector = () => (
//     <div className="modern-country-selector">
//       <div className="modern-country-header" onClick={() => setShowCountrySelector(!showCountrySelector)}>
//         <span className="modern-country-title">
//           <span className="modern-country-icon">🌍</span>
//           Select Countries to Search
//         </span>
//         <span className="modern-selected-badge">
//           {selectedCountries.length} selected
//         </span>
//         <span className="modern-arrow">{showCountrySelector ? '▼' : '▶'}</span>
//       </div>
      
//       {showCountrySelector && (
//         <div className="modern-country-options">
//           <p className="modern-country-note">Select up to 3 countries (to avoid rate limits)</p>
          
//           {Object.entries(countriesByRegion).map(([region, regionCountries]) => (
//             <div key={region} className="modern-region">
//               <div className="modern-region-header">
//                 <strong>{region}</strong>
//                 <button 
//                   className="modern-select-region"
//                   onClick={() => selectAllRegion(regionCountries)}
//                   disabled={selectedCountries.length >= 3}
//                 >
//                   Select 3
//                 </button>
//               </div>
//               <div className="modern-countries-grid">
//                 {regionCountries.map(country => (
//                   <label key={country.code} className="modern-country-checkbox">
//                     <input
//                       type="checkbox"
//                       checked={selectedCountries.includes(country.code)}
//                       onChange={() => handleCountryChange(country.code)}
//                       disabled={!selectedCountries.includes(country.code) && selectedCountries.length >= 3}
//                     />
//                     <span className="country-name">{country.name}</span>
//                     <span className="modern-country-code">{country.code.toUpperCase()}</span>
//                   </label>
//                 ))}
//               </div>
//             </div>
//           ))}
          
//           <div className="country-actions">
//             <button 
//               className="modern-search-btn"
//               onClick={fetchOpportunities}
//               disabled={selectedCountries.length === 0 || opportunityLoading}
//             >
//               {opportunityLoading ? "Searching..." : "🔍 Search Jobs"}
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );

//   const renderOpportunityCard = (opportunity: any) => (
//     <div key={opportunity.title + opportunity.company} className="modern-job-card">
//       <div className="modern-job-header">
//         {opportunity.logo ? (
//           <img src={opportunity.logo} alt={opportunity.company} className="modern-company-logo" />
//         ) : (
//           <div className="modern-logo-placeholder">{opportunity.company.charAt(0)}</div>
//         )}
//         <h3 className="modern-job-title">{opportunity.title}</h3>
//       </div>
//       <div className="modern-job-company">{opportunity.company}</div>
//       <div className="modern-job-location">
//         📍 {opportunity.location}
//         {opportunity.remote && <span className="modern-remote-badge">Remote</span>}
//       </div>
//       {opportunity.salary !== "Not specified" && (
//         <div className="modern-job-salary">💰 {opportunity.salary}</div>
//       )}
//       <div className="modern-job-description">{opportunity.description}</div>
//       <div className="modern-job-meta">
//         <span className="modern-job-type">{opportunity.jobType}</span>
//         <span className="modern-job-source">via {opportunity.source}</span>
//       </div>
//       {opportunity.applyLink && opportunity.applyLink !== '#' && (
//         <a 
//           href={opportunity.applyLink} 
//           target="_blank" 
//           rel="noopener noreferrer"
//           className="modern-apply-btn"
//         >
//           Apply Now →
//         </a>
//       )}
//     </div>
//   );

//   return (
//     <div className="modern-container">
//       <div className="modern-header">
//         <h1 className="modern-title">AI Resume Analyzer & Job Finder</h1>
//         <p className="modern-subtitle">Upload your resume and discover opportunities worldwide</p>
//       </div>

//       <div className="modern-card">
//         <div 
//           className="modern-upload-area"
//           onDragOver={handleDragOver}
//           onDrop={handleDrop}
//         >
//           <input
//             type="file"
//             id="file-upload"
//             accept=".pdf"
//             onChange={handleFileChange}
//           />
//           <label htmlFor="file-upload" className="modern-upload-label">
//             📄 Choose a PDF file
//           </label>
//           {fileName && <span className="modern-file-name">Selected: {fileName}</span>}
//           <p className="modern-upload-text">or drag and drop your resume here</p>
//           <button 
//             className="modern-btn" 
//             onClick={handleUpload} 
//             disabled={loading || !file}
//           >
//             {loading ? (
//               <>
//                 <span className="modern-spinner"></span>
//                 Analyzing...
//               </>
//             ) : (
//               "Analyze Resume"
//             )}
//           </button>
//         </div>
//       </div>

//       {error && (
//         <div className="modern-error">
//           <strong>Error:</strong> {error}
//         </div>
//       )}

//       {/* Show Analysis */}
//       {analysis && (
//         <div className="modern-card">
//           <h2 className="modern-section-title">Resume Analysis</h2>
//           <pre className="modern-pre">{analysis}</pre>
//         </div>
//       )}

//       {/* Show Suggestions */}
//       {(jobSuggestions || internshipSuggestions) && (
//         <div className="modern-suggestions-grid">
//           {jobSuggestions && (
//             <div className="modern-suggestion-card">
//               <div className="modern-suggestion-header">
//                 <span className="modern-suggestion-icon">💼</span>
//                 <h3 className="modern-suggestion-title">Recommended Jobs</h3>
//               </div>
//               <pre className="modern-suggestion-content">{jobSuggestions}</pre>
//             </div>
//           )}
//           {internshipSuggestions && (
//             <div className="modern-suggestion-card">
//               <div className="modern-suggestion-header">
//                 <span className="modern-suggestion-icon">🎓</span>
//                 <h3 className="modern-suggestion-title">Recommended Internships</h3>
//               </div>
//               <pre className="modern-suggestion-content">{internshipSuggestions}</pre>
//             </div>
//           )}
//         </div>
//       )}

//       {/* Country Selector */}
//       {(analysis || jobSuggestions || internshipSuggestions) && renderCountrySelector()}

//       {/* Jobs and Internships Tabs */}
//       {(jobs.length > 0 || internships.length > 0 || opportunityLoading) && (
//         <div className="modern-tabs-container">
//           <div className="modern-tabs">
//             <button 
//               className={`modern-tab ${activeTab === 'jobs' ? 'active' : ''}`}
//               onClick={() => setActiveTab('jobs')}
//             >
//               💼 Live Jobs 
//               {jobs.length > 0 && <span className="modern-tab-count">{jobs.length}</span>}
//             </button>
//             <button 
//               className={`modern-tab ${activeTab === 'internships' ? 'active' : ''}`}
//               onClick={() => setActiveTab('internships')}
//             >
//               📚 Internships
//               {internships.length > 0 && <span className="modern-tab-count">{internships.length}</span>}
//             </button>
//           </div>

//           <div className="modern-tab-content">
//             {activeTab === 'jobs' && (
//               <div className="modern-jobs-section">
//                 <h2 className="modern-section-title">Live Job Openings</h2>
//                 {opportunityLoading ? (
//                   <div className="modern-loading">
//                     <span className="modern-spinner-large"></span>
//                     <p>Searching in {selectedCountries.length} country(s)...</p>
//                   </div>
//                 ) : jobs.length > 0 ? (
//                   <>
//                     {renderFilterBar('job', filteredJobs.length)}
//                     <div className="modern-jobs-grid">
//                       {filteredJobs.map(renderOpportunityCard)}
//                     </div>
//                   </>
//                 ) : (
//                   <div className="modern-no-results">
//                     <span className="modern-sad-emoji">😔</span>
//                     <h3>No jobs found</h3>
//                     <p>Try selecting different countries</p>
//                   </div>
//                 )}
//               </div>
//             )}

//             {activeTab === 'internships' && (
//               <div className="modern-jobs-section">
//                 <h2 className="modern-section-title">Live Internships</h2>
//                 {opportunityLoading ? (
//                   <div className="modern-loading">
//                     <span className="modern-spinner-large"></span>
//                     <p>Searching for internships...</p>
//                   </div>
//                 ) : internships.length > 0 ? (
//                   <>
//                     {renderFilterBar('internship', filteredInternships.length)}
//                     <div className="modern-jobs-grid">
//                       {filteredInternships.map(renderOpportunityCard)}
//                     </div>
//                   </>
//                 ) : (
//                   <div className="modern-no-results">
//                     <span className="modern-sad-emoji">😔</span>
//                     <h3>No internships found</h3>
//                     <p>Try selecting different countries</p>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;

import React, { useState } from "react";
import "./App.css";
import { Container } from "./components/Layout/Container";
import { Header } from "./components/Layout/Header";
import { FileUploader } from "./components/Upload/FileUploader";
import { ResumeAnalysis } from "./components/Analysis/ResumeAnalysis";
import { Suggestions } from "./components/Analysis/Suggestions";
import { CountrySelector } from "./components/Countries/CountrySelector";
import { JobTabs } from "./components/Jobs/JobTabs";
import { ErrorMessage } from "./components/Common/ErrorMessage";
import { useResumeUpload } from "./hooks/useResumeUpload";
import { useJobSearch } from "./hooks/useJobSearch";
import { useFilters } from "./hooks/useFilters";
import { countriesByRegion } from "./utils/countriesData";

function App() {
  const [selectedCountries, setSelectedCountries] = useState<string[]>(["us"]);
  const [showCountrySelector, setShowCountrySelector] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("analysis");

  const {
    file,
    fileName,
    analysis,
    jobSuggestions,
    internshipSuggestions,
    loading,
    error,
    storedJobTitles,
    storedInternshipTitles,
    storedProfileType,
    handleFileChange,
    handleUpload,
    setError
  } = useResumeUpload();

  const {
    jobs,
    internships,
    opportunityLoading,
    fetchOpportunities,
  } = useJobSearch();

  const {
    jobFilter,
    internshipFilter,
    filteredJobs,
    filteredInternships,
    showJobFilters,
    showInternshipFilters,
    handleFilterChange,
    toggleJobFilters,
    toggleInternshipFilters
  } = useFilters(jobs, internships);

  const handleCountryChange = (countryCode: string) => {
    setSelectedCountries(prev => {
      if (prev.includes(countryCode)) {
        if (prev.length > 1) {
          return prev.filter(c => c !== countryCode);
        }
        return prev;
      } else {
        if (prev.length < 3) {
          return [...prev, countryCode];
        }
        return prev;
      }
    });
  };

  const selectAllRegion = (regionCountries: any[]) => {
    const regionCodes = regionCountries.map(c => c.code);
    setSelectedCountries(prev => {
      const newSelection = [...prev];
      regionCodes.forEach(code => {
        if (!newSelection.includes(code) && newSelection.length < 3) {
          newSelection.push(code);
        }
      });
      return newSelection.slice(0, 3);
    });
  };

  const handleSearch = async () => {
    const errorMsg = await fetchOpportunities(
      selectedCountries,
      storedJobTitles,
      storedInternshipTitles,
      storedProfileType
    );
    if (errorMsg) {
      setError(errorMsg);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/pdf") {
        handleFileChange({
          target: { files: e.dataTransfer.files }
        } as React.ChangeEvent<HTMLInputElement>);
      } else {
        setError("Please drop a PDF file");
      }
    }
  };

  const showTabs = jobs.length > 0 || internships.length > 0 || opportunityLoading;

  return (
    <Container>
      <Header />

      <FileUploader
        fileName={fileName}
        loading={loading}
        onFileChange={handleFileChange}
        onUpload={handleUpload}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      />

      {error && <ErrorMessage message={error} />}

      <ResumeAnalysis analysis={analysis} />
      
      <Suggestions
        jobSuggestions={jobSuggestions}
        internshipSuggestions={internshipSuggestions}
      />

      {(analysis || jobSuggestions || internshipSuggestions) && (
        <CountrySelector
          selectedCountries={selectedCountries}
          showCountrySelector={showCountrySelector}
          onCountryChange={handleCountryChange}
          onSelectAllRegion={selectAllRegion}
          onToggleSelector={() => setShowCountrySelector(!showCountrySelector)}
          onSearch={handleSearch}
          opportunityLoading={opportunityLoading}
        />
      )}

      {showTabs && (
        <JobTabs
          activeTab={activeTab}
          jobs={jobs}
          filteredJobs={filteredJobs}
          internships={internships}
          filteredInternships={filteredInternships}
          opportunityLoading={opportunityLoading}
          selectedCountries={selectedCountries}
          jobFilter={jobFilter}
          internshipFilter={internshipFilter}
          showJobFilters={showJobFilters}
          showInternshipFilters={showInternshipFilters}
          onTabChange={setActiveTab}
          onJobFilterChange={(filter) => handleFilterChange('job', filter)}
          onInternshipFilterChange={(filter) => handleFilterChange('internship', filter)}
          onToggleJobFilters={toggleJobFilters}
          onToggleInternshipFilters={toggleInternshipFilters}
        />
      )}
    </Container>
  );
}

export default App;