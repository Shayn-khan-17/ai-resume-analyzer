// Country mappings for job search
const countryNameMap = {
  'us': 'United States',
  'gb': 'United Kingdom',
  'ca': 'Canada',
  'au': 'Australia',
  'de': 'Germany',
  'fr': 'France',
  'nl': 'Netherlands',
  'es': 'Spain',
  'it': 'Italy',
  'ie': 'Ireland',
  'in': 'India',
  'pk': 'Pakistan',
  'ae': 'UAE',
  'sa': 'Saudi Arabia',
  'za': 'South Africa',
  'br': 'Brazil',
  'ar': 'Argentina',
  'mx': 'Mexico',
  'jp': 'Japan',
  'kr': 'South Korea',
  'nz': 'New Zealand',
  'sg': 'Singapore'
};

// Experience level mappings
const experienceLevels = {
  'phd': 'senior',
  'masters': 'mid',
  'bachelors': 'entry',
  'student': 'entry',
  'highschool': 'intern',
  'unknown': 'entry'
};

// Default job titles for fallback
const defaultJobTitles = {
  general: ['Software Engineer', 'Developer', 'Engineer', 'Data Analyst', 'Project Manager'],
  internships: ['Intern', 'Internship', 'Trainee', 'Apprentice']
};

module.exports = {
  countryNameMap,
  experienceLevels,
  defaultJobTitles
};