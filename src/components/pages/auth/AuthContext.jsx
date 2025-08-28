/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from "react";
import apiService from "../services/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    try {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");

      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
        apiService.setAuthToken(token);
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await apiService.login(credentials);

      const userData = {
        id: response.id,
        email: response.email,
        role: response.role,
        roleName: response.roleName,
        token: response.token,
        isProMember: response.isProMember,
        proMembershipExpiry: response.proMembershipExpiry,
      };

      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(userData));

      return { success: true, user: userData };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      await apiService.register(userData);
      return { success: true };
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    apiService.logout();
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const isAdmin = () => {
    return user && user.roleName === "admin";
  };

  const isInstructor = () => {
    return (
      user && (user.roleName === "instructor" || user.roleName === "admin")
    );
  };

  const hasRole = (role) => {
    return user && user.roleName === role;
  };

  const isProMember = () => {
    if (!user || !user.isProMember) return false;
    
    // Check if membership has expired
    if (user.proMembershipExpiry) {
      const expiryDate = new Date(user.proMembershipExpiry);
      const currentDate = new Date();
      return currentDate <= expiryDate;
    }
    
    return user.isProMember;
  };

  const refreshUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token || !user) return;

      // Make a request to get updated user data
      const response = await fetch(`http://localhost:5001/api/user/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const userData = await response.json();
        const updatedUser = {
          ...user,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          profile: userData.profile,
          bio: userData.bio,
          location: userData.location,
          isProMember: userData.isProMember,
          proMembershipExpiry: userData.proMembershipExpiry,
          status: userData.status,
        };
        
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error("Error refreshing user data:", error);
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    isAdmin,
    isInstructor,
    isProMember,
    hasRole,
    checkAuthStatus,
    refreshUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};