import axios, { AxiosError } from 'axios';
import { API_CONFIG } from '../../config/api';
import { Job } from '../../types/job';

interface JobSearchResponse {
  job_results: Job[];
}

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function searchJobs(jobTitle: string, location: string = ''): Promise<Job[]> {
  try {
    const response = await api.post<JobSearchResponse>(
      API_CONFIG.ENDPOINTS.SEARCH_JOBS,
      {
        job_title: jobTitle,
        location: location
      }
    );
    return response.data.job_results;
  } catch (error){
    console.log(error)
    if (error instanceof AxiosError) {
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        throw new Error('Unable to connect to the job search service. Please ensure the service is running.');
      }
      if (error.response?.status === 429) {
        throw new Error('Too many requests. Please try again later.');
      }
    }
    throw new Error('Failed to search jobs. Please try again.');
  }
}