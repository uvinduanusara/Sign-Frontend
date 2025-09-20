import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import AppHeader from "./components/Header";
import SignLanguageDetector from "../src/components/pages/SignLanguageDetector";
import LearnPage from "../src/components/pages/LearnPage";
import PracticePage from "../src/components/pages/PracticePage";
import Home from "./components/pages/Home";
import Footer from "./components/Footer";
import Login from "./components/pages/auth/Login.";
import Signup from "./components/pages/auth/SignUp";
import UserProfilePage from "./components/pages/UserProfile";
import PurchaseMembership from "./components/pages/PurchaseMembership";
import MembershipSuccess from "./components/pages/MembershipSuccess";
import AdminPanel from "./components/pages/adminDashboard/AdminPanel";
import ReviewPage from "./components/pages/ReviewPage";
import { AdminRoute, UserRoute, PublicRoute, PublicNonAdminRoute } from "./components/ProtectedRoute";
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
          
          {/* Home page - Public access but block admins */}
          <Route 
            path="/" 
            element={
              <PublicNonAdminRoute>
                <div>
                  <AppHeader />
                  <Home />
                  <Footer />
                </div>
              </PublicNonAdminRoute>
            } 
          />
          
          {/* Reviews page - Public access for everyone */}
          <Route 
            path="/reviews" 
            element={
              <PublicRoute>
                <div>
                  <AppHeader />
                  <ReviewPage />
                  <Footer />
                </div>
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
          
          {/* User Routes (Require authentication, admins blocked) */}
          <Route
            path="/detect"
            element={
              <UserRoute>
                <div>
                  <AppHeader />
                  <SignLanguageDetector />
                  <Footer />
                </div>
              </UserRoute>
            }
          />
          <Route
            path="/learn"
            element={
              <UserRoute>
                <div>
                  <AppHeader />
                  <LearnPage />
                  <Footer />
                </div>
              </UserRoute>
            }
          />
          <Route
            path="/practice"
            element={
              <UserRoute>
                <div>
                  <AppHeader />
                  <PracticePage />
                  <Footer />
                </div>
              </UserRoute>
            }
          />
          <Route
            path="/userprofile"
            element={
              <UserRoute>
                <div>
                  <AppHeader />
                  <UserProfilePage />
                  <Footer />
                </div>
              </UserRoute>
            }
          />
          <Route
            path="/purchase-membership"
            element={
              <UserRoute>
                <div>
                  <AppHeader />
                  <PurchaseMembership />
                  <Footer />
                </div>
              </UserRoute>
            }
          />
          
          {/* Stripe Success Page */}
          <Route
            path="/membership/success"
            element={
              <UserRoute>
                <MembershipSuccess />
              </UserRoute>
            }
          />
      </Routes>
      <Toaster position="top-right" />
    </URLGuard>
  );
}

export default App;
