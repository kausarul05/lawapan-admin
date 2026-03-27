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

const earningData = [
  { name: 'Jan', revenue: 11500 },
  { name: 'Feb', revenue: 13000 },
  { name: 'Mar', revenue: 10500 },
  { name: 'Apr', revenue: 9800 },
  { name: 'May', revenue: 10500 },
  { name: 'Jun', revenue: 11000 },
  { name: 'Jul', revenue: 13500 },
  { name: 'Aug', revenue: 11000 },
  { name: 'Sep', revenue: 10200 },
  { name: 'Oct', revenue: 10000 },
  { name: 'Nov', revenue: 10200 },
  { name: 'Dec', revenue: 10100 },
];

const formatYAxisTick = (value) => {
  if (value === 0) return '00k';
  return `${value / 1000}k`;
};

export default function EarningSummaryChart() {
  const [selectedYear, setSelectedYear] = useState('2024');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const years = ['2024', '2023', '2022'];

  return (
    <div style={{ boxShadow: '0px 4px 14.7px 0px rgba(0, 0, 0, 0.1)' }} className="w-full h-full p-5 bg-white rounded-lg flex flex-col justify-start items-center gap-5 text-black">
      <div className="w-full flex justify-between items-center">
        
        <div className="text-black text-lg font-semibold font-['Roboto']">Earning Summary</div>

        <div className="flex justify-center items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="text-gray-500 text-sm font-medium font-['DM Sans']">Yearly Revenue</div>
            <div className="flex justify-center items-center gap-1 px-2 py-0.5 bg-green-50 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="7" viewBox="0 0 10 7" fill="none">
                <path d="M1 5.5L4 2.5L6 4.5L9 1" stroke="#036BB4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-[#036BB4] text-xs font-bold">9%</span>
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
                    onClick={() => {
                      setSelectedYear(year);
                      setIsDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-black hover:bg-blue-50 hover:text-[#036BB4] text-sm transition-colors"
                  >
                    {year}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={earningData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis
              dataKey="name"
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
              domain={[0, 15000]}
            />
            <Tooltip
              cursor={{ fill: '#F3F4F6' }}
              contentStyle={{ 
                background: 'white', 
                border: 'none', 
                borderRadius: '8px', 
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
              }}
              labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
              itemStyle={{ color: '#036BB4' }} // Updated to match bar color
              formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
            />
            {/* Main Bar Color Update */}
            <Bar 
              dataKey="revenue" 
              fill="#036BB4" 
              barSize={32} 
              radius={[4, 4, 0, 0]} 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}