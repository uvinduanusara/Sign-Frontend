import React from "react";
import { Users, BookOpen, Star, BarChart3 } from "lucide-react";

export default function DashboardModule() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-700">Total Users</h3>
          <Users className="h-6 w-6 text-gray-600" />
        </div>
        <p className="text-3xl font-bold text-gray-900 mt-2">1,248</p>
        <p className="text-sm text-green-500 mt-1">+12% from last month</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-700">Learning Materials</h3>
          <BookOpen className="h-6 w-6 text-gray-600" />
        </div>
        <p className="text-3xl font-bold text-gray-900 mt-2">84</p>
        <p className="text-sm text-green-500 mt-1">+5 new this week</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-700">Reviews</h3>
          <Star className="h-6 w-6 text-gray-600" />
        </div>
        <p className="text-3xl font-bold text-gray-900 mt-2">256</p>
        <p className="text-sm text-green-500 mt-1">+8% from last month</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-700">Detection Accuracy</h3>
          <BarChart3 className="h-6 w-6 text-gray-600" />
        </div>
        <p className="text-3xl font-bold text-gray-900 mt-2">96.7%</p>
        <p className="text-sm text-green-500 mt-1">+2.3% improvement</p>
      </div>
    </div>
  );
}