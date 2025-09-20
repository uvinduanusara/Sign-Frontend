import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Crown,
  BookOpen,
  Camera,
  Trophy,
  Sparkles,
  Home,
  LogIn,
  LogOut,
  Star,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "./pages/auth/AuthContext";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const { user, isAuthenticated, isProMember, logout, refreshUserData, isAdmin } = useAuth();

  // Refresh user data when component mounts to ensure pro status is current
  React.useEffect(() => {
    if (isAuthenticated && user) {
      refreshUserData();
    }
  }, [isAuthenticated, user?.id]); // Only refresh when user changes or authentication status changes

  const handleSignIn = () => {
    navigate("/login");
    setIsMobileMenuOpen(false);
  };

  const handleSignOut = () => {
    logout();
    navigate("/login");
    setIsMobileMenuOpen(false);
    setIsUserDropdownOpen(false);
  };

  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
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

  const navLinkClass = (path, currentPath) => {
    const isActive = currentPath === path || (path === "/" && (currentPath === "/home" || currentPath === "/"));
    return `group flex items-center px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
      isActive
        ? "text-white bg-gradient-to-r from-gray-800 to-black shadow-lg shadow-gray-500/25 border border-gray-500/20"
        : "text-gray-700 hover:text-gray-900 hover:bg-white/60 hover:shadow-md hover:shadow-gray-100/50 border border-transparent hover:border-gray-200/50"
    }`;
  };

  const mobileNavLinkClass = (path, currentPath) => {
    const isActive = currentPath === path || (path === "/" && (currentPath === "/home" || currentPath === "/"));
    return `group flex items-center px-6 py-4 text-base font-semibold transition-all duration-300 border-b border-gray-100 ${
      isActive
        ? "text-white bg-gradient-to-r from-gray-800 to-black"
        : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
    }`;
  };

  return (
    <header className="bg-gradient-to-r from-white/95 via-gray-50/90 to-gray-100/95 backdrop-blur-xl border-b border-gray-200/50 shadow-lg shadow-gray-100/50 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div 
            className={`flex items-center space-x-2 sm:space-x-4 group ${isAdmin() ? '' : 'cursor-pointer'}`}
            onClick={() => {
              if (!isAdmin()) {
                navigate("/");
                setIsMobileMenuOpen(false);
              }
            }}
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-xl blur-sm opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
              <img
                src="/Sign2.png"
                alt="SignLearn AI Logo"
                className="relative w-12 h-12 sm:w-18 sm:h-18 object-contain drop-shadow-sm"
              />
            </div>
            <div className="space-y-1">
              <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-black bg-clip-text text-transparent">
                SignLearn AI
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 font-medium hidden sm:block">
                Interactive Sign Language Learning
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2">
            {!isAdmin() && (
              <Link
                to="/"
                className={navLinkClass("/", currentPath)}
              >
                <Home className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                Home
              </Link>
            )}

            {!isAdmin() && (
              <>
                <Link
                  to="/detect"
                  className={navLinkClass("/detect", currentPath)}
                >
                  <Camera className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                  Detect
                </Link>

                {isProMember() && (
                  <Link
                    to="/learn"
                    className={navLinkClass("/learn", currentPath)}
                  >
                    <BookOpen className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                    Learn
                  </Link>
                )}

                <Link
                  to="/practice"
                  className={navLinkClass("/practice", currentPath)}
                >
                  <Trophy className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                  Practice
                </Link>
              </>
            )}

            {isAdmin() && (
              <Link
                to="/admin"
                className={navLinkClass("/admin", currentPath)}
              >
                <Sparkles className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                Admin
              </Link>
            )}

            <Link
              to="/reviews"
              className={navLinkClass("/reviews", currentPath)}
            >
              <Star className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
              Reviews
            </Link>
          </nav>

          {/* Desktop User Section */}
          <div className="hidden lg:flex items-center space-x-4">
            {isAuthenticated ? (
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
                  <div className="text-right hidden xl:block">
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

                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-1 z-50">
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
              <button
                onClick={handleSignIn}
                className="group flex items-center px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-[#D9D9D9] to-[#D9D9D9] text-black shadow-lg shadow-gray-500/25 border border-black/30 hover:shadow-xl hover:shadow-gray-600/30"
              >
                <LogIn className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                Sign In
              </button>
            )}
          </div>

          {/* Mobile User Section & Menu Button */}
          <div className="lg:hidden flex items-center space-x-2">
            {isAuthenticated && (
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-400 to-black rounded-full blur-sm opacity-20 scale-110"></div>
                  <Avatar className="relative ring-2 ring-white/50 shadow-lg transition-all duration-300 hover:scale-110">
                    <AvatarFallback className="bg-gradient-to-br from-gray-800 to-black text-white font-bold text-sm">
                      {getUserInitial()}
                    </AvatarFallback>
                  </Avatar>
                </button>

                {isUserDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="py-3 px-4 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-800">
                        {getDisplayName()}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user?.email}
                      </p>
                      {isProMember() && (
                        <Badge
                          variant="secondary"
                          className="mt-2 bg-gradient-to-r from-gray-100 via-gray-50 to-white text-gray-800 border border-gray-300/50 text-xs"
                        >
                          <Crown className="w-3 h-3 mr-1 text-gray-600" />
                          Pro Member
                        </Badge>
                      )}
                    </div>
                    {!isProMember() && (
                      <div className="py-2">
                        <Link
                          to="/purchase-membership"
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="w-full text-left px-4 py-3 text-sm bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold flex items-center"
                        >
                          <Crown className="w-4 h-4 mr-2" />
                          Upgrade to Pro
                        </Link>
                      </div>
                    )}
                    <div className="py-2">
                      <button
                        onClick={() => {
                          navigate("/userprofile");
                          setIsUserDropdownOpen(false);
                        }}
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
                )}
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute left-0 right-0 top-full bg-white border-b border-gray-200 shadow-lg">
            <nav className="py-2">
              {!isAdmin() && (
                <Link
                  to="/"
                  onClick={handleNavClick}
                  className={mobileNavLinkClass("/", currentPath)}
                >
                  <Home className="w-5 h-5 mr-3" />
                  Home
                </Link>
              )}

              {!isAdmin() && (
                <>
                  <Link
                    to="/detect"
                    onClick={handleNavClick}
                    className={mobileNavLinkClass("/detect", currentPath)}
                  >
                    <Camera className="w-5 h-5 mr-3" />
                    Detect
                  </Link>

                  {isProMember() && (
                    <Link
                      to="/learn"
                      onClick={handleNavClick}
                      className={mobileNavLinkClass("/learn", currentPath)}
                    >
                      <BookOpen className="w-5 h-5 mr-3" />
                      Learn
                    </Link>
                  )}

                  <Link
                    to="/practice"
                    onClick={handleNavClick}
                    className={mobileNavLinkClass("/practice", currentPath)}
                  >
                    <Trophy className="w-5 h-5 mr-3" />
                    Practice
                  </Link>
                </>
              )}

              {isAdmin() && (
                <Link
                  to="/admin"
                  onClick={handleNavClick}
                  className={mobileNavLinkClass("/admin", currentPath)}
                >
                  <Sparkles className="w-5 h-5 mr-3" />
                  Admin
                </Link>
              )}

              <Link
                to="/reviews"
                onClick={handleNavClick}
                className={mobileNavLinkClass("/reviews", currentPath)}
              >
                <Star className="w-5 h-5 mr-3" />
                Reviews
              </Link>

              {!isAuthenticated && (
                <div className="px-6 py-4 border-t border-gray-100">
                  <button
                    onClick={handleSignIn}
                    className="w-full flex items-center justify-center px-6 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#D9D9D9] to-[#D9D9D9] text-black shadow-lg border border-black/30"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>

      {/* Click outside to close dropdowns */}
      {(isMobileMenuOpen || isUserDropdownOpen) && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsMobileMenuOpen(false);
            setIsUserDropdownOpen(false);
          }}
        ></div>
      )}
    </header>
  );
};

export default Header;