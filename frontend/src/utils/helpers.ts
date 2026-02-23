export const extractJobTitles = (suggestions: string): string[] => {
  if (!suggestions) return [];
  const lines = suggestions.split('\n');
  return lines
    .filter(line => line.match(/^\d+\./))
    .map(line => {
      const titlePart = line.replace(/^\d+\.\s*/, '').split('-')[0].trim();
      return titlePart;
    });
};

export const detectProfileType = (analysis: string): string => {
  const lowerAnalysis = analysis.toLowerCase();
  if (lowerAnalysis.includes('legal') || lowerAnalysis.includes('law') || lowerAnalysis.includes('attorney')) {
    return 'legal';
  }
  if (lowerAnalysis.includes('medical') || lowerAnalysis.includes('nurse') || lowerAnalysis.includes('doctor')) {
    return 'medical';
  }
  if (lowerAnalysis.includes('teacher') || lowerAnalysis.includes('education')) {
    return 'education';
  }
  return 'general';
};