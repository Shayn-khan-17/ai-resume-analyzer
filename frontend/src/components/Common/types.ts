export interface Job {
  title: string;
  company: string;
  location: string;
  salary: string;
  description: string;
  applyLink: string;
  source: string;
  jobType: string;
  logo: string | null;
  postedDate: string;
  remote?: boolean;
}

export interface Country {
  code: string;
  name: string;
}

export interface Suggestions {
  jobs: string;
  internships: string;
}