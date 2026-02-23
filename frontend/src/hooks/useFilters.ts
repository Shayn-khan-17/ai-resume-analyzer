import { useState, useEffect } from "react";
import type { Job } from "../components/Common/types";

export const useFilters = (jobs: Job[], internships: Job[]) => {
  const [jobFilter, setJobFilter] = useState<string>("all");
  const [internshipFilter, setInternshipFilter] = useState<string>("all");
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [filteredInternships, setFilteredInternships] = useState<Job[]>([]);
  const [showJobFilters, setShowJobFilters] = useState<boolean>(false);
  const [showInternshipFilters, setShowInternshipFilters] = useState<boolean>(false);

  useEffect(() => {
    applyJobFilter();
  }, [jobs, jobFilter]);

  useEffect(() => {
    applyInternshipFilter();
  }, [internships, internshipFilter]);

  const applyJobFilter = () => {
    if (jobFilter === "all") {
      setFilteredJobs(jobs);
    } else {
      const filtered = jobs.filter(job => {
        const location = job.location?.toLowerCase() || "";
        if (jobFilter === "remote") return location.includes("remote");
        if (jobFilter === "onsite") return !location.includes("remote") && !location.includes("hybrid");
        if (jobFilter === "hybrid") return location.includes("hybrid");
        return true;
      });
      setFilteredJobs(filtered);
    }
  };

  const applyInternshipFilter = () => {
    if (internshipFilter === "all") {
      setFilteredInternships(internships);
    } else {
      const filtered = internships.filter(internship => {
        const location = internship.location?.toLowerCase() || "";
        if (internshipFilter === "remote") return location.includes("remote");
        if (internshipFilter === "onsite") return !location.includes("remote") && !location.includes("hybrid");
        if (internshipFilter === "hybrid") return location.includes("hybrid");
        return true;
      });
      setFilteredInternships(filtered);
    }
  };

  const handleFilterChange = (type: string, filterValue: string) => {
    if (type === 'job') {
      setJobFilter(filterValue);
    } else {
      setInternshipFilter(filterValue);
    }
  };

  const toggleJobFilters = () => {
    setShowJobFilters(!showJobFilters);
  };

  const toggleInternshipFilters = () => {
    setShowInternshipFilters(!showInternshipFilters);
  };

  return {
    jobFilter,
    internshipFilter,
    filteredJobs,
    filteredInternships,
    showJobFilters,
    showInternshipFilters,
    handleFilterChange,
    toggleJobFilters,
    toggleInternshipFilters
  };
};