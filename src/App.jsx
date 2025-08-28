import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import AppHeader from "./components/Header";
import SignLanguageDetector from "../src/components/pages/SignLanguageDetector";
import LearnPage from "../src/components/pages/LearnPage";
import PracticePage from "../src/components/pages/PracticePage";
import CommunityPage from "../src/components/pages/CommunityPage";
import Home from "./components/pages/Home";
import Footer from "./components/Footer";
import Login from "./components/pages/auth/Login.";
import Signup from "./components/pages/auth/SignUp";
import UserProfilePage from "./components/pages/UserProfile";
import PurchaseMembership from "./components/pages/PurchaseMembership";
import AdminPanel from "./components/pages/adminDashboard/AdminPanel";
import ProtectedRoute, { AdminRoute, UserRoute, PublicRoute } from "./components/ProtectedRoute";
import URLGuard from "./components/URLGuard";

function App() {
  return (
    <URLGuard>
      <Routes>
          {/* Public Routes */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          <Route 
            path="/signup" 
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            } 
          />
          
          {/* Admin-only Routes */}
          <Route 
            path="/admin/*" 
            element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            } 
          />
          
          {/* User Routes (Admins blocked from accessing these) */}
          <Route
            path="/*"
            element={
              <UserRoute>
                <div>
                  <AppHeader />
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/detect" element={<SignLanguageDetector />} />
                    <Route path="/learn" element={<LearnPage />} />
                    <Route path="/practice" element={<PracticePage />} />
                    <Route path="/community" element={<CommunityPage />} />
                    <Route path="/userprofile" element={<UserProfilePage />} />
                    <Route path="/purchase-membership" element={<PurchaseMembership />} />
                  </Routes>
                  <Footer />
                </div>
              </UserRoute>
            }
          />
      </Routes>
      <Toaster position="top-right" />
    </URLGuard>
  );
}

export default App;
