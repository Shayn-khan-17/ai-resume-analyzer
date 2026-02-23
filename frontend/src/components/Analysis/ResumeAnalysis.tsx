import React from "react";

interface ResumeAnalysisProps {
  analysis: string;
}

export const ResumeAnalysis: React.FC<ResumeAnalysisProps> = ({ analysis }) => {
  if (!analysis) return null;
  
  return (
    <div className="modern-card">
      <h2 className="modern-section-title">Resume Analysis</h2>
      <pre className="modern-pre">{analysis}</pre>
    </div>
  );
};