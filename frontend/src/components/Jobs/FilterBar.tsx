import React from "react";

interface FilterBarProps {
  type: 'job' | 'internship';
  count: number;
  currentFilter: string;
  showFilters: boolean;
  onToggle: () => void;
  onFilterChange: (filterValue: string) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  type,
  count,
  currentFilter,
  showFilters,
  onToggle,
  onFilterChange
}) => {
  const title = type === 'job' ? 'Jobs' : 'Internships';
  
  return (
    <div className="modern-filter-bar">
      <div className="modern-filter-header" onClick={onToggle}>
        <span className="modern-filter-title">
          <span className="filter-icon">🔍</span> Filter {title}
        </span>
        <span className="modern-filter-count">{count} available</span>
        <span className="modern-arrow">{showFilters ? '▼' : '▶'}</span>
      </div>
      
      {showFilters && (
        <div className="modern-filter-options">
          <button
            className={`modern-filter-btn ${currentFilter === 'all' ? 'active' : ''}`}
            onClick={() => onFilterChange('all')}
          >
            All
          </button>
          <button
            className={`modern-filter-btn ${currentFilter === 'remote' ? 'active' : ''}`}
            onClick={() => onFilterChange('remote')}
          >
            🏠 Remote
          </button>
          <button
            className={`modern-filter-btn ${currentFilter === 'onsite' ? 'active' : ''}`}
            onClick={() => onFilterChange('onsite')}
          >
            🏢 On-site
          </button>
          <button
            className={`modern-filter-btn ${currentFilter === 'hybrid' ? 'active' : ''}`}
            onClick={() => onFilterChange('hybrid')}
          >
            🔄 Hybrid
          </button>
        </div>
      )}
    </div>
  );
};