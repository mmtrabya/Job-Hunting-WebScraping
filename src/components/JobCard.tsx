import React from 'react';
import { Building2, MapPin, Calendar, ExternalLink } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';

interface JobCardProps {
  job: {
    Title: string;
    Company: string;
    Location: string | null;
    Date: string | null;
    Description: string | null;
    URL: string | null;
  };
}

export function JobCard({ job }: JobCardProps) {
  const { user } = useAuthStore();

  const handleSaveJob = async () => {
    if (!user) return;

    try {
      await supabase.from('saved_jobs').insert({
        user_id: user.id,
        job_title: job.Title,
        company: job.Company,
        location: job.Location,
        description: job.Description,
        url: job.URL
      });
    } catch (error) {
      console.error('Error saving job:', error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {job.Title}
      </h3>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-gray-600 dark:text-gray-300">
          <Building2 className="w-4 h-4 mr-2" />
          {job.Company}
        </div>
        {job.Location && (
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <MapPin className="w-4 h-4 mr-2" />
            {job.Location}
          </div>
        )}
        {job.Date && (
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <Calendar className="w-4 h-4 mr-2" />
            {job.Date}
          </div>
        )}
      </div>

      {job.Description && (
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
          {job.Description}
        </p>
      )}

      <div className="flex justify-between items-center">
        {user && (
          <button
            onClick={handleSaveJob}
            className="px-4 py-2 bg-purple-100 dark:bg-purple-900 text-purple-600 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
          >
            Save Job
          </button>
        )}
        {job.URL && (
          <a
            href={job.URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-purple-600 hover:text-purple-500"
          >
            View Job <ExternalLink className="w-4 h-4 ml-1" />
          </a>
        )}
      </div>
    </div>
  );
}