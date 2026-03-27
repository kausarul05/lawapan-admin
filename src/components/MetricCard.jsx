// components/MetricCard.js
"use client";

import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

/**
 * A reusable card component to display a single metric.
 * @param {string} title - The title of the metric.
 * @param {number} value - The numerical value of the metric.
 * @param {number} percentageChange - The percentage change value.
 * @param {'up' | 'down'} percentageDirection - The direction of the change ('up' or 'down').
 * @param {string[]} timePeriodData - An array of strings for the dropdown options.
 */
export default function MetricCard({ 
  title, 
  value, 
  percentageChange, 
  percentageDirection = 'up', 
  timePeriodData = ['This Month', 'Last Month', 'Last 3 Months'] 
}) {
  const [selectedPeriod, setSelectedPeriod] = useState(timePeriodData[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Icons and directional colors
  const ChangeIcon = percentageDirection === 'up' ? ChevronUpIcon : ChevronDownIcon;
  
  // Using #036BB4 for positive change background (lightened) and icon/text
  const changeColor = percentageDirection === 'up' ? 'text-[#036BB4]' : 'text-red-600';
  const changeBg = percentageDirection === 'up' ? 'bg-blue-50' : 'bg-red-50';

  return (
    <div 
      style={{ boxShadow: '0px 4px 14.7px 0px rgba(0, 0, 0, 0.1)' }} 
      className="w-full h-full bg-white p-6 border border-gray-100 rounded-xl flex flex-col justify-between"
    >
      {/* Header: Title and Dropdown */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-gray-500 text-sm font-medium font-['Roboto']">{title}</h3>
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            // Updated background to #036BB4
            className="flex items-center space-x-2 px-3 py-1 bg-[#036BB4] rounded-full text-white text-xs font-semibold font-['DM Sans'] transition-all hover:bg-[#025a96] focus:outline-none"
          >
            <span>{selectedPeriod}</span>
            {isDropdownOpen ? (
              <ChevronUpIcon className="w-3 h-3 text-white" />
            ) : (
              <ChevronDownIcon className="w-3 h-3 text-white" />
            )}
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-xl z-20 border border-gray-100 py-1">
              {timePeriodData.map((period) => (
                <button
                  key={period}
                  onClick={() => {
                    setSelectedPeriod(period);
                    setIsDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-[#036BB4] text-xs transition-colors"
                >
                  {period}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Value */}
      <div className="text-black text-3xl font-bold font-['Roboto'] mb-2">
        {value.toLocaleString()}
      </div>

      {/* Percentage Change Indicator */}
      <div className="flex items-center gap-2">
        <div className={`flex items-center gap-1 px-2 py-0.5 ${changeBg} rounded-full`}>
          <ChangeIcon className={`w-3 h-3 ${changeColor}`} strokeWidth={3} />
          <div className={`text-xs font-bold font-['DM Sans'] ${changeColor}`}>
            {percentageChange}%
          </div>
        </div>
        <span className="text-gray-400 text-xs font-normal font-['Roboto']">From previous period</span>
      </div>
    </div>
  );
}