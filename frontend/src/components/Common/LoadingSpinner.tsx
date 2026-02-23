import React from "react";

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'small', text }) => {
  const spinnerClass = size === 'large' ? 'modern-spinner-large' : 'modern-spinner';
  
  return (
    <div className="modern-loading">
      <span className={spinnerClass}></span>
      {text && <p>{text}</p>}
    </div>
  );
};