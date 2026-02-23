import React from "react";
import type { Job } from "../Common/types";
import { JobCard } from "./JobCard";
import { FilterBar } from "./FilterBar";
import { NoResults } from "./NoResults";

interface JobTabsProps {
  activeTab: string;
  jobs: Job[];
  filteredJobs: Job[];
  internships: Job[];
  filteredInternships: Job[];
  opportunityLoading: boolean;
  selectedCountries: string[];
  jobFilter: string;
  internshipFilter: string;
  showJobFilters: boolean;
  showInternshipFilters: boolean;
  onTabChange: (tab: string) => void;
  onJobFilterChange: (filter: string) => void;
  onInternshipFilterChange: (filter: string) => void;
  onToggleJobFilters: () => void;
  onToggleInternshipFilters: () => void;
}

export const JobTabs: React.FC<JobTabsProps> = ({
  activeTab,
  jobs,
  filteredJobs,
  internships,
  filteredInternships,
  opportunityLoading,
  selectedCountries,
  jobFilter,
  internshipFilter,
  showJobFilters,
  showInternshipFilters,
  onTabChange,
  onJobFilterChange,
  onInternshipFilterChange,
  onToggleJobFilters,
  onToggleInternshipFilters
}) => {
  return (
    <div className="modern-tabs-container">
      <div className="modern-tabs">
        <button 
          className={`modern-tab ${activeTab === 'jobs' ? 'active' : ''}`}
          onClick={() => onTabChange('jobs')}
        >
          💼 Live Jobs 
          {jobs.length > 0 && <span className="modern-tab-count">{jobs.length}</span>}
        </button>
        <button 
          className={`modern-tab ${activeTab === 'internships' ? 'active' : ''}`}
          onClick={() => onTabChange('internships')}
        >
          📚 Internships
          {internships.length > 0 && <span className="modern-tab-count">{internships.length}</span>}
        </button>
      </div>

      <div className="modern-tab-content">
        {activeTab === 'jobs' && (
          <div className="modern-jobs-section">
            <h2 className="modern-section-title">Live Job Openings</h2>
            {opportunityLoading ? (
              <div className="modern-loading">
                <span className="modern-spinner-large"></span>
                <p>Searching in {selectedCountries.length} country(s)...</p>
              </div>
            ) : jobs.length > 0 ? (
              <>
                <FilterBar
                  type="job"
                  count={filteredJobs.length}
                  currentFilter={jobFilter}
                  showFilters={showJobFilters}
                  onToggle={onToggleJobFilters}
                  onFilterChange={onJobFilterChange}
                />
                <div className="modern-jobs-grid">
                  {filteredJobs.map((job, index) => (
                    <JobCard key={`${job.title}-${job.company}-${index}`} opportunity={job} />
                  ))}
                </div>
              </>
            ) : (
              <NoResults message="No jobs found" suggestion="Try selecting different countries" />
            )}
          </div>
        )}

        {activeTab === 'internships' && (
          <div className="modern-jobs-section">
            <h2 className="modern-section-title">Live Internships</h2>
            {opportunityLoading ? (
              <div className="modern-loading">
                <span className="modern-spinner-large"></span>
                <p>Searching for internships...</p>
              </div>
            ) : internships.length > 0 ? (
              <>
                <FilterBar
                  type="internship"
                  count={filteredInternships.length}
                  currentFilter={internshipFilter}
                  showFilters={showInternshipFilters}
                  onToggle={onToggleInternshipFilters}
                  onFilterChange={onInternshipFilterChange}
                />
                <div className="modern-jobs-grid">
                  {filteredInternships.map((internship, index) => (
                    <JobCard key={`${internship.title}-${internship.company}-${index}`} opportunity={internship} />
                  ))}
                </div>
              </>
            ) : (
              <NoResults message="No internships found" suggestion="Try selecting different countries" />
            )}
          </div>
        )}
      </div>
    </div>
  );
};