import React from "react";
import { Bell } from "lucide-react";

export default function AdminHeader({ activeModule, user }) {
  return (
    <header className="bg-white shadow-sm">
      <div className="flex items-center justify-between p-4">
        <h1 className="text-2xl font-bold text-gray-800 capitalize">
          {activeModule === "dashboard"
            ? "Dashboard"
            : activeModule === "users"
            ? "User Management"
            : activeModule === "materials"
            ? "Learning Materials"
            : activeModule === "reviews"
            ? "Reviews"
            : "Settings"}
        </h1>
        <div className="flex items-center space-x-4">
          <button className="relative p-2 text-gray-600 hover:text-gray-900">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-gray-800 to-black flex items-center justify-center text-white text-sm font-bold">
              {user?.firstName?.[0]?.toUpperCase() || "A"}
            </div>
            <span className="ml-2 text-gray-700">
              {user?.firstName || "Admin"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
