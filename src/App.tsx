import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { Auth } from './components/Auth';
import { Calendar } from './components/Calendar';
import { SymptomTracker } from './components/SymptomTracker';
import { HealthInsights } from './components/HealthInsights';
import { CycleDay } from './types';
import { CalendarDays, Baby, Settings, Activity, Book, X, Bell, Moon, Shield, Palette } from 'lucide-react';

type Section = 'tracking' | 'symptoms' | 'pregnancy' | 'insights';

function App() {
  const [session, setSession] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [pregnancyMode, setPregnancyMode] = useState(false);
  const [cycleDays, setCycleDays] = useState<CycleDay[]>([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [activeSection, setActiveSection] = useState<Section>('tracking');
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    cycleLength: 28,
    periodLength: 5,
    notifications: true,
    darkMode: false,
    privacyMode: false,
    theme: 'default'
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  if (!session) {
    return <Auth onAuthSuccess={() => {}} />;
  }

  const toggleSymptom = (symptomId: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptomId)
        ? prev.filter((id) => id !== symptomId)
        : [...prev, symptomId]
    );
  };

  const navigationItems = [
    { id: 'tracking', label: 'Period Tracking', icon: CalendarDays },
    { id: 'symptoms', label: 'Symptoms', icon: Activity },
    { id: 'pregnancy', label: 'Pregnancy Mode', icon: Baby },
    { id: 'insights', label: 'Health Insights', icon: Book },
  ];

  const handleSettingChange = (key: keyof typeof settings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <CalendarDays className="w-8 h-8 text-pink-500" />
              <span className="ml-2 text-xl font-semibold text-gray-800">
                Luna Flow
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setShowSettings(true)}
                className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <Settings className="w-6 h-6" />
              </button>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 text-sm font-medium text-pink-600 hover:text-pink-700"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-800">Settings</h2>
              <button 
                onClick={() => setShowSettings(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-8">
              {/* Cycle Settings */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4">Cycle Preferences</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Average Cycle Length (days)
                    </label>
                    <input
                      type="number"
                      value={settings.cycleLength}
                      onChange={(e) => handleSettingChange('cycleLength', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                      min="20"
                      max="45"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Average Period Length (days)
                    </label>
                    <input
                      type="number"
                      value={settings.periodLength}
                      onChange={(e) => handleSettingChange('periodLength', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                      min="2"
                      max="10"
                    />
                  </div>
                </div>
              </div>

              {/* Notifications */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-pink-500" />
                  Notifications
                </h3>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">Period Reminders</p>
                    <p className="text-sm text-gray-600">Get notified before your next period</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications}
                      onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                  </label>
                </div>
              </div>

              {/* Appearance */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
                  <Palette className="w-5 h-5 text-pink-500" />
                  Appearance
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">Dark Mode</p>
                      <p className="text-sm text-gray-600">Enable dark theme</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.darkMode}
                        onChange={(e) => handleSettingChange('darkMode', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Privacy */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-pink-500" />
                  Privacy
                </h3>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">Privacy Mode</p>
                    <p className="text-sm text-gray-600">Hide sensitive information when app is minimized</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.privacyMode}
                      onChange={(e) => handleSettingChange('privacyMode', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                  </label>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id as Section)}
                className={`
                  flex items-center space-x-2 py-4 px-1 border-b-2 transition-colors
                  ${
                    activeSection === item.id
                      ? 'border-pink-500 text-pink-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeSection === 'tracking' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Calendar
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
                cycleDays={cycleDays}
              />
            </div>
            <div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  Cycle Overview
                </h2>
                <div className="space-y-4">
                  <div className="p-4 bg-pink-50 rounded-lg">
                    <p className="text-pink-800">Next period in 12 days</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <p className="text-purple-800">Fertile window: Mar 15-20</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'symptoms' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <SymptomTracker
              selectedSymptoms={selectedSymptoms}
              onSymptomToggle={toggleSymptom}
            />
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Symptom History
              </h2>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Track your symptoms over time to identify patterns in your cycle.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'pregnancy' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Pregnancy Mode
              </h2>
              <div className="space-y-4">
                <button
                  onClick={() => setPregnancyMode(!pregnancyMode)}
                  className={`
                    w-full p-4 rounded-lg transition-all flex items-center justify-center space-x-2
                    ${
                      pregnancyMode
                        ? 'bg-pink-100 text-pink-700'
                        : 'bg-gray-100 text-gray-600'
                    }
                  `}
                >
                  <Baby className="w-6 h-6" />
                  <span className="font-medium">
                    {pregnancyMode ? 'Disable' : 'Enable'} Pregnancy Mode
                  </span>
                </button>
                {pregnancyMode && (
                  <div className="p-4 bg-pink-50 rounded-lg">
                    <p className="text-pink-800">
                      Pregnancy mode is active. We'll help you track your pregnancy journey!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'insights' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <HealthInsights />
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Educational Resources
              </h2>
              <div className="space-y-4">
                <a
                  href="#"
                  className="block p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg hover:from-purple-100 hover:to-pink-100 transition-colors"
                >
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Understanding Your Menstrual Cycle
                  </h3>
                  <p className="text-gray-600">
                    Learn about the four phases of your cycle and what happens during each one.
                  </p>
                </a>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;