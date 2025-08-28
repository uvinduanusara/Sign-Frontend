import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  Crown,
  BookOpen,
  Camera,
  Trophy,
  Users,
  Sparkles,
  Home,
  LogIn,
  LogOut,
} from "lucide-react";
import { useAuth } from "./pages/auth/AuthContext";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const { user, isAuthenticated, isProMember, logout, refreshUserData } = useAuth();

  // Refresh user data when component mounts to ensure pro status is current
  React.useEffect(() => {
    if (isAuthenticated && user) {
      refreshUserData();
    }
  }, [isAuthenticated, user?.id]); // Only refresh when user changes or authentication status changes

  const handleSignIn = () => {
    navigate("/login");
  };

  const handleSignOut = () => {
    logout();
    navigate("/");
  };

  // Get user's first initial for the avatar
  const getUserInitial = () => {
    if (user && user.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "U";
  };

  // Get user's display name
  const getDisplayName = () => {
    if (user && user.email) {
      return user.email.split("@")[0];
    }
    return "User";
  };

  return (
    <header className="bg-gradient-to-r from-white/95 via-gray-50/90 to-gray-100/95 backdrop-blur-xl border-b border-gray-200/50 shadow-lg shadow-gray-100/50 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center space-x-4 group">
            <div className="relative">
              <div className="absolute inset-0 rounded-xl blur-sm opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
              <img
                src="/Sign2.png"
                alt="SignLearn AI Logo"
                className="relative w-18 h-18 object-contain drop-shadow-sm"
              />
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-black bg-clip-text text-transparent">
                SignLearn AI
              </h1>
              <p className="text-sm text-gray-600 font-medium">
                Interactive Sign Language Learning
              </p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex items-center space-x-2">
            <Link
              to="/"
              className={`group flex items-center px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                currentPath === "/home" || currentPath === "/"
                  ? "text-white bg-gradient-to-r from-gray-800 to-black shadow-lg shadow-gray-500/25 border border-gray-500/20"
                  : "text-gray-700 hover:text-gray-900 hover:bg-white/60 hover:shadow-md hover:shadow-gray-100/50 border border-transparent hover:border-gray-200/50"
              }`}
            >
              <Home className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
              Home
            </Link>

            <Link
              to="/detect"
              className={`group flex items-center px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                currentPath === "/detect"
                  ? "text-white bg-gradient-to-r from-gray-800 to-black shadow-lg shadow-gray-500/25 border border-gray-500/20"
                  : "text-gray-700 hover:text-gray-900 hover:bg-white/60 hover:shadow-md hover:shadow-gray-100/50 border border-transparent hover:border-gray-200/50"
              }`}
            >
              <Camera className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
              Detect
            </Link>

            {isProMember() && (
              <Link
                to="/learn"
                className={`group flex items-center px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                  currentPath === "/learn"
                    ? "text-white bg-gradient-to-r from-gray-800 to-black shadow-lg shadow-gray-500/25 border border-gray-500/20"
                    : "text-gray-700 hover:text-gray-900 hover:bg-white/60 hover:shadow-md hover:shadow-gray-100/50 border border-transparent hover:border-gray-200/50"
                }`}
              >
                <BookOpen className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                Learn
              </Link>
            )}

            <Link
              to="/practice"
              className={`group flex items-center px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                currentPath === "/practice"
                  ? "text-white bg-gradient-to-r from-gray-800 to-black shadow-lg shadow-gray-500/25 border border-gray-500/20"
                  : "text-gray-700 hover:text-gray-900 hover:bg-white/60 hover:shadow-md hover:shadow-gray-100/50 border border-transparent hover:border-gray-200/50"
              }`}
            >
              <Trophy className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
              Practice
            </Link>

            <Link
              to="/community"
              className={`group flex items-center px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                currentPath === "/community"
                  ? "text-white bg-gradient-to-r from-gray-800 to-black shadow-lg shadow-gray-500/25 border border-gray-500/20"
                  : "text-gray-700 hover:text-gray-900 hover:bg-white/60 hover:shadow-md hover:shadow-gray-100/50 border border-transparent hover:border-gray-200/50"
              }`}
            >
              <Users className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
              Community
            </Link>
          </nav>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              // Authenticated user content
              <div className="flex items-center space-x-4">
                {isProMember() ? (
                  <Badge
                    variant="secondary"
                    className="bg-gradient-to-r from-gray-100 via-gray-50 to-white text-gray-800 border border-gray-300/50 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 font-semibold px-3 py-1.5"
                  >
                    <Crown className="w-3.5 h-3.5 mr-1.5 text-gray-600" />
                    Pro Member
                  </Badge>
                ) : (
                  <Link
                    to="/purchase-membership"
                    className="group flex items-center px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black shadow-md hover:shadow-lg border border-yellow-300"
                  >
                    <Crown className="w-4 h-4 mr-1.5 group-hover:rotate-12 transition-transform duration-300" />
                    Upgrade to Pro
                  </Link>
                )}

                <div className="flex items-center space-x-3">
                  <div className="text-right hidden md:block">
                    <p className="text-sm font-medium text-gray-800">
                      {getDisplayName()}
                    </p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>

                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-400 to-black rounded-full blur-sm opacity-20 group-hover:opacity-40 transition-opacity duration-300 scale-110"></div>
                    <Avatar className="relative ring-2 ring-white/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 cursor-pointer">
                      <AvatarFallback className="bg-gradient-to-br from-gray-800 to-black text-white font-bold text-sm">
                        {getUserInitial()}
                      </AvatarFallback>
                    </Avatar>

                    {/* Dropdown menu on hover */}
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-1 z-50 ">
                      <div className="py-2 px-4 border-b border-gray-100 justify-center items-center">
                        <p className="text-sm font-medium text-gray-800">
                          {getDisplayName()}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user?.email}
                        </p>
                      </div>
                      <div className="py-2">
                        <button
                          onClick={() => navigate("/userprofile")}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                        >
                          Profile
                        </button>
                      </div>
                      <div className="py-2 border-t border-gray-100">
                        <button
                          onClick={handleSignOut}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 flex items-center"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Sign-in button for non-authenticated users
              <button
                onClick={handleSignIn}
                className="group flex items-center px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-[#D9D9D9] to-[#D9D9D9] text-black shadow-lg shadow-gray-500/25 border border-black/30 hover:shadow-xl hover:shadow-gray-600/30"
              >
                <LogIn className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
