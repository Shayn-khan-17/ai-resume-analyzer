import React from "react";
import { countriesByRegion } from "../../utils/countriesData";

interface CountrySelectorProps {
  selectedCountries: string[];
  showCountrySelector: boolean;
  onCountryChange: (countryCode: string) => void;
  onSelectAllRegion: (regionCountries: any[]) => void;
  onToggleSelector: () => void;
  onSearch: () => void;
  opportunityLoading: boolean;
}

export const CountrySelector: React.FC<CountrySelectorProps> = ({
  selectedCountries,
  showCountrySelector,
  onCountryChange,
  onSelectAllRegion,
  onToggleSelector,
  onSearch,
  opportunityLoading
}) => {
  return (
    <div className="modern-country-selector">
      <div className="modern-country-header" onClick={onToggleSelector}>
        <span className="modern-country-title">
          <span className="modern-country-icon">🌍</span>
          Select Countries to Search
        </span>
        <span className="modern-selected-badge">
          {selectedCountries.length} selected
        </span>
        <span className="modern-arrow">{showCountrySelector ? '▼' : '▶'}</span>
      </div>
      
      {showCountrySelector && (
        <div className="modern-country-options">
          <p className="modern-country-note">Select up to 3 countries (to avoid rate limits)</p>
          
          {Object.entries(countriesByRegion).map(([region, regionCountries]) => (
            <div key={region} className="modern-region">
              <div className="modern-region-header">
                <strong>{region}</strong>
                <button 
                  className="modern-select-region"
                  onClick={() => onSelectAllRegion(regionCountries)}
                  disabled={selectedCountries.length >= 3}
                >
                  Select 3
                </button>
              </div>
              <div className="modern-countries-grid">
                {regionCountries.map(country => (
                  <label key={country.code} className="modern-country-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedCountries.includes(country.code)}
                      onChange={() => onCountryChange(country.code)}
                      disabled={!selectedCountries.includes(country.code) && selectedCountries.length >= 3}
                    />
                    <span className="country-name">{country.name}</span>
                    <span className="modern-country-code">{country.code.toUpperCase()}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
          
          <div className="country-actions">
            <button 
              className="modern-search-btn"
              onClick={onSearch}
              disabled={selectedCountries.length === 0 || opportunityLoading}
            >
              {opportunityLoading ? "Searching..." : "🔍 Search Jobs"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};