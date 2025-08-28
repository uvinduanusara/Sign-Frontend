import React from "react";
import {
  BarChart3,
  Users,
  BookOpen,
  Star,
  Settings,
  Menu,
  X,
  LogOut,
  User,
  Target,
} from "lucide-react";
import { useAuth } from "../auth/AuthContext";

export default function AdminSidebar({
  sidebarOpen,
  toggleSidebar,
  activeModule,
  setActiveModule,
}) {
  const { user, isAdmin, logout } = useAuth();
  return (
    <div
      className={`${
        sidebarOpen ? "w-64" : "w-20"
      } bg-gradient-to-b from-gray-900 to-black text-white transition-all duration-300 ease-in-out relative`}
    >
      <div className="p-4 flex items-center justify-between">
        {sidebarOpen && (
          <h1 className="text-xl font-bold">
            {user?.roleName === "instructor" ? "Instructor Panel" : "Admin Panel"}
          </h1>
        )}
        <button
          onClick={toggleSidebar}
          className="text-white focus:outline-none"
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <nav className="mt-6">
        {/* Sidebar Links */}
        {isAdmin() && (
          <div
            className={`flex items-center px-4 py-3 ${
              activeModule === "dashboard" ? "bg-gray-800" : "hover:bg-gray-800"
            } cursor-pointer`}
            onClick={() => setActiveModule("dashboard")}
          >
            <BarChart3 className="h-5 w-5" />
            {sidebarOpen && <span className="ml-3">Dashboard</span>}
          </div>
        )}

        {isAdmin() && (
          <div
            className={`flex items-center px-4 py-3 ${
              activeModule === "users" ? "bg-gray-800" : "hover:bg-gray-800"
            } cursor-pointer`}
            onClick={() => setActiveModule("users")}
          >
            <Users className="h-5 w-5" />
            {sidebarOpen && <span className="ml-3">User Management</span>}
          </div>
        )}

        {/* Learning Materials - Instructor only */}
        {user?.roleName === "instructor" && (
          <div
            className={`flex items-center px-4 py-3 ${
              activeModule === "materials" ? "bg-gray-800" : "hover:bg-gray-800"
            } cursor-pointer`}
            onClick={() => setActiveModule("materials")}
          >
            <BookOpen className="h-5 w-5" />
            {sidebarOpen && <span className="ml-3">Learning Materials</span>}
          </div>
        )}

        {/* Practice Materials - Instructor only */}
        {user?.roleName === "instructor" && (
          <div
            className={`flex items-center px-4 py-3 ${
              activeModule === "practice-materials" ? "bg-gray-800" : "hover:bg-gray-800"
            } cursor-pointer`}
            onClick={() => setActiveModule("practice-materials")}
          >
            <Target className="h-5 w-5" />
            {sidebarOpen && <span className="ml-3">Practice Materials</span>}
          </div>
        )}

        {isAdmin() && (
          <div
            className={`flex items-center px-4 py-3 ${
              activeModule === "reviews" ? "bg-gray-800" : "hover:bg-gray-800"
            } cursor-pointer`}
            onClick={() => setActiveModule("reviews")}
          >
            <Star className="h-5 w-5" />
            {sidebarOpen && <span className="ml-3">Reviews</span>}
          </div>
        )}
      </nav>

      {/* User Info Section */}
      <div className="absolute bottom-0 w-full p-4">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-gray-700 to-gray-900 flex items-center justify-center">
            <User className="h-5 w-5" />
          </div>
          {sidebarOpen && (
            <div className="ml-3">
              <p className="text-sm font-medium">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-400">{user?.email}</p>
            </div>
          )}
        </div>
        {sidebarOpen && (
          <button 
            onClick={logout}
            className="w-full mt-4 flex items-center justify-center text-sm text-gray-300 hover:text-white"
          >
            <LogOut className="h-4 w-4 mr-2" /> Logout
          </button>
        )}
      </div>
    </div>
  );
}
