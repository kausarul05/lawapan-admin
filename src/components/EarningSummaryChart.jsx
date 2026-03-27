// components/EarningSummaryChart.js
"use client";

import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

const formatYAxisTick = (value) => {
  if (value === 0) return '0';
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
  return value;
};

export default function EarningSummaryChart({ earningsData, selectedYear, onYearChange }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Generate years (current year and previous 2 years)
  const currentYear = new Date().getFullYear();
  const years = [currentYear, currentYear - 1, currentYear - 2];
  
  // Use earnings data from API or fallback to empty array
  const chartData = earningsData?.monthly || [];
  
  // Calculate total revenue for selected year
  const totalRevenue = earningsData?.total || 0;
  const percentageChange = earningsData?.percentageChange || 0;
  const isPositive = percentageChange >= 0;
  
  const handleYearSelect = (year) => {
    if (onYearChange) {
      onYearChange(year);
    }
    setIsDropdownOpen(false);
  };
  
  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100">
          <p className="font-bold text-gray-900 mb-1">{label}</p>
          <p className="text-[#036BB4] font-semibold">
            ${payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ boxShadow: '0px 4px 14.7px 0px rgba(0, 0, 0, 0.1)' }} className="w-full h-full p-5 bg-white rounded-lg flex flex-col justify-start items-center gap-5 text-black">
      <div className="w-full flex justify-between items-center flex-wrap gap-4">
        <div>
          <div className="text-black text-lg font-semibold font-['Roboto']">Earning Summary</div>
          <div className="flex items-center gap-2 mt-1">
            <div className="text-2xl font-bold text-[#036BB4]">
              ${totalRevenue.toLocaleString()}
            </div>
            <div className={`flex items-center gap-1 px-2 py-0.5 ${isPositive ? 'bg-green-50' : 'bg-red-50'} rounded-full`}>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="10" 
                height="7" 
                viewBox="0 0 10 7" 
                fill="none"
                className={isPositive ? 'rotate-0' : 'rotate-180'}
              >
                <path d="M1 5.5L4 2.5L6 4.5L9 1" stroke={isPositive ? "#036BB4" : "#EF4444"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className={`text-xs font-bold ${isPositive ? 'text-[#036BB4]' : 'text-red-500'}`}>
                {Math.abs(percentageChange)}%
              </span>
            </div>
            <span className="text-gray-400 text-xs">from last year</span>
          </div>
        </div>
        
        {/* Year Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2 px-3 py-1 bg-gray-50 border border-gray-200 rounded-full text-black text-sm font-medium hover:bg-gray-100 transition-colors"
          >
            <span>{selectedYear}</span>
            {isDropdownOpen ? <ChevronUpIcon className="w-3 h-3" /> : <ChevronDownIcon className="w-3 h-3" />}
          </button>
          
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-24 bg-white border border-gray-100 rounded-md shadow-xl z-20">
              {years.map((year) => (
                <button
                  key={year}
                  onClick={() => handleYearSelect(year)}
                  className={`block w-full text-left px-4 py-2 text-black hover:bg-blue-50 hover:text-[#036BB4] text-sm transition-colors ${
                    selectedYear === year ? 'bg-blue-50 text-[#036BB4] font-semibold' : ''
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="w-full h-64">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis
                dataKey="month"
                stroke="#A3A3A3"
                tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 400 }}
                axisLine={false}
                tickLine={false}
                dy={10}
              />
              <YAxis
                stroke="#A3A3A3"
                tickFormatter={formatYAxisTick}
                tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 400 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="amount" 
                fill="#036BB4" 
                barSize={32} 
                radius={[4, 4, 0, 0]} 
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-gray-500">No data available for {selectedYear}</p>
          </div>
        )}
      </div>
    </div>
  );
}