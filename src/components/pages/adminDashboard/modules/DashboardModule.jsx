import React, { useState, useEffect } from "react";
import { Users, BookOpen, Star, BarChart3, TrendingUp } from "lucide-react";
import apiService from "../../services/api";

export default function DashboardModule() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalLearningMaterials: 0,
    totalReviews: 0,
    detectionAccuracy: 0,
    userGrowth: 0,
    reviewGrowth: 0,
    materialsThisWeek: 0,
    accuracyImprovement: 0,
    materialsChartData: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await apiService.getDashboardStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const BarChart = ({ data }) => {
    if (!data || data.length === 0) return null;
    
    const maxValue = Math.max(...data.map(item => Math.max(item.materials, item.practices)));
    
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-r from-gray-700 to-gray-900 p-3 rounded-full">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Learning Materials Trends</h3>
            <p className="text-sm text-gray-600">Monthly overview of learning and practice materials</p>
          </div>
        </div>
        
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-gray-700">{item.month}</span>
                <div className="flex gap-4">
                  <span className="text-gray-700">Learning: {item.materials}</span>
                  <span className="text-gray-500">Practice: {item.practices}</span>
                </div>
              </div>
              <div className="flex gap-1 h-8">
                <div className="flex-1 bg-gray-100 rounded-l-md overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-gray-600 to-gray-700 transition-all duration-1000 ease-out"
                    style={{ width: `${(item.materials / maxValue) * 100}%` }}
                  ></div>
                </div>
                <div className="flex-1 bg-gray-100 rounded-r-md overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-gray-400 to-gray-500 transition-all duration-1000 ease-out"
                    style={{ width: `${(item.practices / maxValue) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center gap-6 mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full"></div>
            <span className="text-sm text-gray-600">Learning Materials</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Practice Materials</span>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-lg border animate-pulse">
              <div className="flex justify-between items-center mb-4">
                <div className="h-5 bg-gray-200 rounded w-24"></div>
                <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
              </div>
              <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
          ))}
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg border animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="space-y-4">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-lg border border-blue-200 hover:shadow-xl transition-all duration-300">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-blue-800">Total Users</h3>
            <div className="bg-blue-600 p-3 rounded-full">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
          <p className="text-3xl font-bold text-blue-900 mt-3">{stats.totalUsers.toLocaleString()}</p>
          <p className="text-sm text-green-600 mt-2 flex items-center">
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
              +{stats.userGrowth}% from last month
            </span>
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-xl shadow-lg border border-emerald-200 hover:shadow-xl transition-all duration-300">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-emerald-800">Learning Materials</h3>
            <div className="bg-emerald-600 p-3 rounded-full">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
          </div>
          <p className="text-3xl font-bold text-emerald-900 mt-3">{stats.totalLearningMaterials}</p>
          <p className="text-sm text-blue-600 mt-2 flex items-center">
            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
              +{stats.materialsThisWeek} new this week
            </span>
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-xl shadow-lg border border-amber-200 hover:shadow-xl transition-all duration-300">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-amber-800">Reviews</h3>
            <div className="bg-amber-600 p-3 rounded-full">
              <Star className="h-6 w-6 text-white" />
            </div>
          </div>
          <p className="text-3xl font-bold text-amber-900 mt-3">{stats.totalReviews}</p>
          <p className="text-sm text-green-600 mt-2 flex items-center">
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
              +{stats.reviewGrowth}% from last month
            </span>
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl shadow-lg border border-purple-200 hover:shadow-xl transition-all duration-300">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-purple-800">Detection Accuracy</h3>
            <div className="bg-purple-600 p-3 rounded-full">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
          </div>
          <p className="text-3xl font-bold text-purple-900 mt-3">{stats.detectionAccuracy}%</p>
          <p className="text-sm text-green-600 mt-2 flex items-center">
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
              +{stats.accuracyImprovement}% improvement
            </span>
          </p>
        </div>
      </div>
      
      <BarChart data={stats.materialsChartData} />
    </div>
  );
}