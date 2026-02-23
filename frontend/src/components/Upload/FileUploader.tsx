import React from "react";

interface FileUploaderProps {
  fileName: string;
  loading: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUpload: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  fileName,
  loading,
  onFileChange,
  onUpload,
  onDragOver,
  onDrop
}) => {
  return (
    <div className="modern-card">
      <div 
        className="modern-upload-area"
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        <input
          type="file"
          id="file-upload"
          accept=".pdf"
          onChange={onFileChange}
        />
        <label htmlFor="file-upload" className="modern-upload-label">
          📄 Choose a PDF file
        </label>
        {fileName && <span className="modern-file-name">Selected: {fileName}</span>}
        <p className="modern-upload-text">or drag and drop your resume here</p>
        <button 
          className="modern-btn" 
          onClick={onUpload} 
          disabled={loading || !fileName}
        >
          {loading ? (
            <>
              <span className="modern-spinner"></span>
              Analyzing...
            </>
          ) : (
            "Analyze Resume"
          )}
        </button>
      </div>
    </div>
  );
};
