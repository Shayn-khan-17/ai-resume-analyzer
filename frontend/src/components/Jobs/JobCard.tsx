import React from "react";
import type { Job } from "../Common/types";

interface JobCardProps {
  opportunity: Job;
}

export const JobCard: React.FC<JobCardProps> = ({ opportunity }) => {
  return (
    <div className="modern-job-card">
      <div className="modern-job-header">
        {opportunity.logo ? (
          <img src={opportunity.logo} alt={opportunity.company} className="modern-company-logo" />
        ) : (
          <div className="modern-logo-placeholder">{opportunity.company.charAt(0)}</div>
        )}
        <h3 className="modern-job-title">{opportunity.title}</h3>
      </div>
      <div className="modern-job-company">{opportunity.company}</div>
      <div className="modern-job-location">
        📍 {opportunity.location}
        {opportunity.remote && <span className="modern-remote-badge">Remote</span>}
      </div>
      {opportunity.salary !== "Not specified" && (
        <div className="modern-job-salary">💰 {opportunity.salary}</div>
      )}
      <div className="modern-job-description">{opportunity.description}</div>
      <div className="modern-job-meta">
        <span className="modern-job-type">{opportunity.jobType}</span>
        <span className="modern-job-source">via {opportunity.source}</span>
      </div>
      {opportunity.applyLink && opportunity.applyLink !== '#' && (
        <a 
          href={opportunity.applyLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="modern-apply-btn"
        >
          Apply Now →
        </a>
      )}
    </div>
  );
};