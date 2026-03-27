// app/admin/page.js
"use client";

import { useState, useEffect } from "react";
import MetricCard from "@/components/MetricCard";
import RegistrationTable from "@/components/RegistrationTable";
import EarningSummaryChart from "@/components/EarningSummaryChart";
import toast from "react-hot-toast";
import { adminAPI } from "@/lib/api";

const Admin = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Fetch stats when month or year changes
  useEffect(() => {
    fetchStats();
  }, [selectedMonth, selectedYear]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getDashboardStats(selectedMonth, selectedYear);
      
      if (response.success) {
        setStats(response.data);
      } else {
        toast.error(response.message || "Failed to fetch dashboard stats");
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
      toast.error(error.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-white w-full min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#036BB4] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white w-full min-h-screen">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
          {/* Total User Card */}
          {/* <MetricCard
            title="Total Users"
            value={stats?.totalUsers?.shipperCount || 0}
            percentageChange={stats?.earnings?.percentageChange || 0}
            percentageDirection="up"
            timePeriodData={months}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onMonthChange={setSelectedMonth}
            onYearChange={setSelectedYear}
            currentMonthName={months[selectedMonth - 1]}
            currentYear={selectedYear}
          /> */}

          {/* Total Transporter Card */}
          <MetricCard
            title="Total Transporters"
            value={stats?.totalUsers?.transporterCount || 0}
            percentageChange={stats?.earnings?.percentageChange || 0}
            percentageDirection="up"
            timePeriodData={months}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onMonthChange={setSelectedMonth}
            onYearChange={setSelectedYear}
            currentMonthName={months[selectedMonth - 1]}
            currentYear={selectedYear}
          />
          
          {/* Total Service Providers Card */}
          <MetricCard
            title="Total Service Providers"
            value={(stats?.totalUsers?.shipperCount || 0) + (stats?.totalUsers?.transporterCount || 0)}
            percentageChange={stats?.earnings?.percentageChange || 0}
            percentageDirection="up"
            timePeriodData={months}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onMonthChange={setSelectedMonth}
            onYearChange={setSelectedYear}
            currentMonthName={months[selectedMonth - 1]}
            currentYear={selectedYear}
          />
        </div>

        <div className="p-4">
          {/* Earning Summary Chart */}
          <div className="w-full">
            <EarningSummaryChart 
              earningsData={stats?.earnings}
              selectedYear={selectedYear}
              onYearChange={setSelectedYear}
            />
          </div>
        </div>

        <div className="p-4">
          <RegistrationTable />
        </div>
      </div>
    </>
  );
};

export default Admin;