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
 * @param {number} selectedMonth - Currently selected month (1-12)
 * @param {number} selectedYear - Currently selected year
 * @param {function} onMonthChange - Callback when month changes
 * @param {function} onYearChange - Callback when year changes
 * @param {string} currentMonthName - Current month name
 * @param {number} currentYear - Current year
 */
export default function MetricCard({ 
  title, 
  value, 
  percentageChange, 
  percentageDirection = 'up', 
  timePeriodData = [],
  selectedMonth,
  selectedYear,
  onMonthChange,
  onYearChange,
  currentMonthName,
  currentYear
}) {
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  
  // Generate years (current year and previous 2 years)
  const currentYearNum = new Date().getFullYear();
  const years = [currentYearNum, currentYearNum - 1, currentYearNum - 2];
  
  // Icons and directional colors
  const ChangeIcon = percentageDirection === 'up' ? ChevronUpIcon : ChevronDownIcon;
  
  // Using #036BB4 for positive change background (lightened) and icon/text
  const changeColor = percentageDirection === 'up' ? 'text-[#036BB4]' : 'text-red-600';
  const changeBg = percentageDirection === 'up' ? 'bg-blue-50' : 'bg-red-50';

  const handleMonthSelect = (month) => {
    if (onMonthChange) {
      const monthIndex = timePeriodData.indexOf(month);
      onMonthChange(monthIndex + 1); // Convert to 1-based month number
    }
    setIsMonthDropdownOpen(false);
  };

  const handleYearSelect = (year) => {
    if (onYearChange) {
      onYearChange(year);
    }
    setIsYearDropdownOpen(false);
  };

  return (
    <div 
      style={{ boxShadow: '0px 4px 14.7px 0px rgba(0, 0, 0, 0.1)' }} 
      className="w-full h-full bg-white p-6 border border-gray-100 rounded-xl flex flex-col justify-between"
    >
      {/* Header: Title and Dropdowns */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-gray-500 text-sm font-medium font-['Roboto']">{title}</h3>
        <div className="flex gap-2">
          {/* Month Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsMonthDropdownOpen(!isMonthDropdownOpen)}
              className="flex items-center space-x-2 px-3 py-1 bg-[#036BB4] rounded-full text-white text-xs font-semibold font-['DM Sans'] transition-all hover:bg-[#025a96] focus:outline-none"
            >
              <span>{currentMonthName || 'Month'}</span>
              {isMonthDropdownOpen ? (
                <ChevronUpIcon className="w-3 h-3 text-white" />
              ) : (
                <ChevronDownIcon className="w-3 h-3 text-white" />
              )}
            </button>

            {isMonthDropdownOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-xl z-20 border border-gray-100 py-1 max-h-60 overflow-y-auto">
                {timePeriodData.map((month) => (
                  <button
                    key={month}
                    onClick={() => handleMonthSelect(month)}
                    className={`block w-full text-left px-4 py-2 text-xs transition-colors ${
                      currentMonthName === month 
                        ? 'bg-blue-50 text-[#036BB4] font-semibold' 
                        : 'text-gray-700 hover:bg-blue-50 hover:text-[#036BB4]'
                    }`}
                  >
                    {month}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Year Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
              className="flex items-center space-x-2 px-3 py-1 bg-[#036BB4] rounded-full text-white text-xs font-semibold font-['DM Sans'] transition-all hover:bg-[#025a96] focus:outline-none"
            >
              <span>{currentYear || 'Year'}</span>
              {isYearDropdownOpen ? (
                <ChevronUpIcon className="w-3 h-3 text-white" />
              ) : (
                <ChevronDownIcon className="w-3 h-3 text-white" />
              )}
            </button>

            {isYearDropdownOpen && (
              <div className="absolute right-0 mt-2 w-24 bg-white rounded-lg shadow-xl z-20 border border-gray-100 py-1">
                {years.map((year) => (
                  <button
                    key={year}
                    onClick={() => handleYearSelect(year)}
                    className={`block w-full text-left px-4 py-2 text-xs transition-colors ${
                      currentYear === year 
                        ? 'bg-blue-50 text-[#036BB4] font-semibold' 
                        : 'text-gray-700 hover:bg-blue-50 hover:text-[#036BB4]'
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Value */}
      <div className="text-black text-3xl font-bold font-['Roboto'] mb-2">
        {value?.toLocaleString() || 0}
      </div>

      {/* Percentage Change Indicator */}
      <div className="flex items-center gap-2">
        <div className={`flex items-center gap-1 px-2 py-0.5 ${changeBg} rounded-full`}>
          <ChangeIcon className={`w-3 h-3 ${changeColor}`} strokeWidth={3} />
          <div className={`text-xs font-bold font-['DM Sans'] ${changeColor}`}>
            {Math.abs(percentageChange).toFixed(1)}%
          </div>
        </div>
        <span className="text-gray-400 text-xs font-normal font-['Roboto']">
          From previous period
        </span>
      </div>
    </div>
  );
}