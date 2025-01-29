import React from 'react';
import { Briefcase, Globe, Cpu, Users } from 'lucide-react';

export function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          About Job Harvest
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          We're revolutionizing job search by combining AI technology with comprehensive job aggregation.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {[
          {
            icon: <Briefcase className="w-8 h-8 text-purple-600" />,
            title: 'Job Aggregation',
            description: 'Collect listings from multiple job portals in one place'
          },
          {
            icon: <Globe className="w-8 h-8 text-purple-600" />,
            title: 'Multilingual Support',
            description: 'Search jobs in multiple languages with automatic translation'
          },
          {
            icon: <Cpu className="w-8 h-8 text-purple-600" />,
            title: 'AI-Powered Search',
            description: 'Smart abbreviation expansion and intelligent matching'
          },
          {
            icon: <Users className="w-8 h-8 text-purple-600" />,
            title: 'User-Centric',
            description: 'Designed for the best possible job search experience'
          }
        ].map((feature, index) => (
          <div key={index} className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="inline-block p-3 bg-purple-100 dark:bg-purple-900 rounded-full mb-4">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}