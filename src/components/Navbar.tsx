import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { useAuthStore } from '../store/authStore';
import { BriefcaseIcon, UserCircle } from 'lucide-react';

export function Navbar() {
  const { user, signOut } = useAuthStore();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/signin');
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <BriefcaseIcon className="h-8 w-8 text-purple-600" />
              <span className="ml-2 text-xl font-bold text-purple-600">
                Job Harvest
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/about" className="text-gray-700 dark:text-gray-200 hover:text-purple-600">
              About
            </Link>
            <Link to="/pricing" className="text-gray-700 dark:text-gray-200 hover:text-purple-600">
              Pricing
            </Link>
            <Link to="/contact" className="text-gray-700 dark:text-gray-200 hover:text-purple-600">
              Contact
            </Link>
            <ThemeToggle />
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile" className="flex items-center text-gray-700 dark:text-gray-200 hover:text-purple-600">
                  <UserCircle className="h-6 w-6 mr-1" />
                  Profile
                </Link>
                <button
                  onClick={handleSignOut}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/signin"
                  className="text-gray-700 dark:text-gray-200 hover:text-purple-600"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}