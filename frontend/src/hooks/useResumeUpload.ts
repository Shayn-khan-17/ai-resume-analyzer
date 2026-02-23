import { useState } from "react";
import axios from "axios";
import { extractJobTitles, detectProfileType } from "../utils/helpers";

export const useResumeUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [analysis, setAnalysis] = useState<string>("");
  const [jobSuggestions, setJobSuggestions] = useState<string>("");
  const [internshipSuggestions, setInternshipSuggestions] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [storedJobTitles, setStoredJobTitles] = useState<string[]>([]);
  const [storedInternshipTitles, setStoredInternshipTitles] = useState<string[]>([]);
  const [storedProfileType, setStoredProfileType] = useState<string>("general");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== "application/pdf") {
        setError("Please select a PDF file");
        setFile(null);
        setFileName("");
        return;
      }
      
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setError("");
      setAnalysis("");
      setJobSuggestions("");
      setInternshipSuggestions("");
      setStoredJobTitles([]);
      setStoredInternshipTitles([]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a PDF file!");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      setLoading(true);
      setError("");

      const res = await axios.post("http://localhost:5000/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Analysis response:", res.data);
      
      setAnalysis(res.data.analysis || "No analysis available");
      
      if (res.data.suggestions) {
        setJobSuggestions(res.data.suggestions.jobs || "");
        setInternshipSuggestions(res.data.suggestions.internships || "");
        
        const extractedJobTitles = extractJobTitles(res.data.suggestions.jobs || "");
        const extractedInternshipTitles = extractJobTitles(res.data.suggestions.internships || "");
        const profileType = detectProfileType(res.data.analysis || "");
        
        setStoredJobTitles(extractedJobTitles);
        setStoredInternshipTitles(extractedInternshipTitles);
        setStoredProfileType(profileType);
      }
      
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.response?.data?.error || "Failed to connect to server");
      setAnalysis("");
      setJobSuggestions("");
      setInternshipSuggestions("");
    } finally {
      setLoading(false);
    }
  };

  return {
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
  };
};