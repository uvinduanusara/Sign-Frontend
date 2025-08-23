import { Link, useLocation } from "react-router-dom"
import { Badge } from "./ui/badge"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { Crown, BookOpen, Camera, Trophy, Users, Sparkles, Home } from "lucide-react"

const Header = () => {
  const location = useLocation()
  const currentPath = location.pathname

  return (
    <header className="bg-gradient-to-r from-white/95 via-gray-50/90 to-gray-100/95 backdrop-blur-xl border-b border-gray-200/50 shadow-lg shadow-gray-100/50 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center space-x-4 group">
            <div className="relative">
              <div className="absolute inset-0 rounded-xl blur-sm opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
              <img
                src="/Sign.svg"
                alt="SignLearn AI Logo"
                className="relative w-18 h-18 object-contain drop-shadow-sm"
              />
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-black bg-clip-text text-transparent">
                SignLearn AI
              </h1>
              <p className="text-sm text-gray-600 font-medium">Interactive Sign Language Learning</p>
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
            <Badge
              variant="secondary"
              className="bg-gradient-to-r from-gray-100 via-gray-50 to-white text-gray-800 border border-gray-300/50 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 font-semibold px-3 py-1.5"
            >
              <Crown className="w-3.5 h-3.5 mr-1.5 text-gray-600" />
              Pro Member
            </Badge>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-400 to-black rounded-full blur-sm opacity-20 group-hover:opacity-40 transition-opacity duration-300 scale-110"></div>
              <Avatar className="relative ring-2 ring-white/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
                <AvatarFallback className="bg-gradient-to-br from-gray-800 to-black text-white font-bold text-sm">
                  JD
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header