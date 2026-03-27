// components/SettingsPage.js
'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import dynamic from 'next/dynamic';

const contentData = {
  'privacy-security': {
    title: 'Privacy Policy',
    date: 'Dec 4, 2019 21:42',
    text: `<h1>Privacy Policy</h1><p>1. Information We Collect</p>`,
  },
  'terms-conditions': {
    title: 'Terms & Conditions',
    date: 'Dec 4, 2019 21:42',
    text: `<h1>Terms & Conditions</h1><p>1. Acceptance of Terms</p>`,
  },
  'about-us': {
    title: 'About Us',
    date: 'Dec 4, 2019 21:42',
    text: `<h1>About Us</h1><p>Welcome to our company!</p>`,
  },
  // --- New Tabs Added Below ---
  'hiring': {
    title: 'Lawpantruck is hiring',
    date: 'Jan 14, 2026 10:00',
    text: `<h1>Careers</h1><p>Join our growing team at Lawpantruck.</p>`,
  },
  'insurance': {
    title: 'Insurance',
    date: 'Jan 14, 2026 10:00',
    text: `<h1>Insurance Policy</h1><p>Details regarding carrier insurance and coverage.</p>`,
  },
  'carrier-data': {
    title: 'Your Carrier Data',
    date: 'Jan 14, 2026 10:00',
    text: `<h1>Your Carrier Data</h1><p>Management and privacy of your logistics data.</p>`,
  },
};

const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

const SettingsPage = ({ onBackClick }) => {
  const editor = useRef(null);
  const [activeTab, setActiveTab] = useState('privacy-security');
  const [editableContent, setEditableContent] = useState('');
  const [tabContents, setTabContents] = useState(contentData);

  useEffect(() => {
    setEditableContent(tabContents[activeTab]?.text || '');
  }, [activeTab, tabContents]);

  const joditConfig = useMemo(() => ({
    readonly: false,
    spellcheck: false,
    buttons: 'undo,redo,|,bold,italic,underline,strikethrough,|,ul,ol,|,link,cut,copy,paste,|,align,|,source',
    theme: 'light',
    toolbarButtonSize: 'large',
  }), []);

  const handleSaveAndChange = () => {
    setTabContents(prev => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], text: editableContent },
    }));
    showConfirmation(`Content for "${tabContents[activeTab].title}" saved!`);
  };

  const showConfirmation = (message) => {
    const confirmDialog = document.createElement('div');
    confirmDialog.className = 'fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50';
    confirmDialog.innerHTML = `
      <div class="bg-white p-6 rounded-lg shadow-lg text-black">
        <p class="mb-4">${message}</p>
        <button id="confirmOkBtn" class="bg-cyan-400 hover:bg-cyan-300 text-white py-2 px-4 rounded-[4px] border-b-4 border-cyan-500">OK</button>
      </div>
    `;
    document.body.appendChild(confirmDialog);
    document.getElementById('confirmOkBtn').onclick = () => {
      document.body.removeChild(confirmDialog);
    };
  };

  return (
    <div className="bg-white rounded-2xl min-h-screen text-black p-6 sm:p-6 lg:p-8 font-inter">
      <div className="flex items-center mb-6">
        {onBackClick && (
          <button onClick={onBackClick} className="text-gray-600 hover:text-black mr-4" aria-label="Go back">
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
        )}
        <h1 className="text-2xl sm:text-3xl font-bold">Settings</h1>
      </div>

      <div className="border-b border-gray-300">
        <div className="md:w-full flex justify-start bg-gray-100 rounded-t-lg overflow-x-auto scrollbar-hide">
          {/* Updated the array below to include the new tab keys */}
          {['privacy-security', 'terms-conditions', 'about-us', 'hiring', 'insurance', 'carrier-data'].map((tabId) => (
            <button
              key={tabId}
              className={`flex-shrink-0 px-4 py-4 text-lg font-medium relative ${
                activeTab === tabId ? 'text-[#036BB4]' : 'text-gray-600 hover:text-black'
              }`}
              onClick={() => setActiveTab(tabId)}
            >
              {tabContents[tabId].title}
              {activeTab === tabId && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] -mb-[1px] bg-[#036BB4]"></span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-b-lg -mt-px">
        <>
          <h2 className="text-xl font-semibold mb-1">{tabContents[activeTab].title}</h2>
          <p className="text-sm text-gray-600 mb-4">{tabContents[activeTab].date}</p>
          <div className="rounded-md mb-6 py-2">
            <JoditEditor
              className="jodit-custom-theme"
              ref={editor}
              value={editableContent}
              config={joditConfig}
              onBlur={(newContent) => setEditableContent(newContent)} // Preferred over onChange for Jodit performance
              onChange={(newContent) => {}} 
            />
          </div>
        </>

        <div className="col-span-full mt-4">
          <button
            type="button"
            onClick={handleSaveAndChange}
            className="w-full mx-auto flex justify-center items-center rounded-[4px] bg-[#036BB4] text-white py-2 font-medium"
          >
            Save & Change
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;