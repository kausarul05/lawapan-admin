// components/SettingsPage.js
'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import dynamic from 'next/dynamic';
import toast from 'react-hot-toast';
import { settingsAPI } from '@/lib/api';

const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

const SettingsPage = ({ onBackClick }) => {
  const editor = useRef(null);
  const [activeTab, setActiveTab] = useState('privacy-security');
  const [editableContent, setEditableContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [tabContents, setTabContents] = useState({
    'privacy-security': {
      title: 'Privacy Policy',
      date: '',
      text: ''
    },
    'terms-conditions': {
      title: 'Terms & Conditions',
      date: '',
      text: ''
    },
    'about-us': {
      title: 'About Us',
      date: '',
      text: ''
    },
    'hiring': {
      title: 'Lawpantruck is hiring',
      date: '',
      text: ''
    },
    'insurance': {
      title: 'Insurance',
      date: '',
      text: ''
    },
    'carrier-data': {
      title: 'Your Carrier Data',
      date: '',
      text: ''
    }
  });

  // Fetch content for all tabs on mount
  useEffect(() => {
    fetchAllSettings();
  }, []);

  // Update editable content when tab changes
  useEffect(() => {
    setEditableContent(tabContents[activeTab]?.text || '');
  }, [activeTab, tabContents]);

  const fetchAllSettings = async () => {
    setLoading(true);
    try {
      const fetchFunctions = {
        'privacy-security': settingsAPI.getPrivacyPolicy,
        'terms-conditions': settingsAPI.getTermsConditions,
        'about-us': settingsAPI.getAboutUs,
        'hiring': settingsAPI.getHiring,
        'insurance': settingsAPI.getInsurance,
        'carrier-data': settingsAPI.getCarrierData
      };

      const updates = {};
      
      for (const [tabId, fetchFunc] of Object.entries(fetchFunctions)) {
        try {
          const response = await fetchFunc();
          if (response.success && response.data) {
            // The API returns description field, not content
            const contentText = response.data.description || response.data.content || '';
            updates[tabId] = {
              ...tabContents[tabId],
              text: contentText,
              date: response.data.updatedAt 
                ? new Date(response.data.updatedAt).toLocaleString() 
                : new Date().toLocaleString()
            };
          }
        } catch (error) {
          console.error(`Error fetching ${tabId}:`, error);
          // Keep default content if API fails
        }
      }
      
      setTabContents(prev => ({
        ...prev,
        ...updates
      }));
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings content');
    } finally {
      setLoading(false);
    }
  };

  const joditConfig = useMemo(() => ({
    readonly: false,
    spellcheck: false,
    buttons: 'undo,redo,|,bold,italic,underline,strikethrough,|,ul,ol,|,link,cut,copy,paste,|,align,|,source',
    theme: 'light',
    toolbarButtonSize: 'large',
    placeholder: 'Enter your content here...',
    height: 400,
  }), []);

  const handleSaveAndChange = async () => {
    if (saving) return;
    
    setSaving(true);
    try {
      // Send description field as per API requirement
      const response = await settingsAPI.updateSetting(activeTab, editableContent);
      
      if (response.success) {
        // Update local state with new content and date
        setTabContents(prev => ({
          ...prev,
          [activeTab]: {
            ...prev[activeTab],
            text: editableContent,
            date: response.data?.updatedAt 
              ? new Date(response.data.updatedAt).toLocaleString() 
              : new Date().toLocaleString()
          }
        }));
        
        toast.success(`${tabContents[activeTab].title} saved successfully!`);
      } else {
        toast.error(response.message || `Failed to save ${tabContents[activeTab].title}`);
      }
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error(error.message || `Failed to save ${tabContents[activeTab].title}`);
    } finally {
      setSaving(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-white rounded-2xl min-h-screen text-black p-6 sm:p-6 lg:p-8 font-inter flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#036BB4] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl min-h-screen text-black p-6 sm:p-6 lg:p-8 font-inter">
      <div className="flex items-center mb-6">
        {onBackClick && (
          <button 
            onClick={onBackClick} 
            className="text-gray-600 hover:text-black mr-4 transition-colors" 
            aria-label="Go back"
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
        )}
        <h1 className="text-2xl sm:text-3xl font-bold">Settings</h1>
      </div>

      <div className="border-b border-gray-300">
        <div className="md:w-full flex justify-start bg-gray-100 rounded-t-lg overflow-x-auto scrollbar-hide">
          {Object.keys(tabContents).map((tabId) => (
            <button
              key={tabId}
              className={`flex-shrink-0 px-4 py-4 text-lg font-medium relative transition-colors ${
                activeTab === tabId 
                  ? 'text-[#036BB4] bg-white' 
                  : 'text-gray-600 hover:text-black hover:bg-gray-200'
              }`}
              onClick={() => setActiveTab(tabId)}
            >
              {tabContents[tabId].title}
              {activeTab === tabId && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#036BB4]"></span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white p-4 rounded-b-lg border border-gray-200 mt-2">
        <div>
          <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
            <h2 className="text-xl font-semibold">{tabContents[activeTab].title}</h2>
            {tabContents[activeTab].date && (
              <p className="text-sm text-gray-500">
                Last updated: {tabContents[activeTab].date}
              </p>
            )}
          </div>
          
          <div className="rounded-md mb-6">
            <JoditEditor
              className="jodit-custom-theme"
              ref={editor}
              value={editableContent}
              config={joditConfig}
              onBlur={(newContent) => setEditableContent(newContent)}
              onChange={(newContent) => {}}
            />
          </div>
        </div>

        <div className="col-span-full mt-4">
          <button
            type="button"
            onClick={handleSaveAndChange}
            disabled={saving}
            className={`w-full mx-auto flex justify-center items-center rounded-md bg-[#036BB4] text-white py-3 font-medium transition-all ${
              saving 
                ? 'opacity-70 cursor-not-allowed' 
                : 'hover:bg-[#025a99] transform hover:scale-[1.02]'
            }`}
          >
            {saving && (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            )}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Info message */}
      <div className="mt-4 text-center text-xs text-gray-400">
        Tip: You can format your content using the toolbar above. Changes will be saved immediately.
      </div>
    </div>
  );
};

export default SettingsPage;