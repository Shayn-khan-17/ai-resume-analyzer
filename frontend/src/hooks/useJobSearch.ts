import { useState } from "react";
import axios from "axios";
import type { Job } from "../components/Common/types";

export const useJobSearch = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [internships, setInternships] = useState<Job[]>([]);
  const [opportunityLoading, setOpportunityLoading] = useState<boolean>(false);

  const fetchOpportunities = async (
    selectedCountries: string[],
    storedJobTitles: string[],
    storedInternshipTitles: string[],
    storedProfileType: string
  ) => {
    if (selectedCountries.length === 0) {
      return "Please select at least one country";
    }

    if (storedJobTitles.length === 0 && storedInternshipTitles.length === 0) {
      return "No job titles available. Please upload a resume first.";
    }

    try {
      setOpportunityLoading(true);
      setJobs([]);
      setInternships([]);
      
      console.log("🔍 Fetching jobs for countries:", selectedCountries);
      
      const countryPromises = selectedCountries.map(countryCode => 
        axios.post("http://localhost:5000/fetch-opportunities", {
          jobTitles: storedJobTitles,
          internshipTitles: storedInternshipTitles,
          profileType: storedProfileType,
          country: countryCode
        })
      );
      
      const responses = await Promise.all(countryPromises);
      
      let allJobs: Job[] = [];
      let allInternships: Job[] = [];
      
      responses.forEach((response) => {
        if (response.data.success) {
          const countryJobs = response.data.opportunities.jobs || [];
          const countryInternships = response.data.opportunities.internships || [];
          
          allJobs = [...allJobs, ...countryJobs];
          allInternships = [...allInternships, ...countryInternships];
        }
      });
      
      const uniqueJobs = Array.from(
        new Map(allJobs.map(job => [job.title + job.company, job])).values()
      );
      
      const uniqueInternships = Array.from(
        new Map(allInternships.map(internship => [internship.title + internship.company, internship])).values()
      );
      
      setJobs(uniqueJobs);
      setInternships(uniqueInternships);
      
      return null;
      
    } catch (error) {
      console.error("Error fetching opportunities:", error);
      return "Error fetching opportunities";
    } finally {
      setOpportunityLoading(false);
    }
  };

  return {
    jobs,
    internships,
    opportunityLoading,
    fetchOpportunities,
    setJobs,
    setInternships
  };
};