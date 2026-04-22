

import React, { useState } from "react";
import "./App.css";
import { Container } from "./components/Layout/Container";
import { Header } from "./components/Layout/Header";
import { FileUploader } from "./components/Upload/FileUploader";
import { ResumeAnalysis } from "./components/Analysis/ResumeAnalysis";
import { Suggestions } from "./components/Analysis/Suggestions";
import { CountrySelector } from "./components/Countries/CountrySelector";
import { JobTabs } from "./components/Jobs/JobTabs";
import { ErrorMessage } from "./components/Common/ErrorMessage";
import { useResumeUpload } from "./hooks/useResumeUpload";
import { useJobSearch } from "./hooks/useJobSearch";
import { useFilters } from "./hooks/useFilters";
import { countriesByRegion } from "./utils/countriesData";

function App() {
  const [selectedCountries, setSelectedCountries] = useState<string[]>(["us"]);
  const [showCountrySelector, setShowCountrySelector] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("analysis");

  const {
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
  } = useResumeUpload();

  const {
    jobs,
    internships,
    opportunityLoading,
    fetchOpportunities,
  } = useJobSearch();

  const {
    jobFilter,
    internshipFilter,
    filteredJobs,
    filteredInternships,
    showJobFilters,
    showInternshipFilters,
    handleFilterChange,
    toggleJobFilters,
    toggleInternshipFilters
  } = useFilters(jobs, internships);

  const handleCountryChange = (countryCode: string) => {
    setSelectedCountries(prev => {
      if (prev.includes(countryCode)) {
        if (prev.length > 1) {
          return prev.filter(c => c !== countryCode);
        }
        return prev;
      } else {
        if (prev.length < 3) {
          return [...prev, countryCode];
        }
        return prev;
      }
    });
  };

  const selectAllRegion = (regionCountries: any[]) => {
    const regionCodes = regionCountries.map(c => c.code);
    setSelectedCountries(prev => {
      const newSelection = [...prev];
      regionCodes.forEach(code => {
        if (!newSelection.includes(code) && newSelection.length < 3) {
          newSelection.push(code);
        }
      });
      return newSelection.slice(0, 3);
    });
  };

  const handleSearch = async () => {
    const errorMsg = await fetchOpportunities(
      selectedCountries,
      storedJobTitles,
      storedInternshipTitles,
      storedProfileType
    );
    if (errorMsg) {
      setError(errorMsg);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/pdf") {
        handleFileChange({
          target: { files: e.dataTransfer.files }
        } as React.ChangeEvent<HTMLInputElement>);
      } else {
        setError("Please drop a PDF file");
      }
    }
  };

  const showTabs = jobs.length > 0 || internships.length > 0 || opportunityLoading;

  return (
    <Container>
      <Header />

      <FileUploader
        fileName={fileName}
        loading={loading}
        onFileChange={handleFileChange}
        onUpload={handleUpload}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      />

      {error && <ErrorMessage message={error} />}

      <ResumeAnalysis analysis={analysis} />
      
      <Suggestions
        jobSuggestions={jobSuggestions}
        internshipSuggestions={internshipSuggestions}
      />

      {(analysis || jobSuggestions || internshipSuggestions) && (
        <CountrySelector
          selectedCountries={selectedCountries}
          showCountrySelector={showCountrySelector}
          onCountryChange={handleCountryChange}
          onSelectAllRegion={selectAllRegion}
          onToggleSelector={() => setShowCountrySelector(!showCountrySelector)}
          onSearch={handleSearch}
          opportunityLoading={opportunityLoading}
        />
      )}

      {showTabs && (
        <JobTabs
          activeTab={activeTab}
          jobs={jobs}
          filteredJobs={filteredJobs}
          internships={internships}
          filteredInternships={filteredInternships}
          opportunityLoading={opportunityLoading}
          selectedCountries={selectedCountries}
          jobFilter={jobFilter}
          internshipFilter={internshipFilter}
          showJobFilters={showJobFilters}
          showInternshipFilters={showInternshipFilters}
          onTabChange={setActiveTab}
          onJobFilterChange={(filter) => handleFilterChange('job', filter)}
          onInternshipFilterChange={(filter) => handleFilterChange('internship', filter)}
          onToggleJobFilters={toggleJobFilters}
          onToggleInternshipFilters={toggleInternshipFilters}
        />
      )}
    </Container>
  );
}

export default App;