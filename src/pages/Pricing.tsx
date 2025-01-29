import React from 'react';
import { Check } from 'lucide-react';

export function Pricing() {
  const plans = [
    {
      name: 'Free',
      priceUSD: '0',
      priceEGP: '0', // Assuming Free plan in both currencies is 0
      features: [
        'Basic job search',
        '10 searches per day',
        'Email notifications',
        'Basic filters'
      ]
    },
    {
      name: 'Pro',
      priceUSD: '9.99',
      priceEGP: '299', // Example conversion for Pro plan
      features: [
        'Unlimited searches',
        'Advanced filters',
        'Priority notifications',
        'Save job searches',
        'Application tracking',
        'Resume builder'
      ]
    },
    {
      name: 'Enterprise',
      priceUSD: '29.99',
      priceEGP: '899', // Example conversion for Enterprise plan
      features: [
        'All Pro features',
        'API access',
        'Custom integrations',
        'Dedicated support',
        'Team collaboration',
        'Analytics dashboard'
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Simple, Transparent Pricing
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Choose the plan that best fits your needs
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 border-2 border-transparent hover:border-purple-500 transition-all"
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {plan.name}
            </h3>
            <div className="mb-8">
              {plan.priceUSD !== '0' && (
                <>
                  <span className="text-4xl font-bold text-purple-600">${plan.priceUSD}</span>
                  <span className="text-gray-600 dark:text-gray-300">/month</span>
                  <br />
                </>
              )}
              {plan.priceEGP !== '0' && (
                <>
                  <span className="text-2xl font-bold text-purple-600">EGP {plan.priceEGP}</span>
                  <span className="text-gray-600 dark:text-gray-300">/month</span>
                </>
              )}
              {plan.priceUSD === '0' && plan.priceEGP === '0' && (
                <span className="text-2xl font-bold text-green-600">Free</span>
              )}
            </div>
            <ul className="space-y-4 mb-8">
              {plan.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-center text-gray-600 dark:text-gray-300">
                  <Check className="w-5 h-5 text-purple-600 mr-2" />
                  {feature}
                </li>
              ))}
            </ul>
            <button className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:ring-4 focus:ring-purple-500 focus:ring-opacity-50 transition-colors">
              Get Started
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
