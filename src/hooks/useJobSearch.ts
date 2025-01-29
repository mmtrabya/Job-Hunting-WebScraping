import { useState } from 'react';
import { Job } from '../types/job';
import { searchJobs } from '../services/api/jobApi';

export function useJobSearch() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (query: string, location: string) => {
    if (!query.trim()) {
      setError('Please enter a job title');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const results = await searchJobs(query, location);
      setJobs(results);
      if (results.length === 0) {
        setError('No jobs found. Try different search terms.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search jobs. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return { jobs, isLoading, error, search };
}