import React, { useState } from "react";
import {
  Camera,
  User,
  Settings,
  Trophy,
  BookOpen,
  Clock,
  Star,
  Edit,
  Save,
  X,
  Eye,
  EyeOff,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  TrendingUp,
  Users,
  Activity,
  Bell,
  Shield,
  Globe,
  ChevronRight,
} from "lucide-react";

export default function UserProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const [profileData, setProfileData] = useState({
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    joinDate: "January 2024",
    bio: "Passionate about making technology accessible. Learning sign language to better communicate with the deaf community.",
  });

  const stats = [
    { label: "Signs Learned", value: "147", icon: <BookOpen className="h-5 w-5" /> },
    { label: "Practice Hours", value: "89", icon: <Clock className="h-5 w-5" /> },
    { label: "Accuracy Rate", value: "94%", icon: <TrendingUp className="h-5 w-5" /> },
    { label: "Streak Days", value: "23", icon: <Award className="h-5 w-5" /> },
  ];

  const recentActivity = [
    { action: "Completed 'Family Signs' lesson", time: "2 hours ago", icon: <BookOpen className="h-4 w-4" /> },
    { action: "Achieved 95% accuracy in practice", time: "1 day ago", icon: <Trophy className="h-4 w-4" /> },
    { action: "Started 'Advanced Gestures' module", time: "3 days ago", icon: <Star className="h-4 w-4" /> },
    { action: "Joined community discussion", time: "1 week ago", icon: <Users className="h-4 w-4" /> },
  ];

  const achievements = [
    { title: "First Steps", desc: "Completed your first lesson", earned: true },
    { title: "Quick Learner", desc: "Learned 50 signs in one month", earned: true },
    { title: "Consistent Practice", desc: "Practice for 7 days straight", earned: true },
    { title: "Accuracy Expert", desc: "Achieve 90% accuracy", earned: true },
    { title: "Community Helper", desc: "Help 10 other learners", earned: false },
    { title: "Master Signer", desc: "Learn 200+ signs", earned: false },
  ];

  const handleSave = () => {
    setIsEditing(false);
    // Save logic would go here
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset changes logic would go here
  };

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Profile Picture */}
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-2xl">
                SJ
              </div>
              <button className="absolute bottom-2 right-2 bg-white text-gray-800 rounded-full p-2 shadow-lg hover:scale-105 transition-transform duration-200">
                <Camera className="h-4 w-4" />
              </button>
            </div>

            {/* Profile Info */}
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {profileData.firstName} {profileData.lastName}
              </h1>
              <p className="text-xl text-gray-300 mb-4">Sign Language Learner</p>
              <div className="flex flex-col md:flex-row gap-4 text-gray-300">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {profileData.email}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {profileData.location}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Joined {profileData.joinDate}
                </div>
              </div>
            </div>

            {/* Edit Button */}
            <div>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-white text-gray-800 hover:bg-gray-100 px-6 py-3 font-semibold rounded-full shadow-lg hover:scale-105 transition-all duration-200 flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="bg-white text-gray-800 hover:bg-gray-100 px-4 py-2 font-semibold rounded-full shadow-lg hover:scale-105 transition-all duration-200 flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-gray-600 text-white hover:bg-gray-700 px-4 py-2 font-semibold rounded-full shadow-lg hover:scale-105 transition-all duration-200 flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 text-center hover:shadow-xl transition-shadow duration-300"
            >
              <div className="mx-auto w-12 h-12 bg-gradient-to-r from-gray-800 to-black rounded-full flex items-center justify-center text-white mb-3">
                {stat.icon}
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200">
              <div className="border-b border-gray-200">
                <nav className="flex">
                  {["overview", "activity", "achievements"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 py-4 px-6 text-center font-medium capitalize transition-colors duration-200 ${
                        activeTab === tab
                          ? "border-b-2 border-gray-800 text-gray-800"
                          : "text-gray-600 hover:text-gray-800"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {/* Overview Tab */}
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        About Me
                      </h3>
                      {isEditing ? (
                        <textarea
                          value={profileData.bio}
                          onChange={(e) => handleInputChange("bio", e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                          rows="4"
                        />
                      ) : (
                        <p className="text-gray-600 leading-relaxed">
                          {profileData.bio}
                        </p>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">
                          Learning Progress
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Basic Signs</span>
                            <span className="font-semibold text-gray-900">100%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-gradient-to-r from-gray-800 to-black h-2 rounded-full w-full"></div>
                          </div>
                        </div>
                        <div className="space-y-3 mt-4">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Intermediate</span>
                            <span className="font-semibold text-gray-900">65%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-gradient-to-r from-gray-800 to-black h-2 rounded-full w-2/3"></div>
                          </div>
                        </div>
                        <div className="space-y-3 mt-4">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Advanced</span>
                            <span className="font-semibold text-gray-900">15%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-gradient-to-r from-gray-800 to-black h-2 rounded-full w-1/6"></div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">
                          Favorite Categories
                        </h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Family & Friends</span>
                            <Star className="h-4 w-4 text-yellow-500" />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Daily Activities</span>
                            <Star className="h-4 w-4 text-yellow-500" />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Emotions</span>
                            <Star className="h-4 w-4 text-gray-300" />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Numbers</span>
                            <Star className="h-4 w-4 text-yellow-500" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Activity Tab */}
                {activeTab === "activity" && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">
                      Recent Activity
                    </h3>
                    <div className="space-y-4">
                      {recentActivity.map((activity, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200"
                        >
                          <div className="w-10 h-10 bg-gradient-to-r from-gray-800 to-black rounded-full flex items-center justify-center text-white">
                            {activity.icon}
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-900 font-medium">
                              {activity.action}
                            </p>
                            <p className="text-gray-500 text-sm">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Achievements Tab */}
                {activeTab === "achievements" && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">
                      Achievements
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {achievements.map((achievement, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-lg border ${
                            achievement.earned
                              ? "bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200"
                              : "bg-gray-50 border-gray-200"
                          }`}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <Trophy
                              className={`h-6 w-6 ${
                                achievement.earned ? "text-yellow-600" : "text-gray-400"
                              }`}
                            />
                            <h4
                              className={`font-semibold ${
                                achievement.earned ? "text-gray-900" : "text-gray-500"
                              }`}
                            >
                              {achievement.title}
                            </h4>
                          </div>
                          <p
                            className={`text-sm ${
                              achievement.earned ? "text-gray-700" : "text-gray-500"
                            }`}
                          >
                            {achievement.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Personal Information */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Personal Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{profileData.firstName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{profileData.lastName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{profileData.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{profileData.phone}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{profileData.location}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                  <div className="flex items-center gap-3">
                    <Settings className="h-5 w-5" />
                    Account Settings
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </button>
                <button className="w-full flex items-center justify-between p-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5" />
                    Notifications
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </button>
                <button className="w-full flex items-center justify-between p-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5" />
                    Privacy & Security
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </button>
                <button className="w-full flex items-center justify-between p-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5" />
                    Language Preferences
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Learning Goals */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Learning Goals
              </h3>
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">Weekly Practice</span>
                    <span className="text-sm text-gray-600">5/7 days</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-gray-800 to-black h-2 rounded-full w-5/7" style={{width: '71%'}}></div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">Monthly Signs</span>
                    <span className="text-sm text-gray-600">28/30 signs</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-gray-800 to-black h-2 rounded-full" style={{width: '93%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}