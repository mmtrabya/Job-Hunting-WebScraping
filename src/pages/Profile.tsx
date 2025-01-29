import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Briefcase, BookMarked, Settings, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';

export function Profile() {
  const navigate = useNavigate();
  const { user, signOut } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState<any>(null); // Store profile data
  const [isEditing, setIsEditing] = useState(false); // To toggle between edit and view mode
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  // Fetch profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, user_id, email, name')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
        } else {
          setProfile(data); // Update state with profile data
          setFormData({ name: data?.name || '', email: data?.email || '' }); // Set form data
        }
      }
    };

    fetchProfile();
  }, [user]); // Refetch if user changes

  const handleSignOut = async () => {
    await signOut();
    navigate('/signin');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveChanges = async () => {
    if (user) {
      const { error } = await supabase
        .from('profiles')
        .update({ name: formData.name, email: formData.email })
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating profile:', error);
      } else {
        setProfile({ ...profile, ...formData }); // Update local state
        setIsEditing(false); // Switch to view mode
      }
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'jobs', label: 'Saved Jobs', icon: Briefcase },
    { id: 'applications', label: 'Applications', icon: BookMarked },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  if (!user) {
    navigate('/signin'); // Redirect to sign-in if no user is found
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="text-center mb-6">
              <div className="inline-block p-3 bg-purple-100 dark:bg-purple-900 rounded-full mb-4">
                <User className="w-12 h-12 text-purple-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {profile?.name || user?.email}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">{profile?.email || user?.email}</p>
            </div>

            <nav className="space-y-2">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center px-4 py-2 rounded-lg transition-colors ${
                    activeTab === id
                      ? 'bg-purple-100 dark:bg-purple-900 text-purple-600'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {label}
                </button>
              ))}
              <button
                onClick={handleSignOut}
                className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Sign Out
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            {activeTab === 'profile' && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Profile Information</h3>
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-gray-700 dark:text-gray-300">Name:</p>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="block w-full p-2 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                      />
                    ) : (
                      <p>{profile?.name || 'No name set'}</p>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700 dark:text-gray-300">Email:</p>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="block w-full p-2 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                      />
                    ) : (
                      <p>{profile?.email || 'No email set'}</p>
                    )}
                  </div>
                  {isEditing ? (
                    <button
                      onClick={handleSaveChanges}
                      className="mt-4 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700"
                    >
                      Save Changes
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="mt-4 text-blue-600 hover:text-blue-700"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>
            )}
            {activeTab === 'jobs' && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Saved Jobs</h3>
                {/* Add saved jobs list here */}
              </div>
            )}
            {activeTab === 'applications' && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Job Applications</h3>
                {/* Add job applications list here */}
              </div>
            )}
            {activeTab === 'settings' && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Account Settings</h3>
                {/* Add settings form here */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
