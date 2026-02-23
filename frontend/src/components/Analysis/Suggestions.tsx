import React from "react";

interface SuggestionsProps {
  jobSuggestions: string;
  internshipSuggestions: string;
}

export const Suggestions: React.FC<SuggestionsProps> = ({ jobSuggestions, internshipSuggestions }) => {
  if (!jobSuggestions && !internshipSuggestions) return null;
  
  return (
    <div className="modern-suggestions-grid">
      {jobSuggestions && (
        <div className="modern-suggestion-card">
          <div className="modern-suggestion-header">
            <span className="modern-suggestion-icon">💼</span>
            <h3 className="modern-suggestion-title">Recommended Jobs</h3>
          </div>
          <pre className="modern-suggestion-content">{jobSuggestions}</pre>
        </div>
      )}
      {internshipSuggestions && (
        <div className="modern-suggestion-card">
          <div className="modern-suggestion-header">Suggestions.tsx
            <span className="modern-suggestion-icon">🎓</span>
            <h3 className="modern-suggestion-title">Recommended Internships</h3>
          </div>
          <pre className="modern-suggestion-content">{internshipSuggestions}</pre>
        </div>
      )}
    </div>
  );
};