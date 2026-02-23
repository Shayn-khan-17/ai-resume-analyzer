import React from "react";

interface NoResultsProps {
  message: string;
  suggestion?: string;
}

export const NoResults: React.FC<NoResultsProps> = ({ message, suggestion }) => {
  return (
    <div className="modern-no-results">
      <span className="modern-sad-emoji">😔</span>
      <h3>{message}</h3>
      {suggestion && <p>{suggestion}</p>}
    </div>
  );
};