import React, { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import { toast } from "sonner";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import DashboardModule from "./modules/DashboardModule";
import UsersModule from "./modules/UsersModule";
import MaterialsModule from "./modules/MaterialsModule";
import PracticeMaterialsModule from "./modules/PracticeMaterialsModule";
import ReviewsModule from "./modules/ReviewsModule";
import apiService from "../../pages/services/api.js";

export default function AdminPanel() {
  const { user, isAdmin, isInstructor } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  // Set default module based on user role - instructors start with materials
  const [activeModule, setActiveModule] = useState(
    user?.roleName === "instructor" ? "materials" : "dashboard"
  );
  
  // Data states
  const [users, setUsers] = useState([]);
  const [learningMaterials, setLearningMaterials] = useState([]);
  const [practiceMaterials, setPracticeMaterials] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
    totalMaterials: 0,
    totalReviews: 0,
    activeUsers: 0
  });

  // Loading states
  const [loading, setLoading] = useState({
    users: false,
    materials: false,
    practiceMaterials: false,
    reviews: false,
    dashboard: false
  });

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    if (!isAdmin() && !isInstructor()) {
      toast.error("Access denied. Admin or Instructor privileges required.");
      return;
    }
    
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    // Load materials only for instructors
    if (user?.roleName === "instructor") {
      await loadLearningMaterials();
    }
    
    // Load admin data only for admin users
    if (isAdmin()) {
      await Promise.all([
        loadDashboardStats(),
        loadUsers(),
        loadReviews(),
      ]);
    }
  };

  const loadDashboardStats = async () => {
    try {
      setLoading(prev => ({ ...prev, dashboard: true }));
      const stats = await apiService.getDashboardStats();
      setDashboardStats(stats);
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
      toast.error('Failed to load dashboard statistics');
    } finally {
      setLoading(prev => ({ ...prev, dashboard: false }));
    }
  };

  const loadUsers = async (params = {}) => {
    try {
      setLoading(prev => ({ ...prev, users: true }));
      const response = await apiService.getUsers(params);
      setUsers(response.data?.users || response.users || response);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(prev => ({ ...prev, users: false }));
    }
  };

  const loadLearningMaterials = async (params = {}) => {
    try {
      setLoading(prev => ({ ...prev, materials: true }));
      const response = await apiService.getLearningMaterials(params);
      setLearningMaterials(response.data?.materials || response.materials || response || []);
    } catch (error) {
      console.error('Error loading materials:', error);
      toast.error('Failed to load learning materials');
    } finally {
      setLoading(prev => ({ ...prev, materials: false }));
    }
  };

  const loadPracticeMaterials = async (params = {}) => {
    try {
      setLoading(prev => ({ ...prev, practiceMaterials: true }));
      const response = await apiService.getPracticeMaterials(params);
      setPracticeMaterials(response.data?.materials || response.materials || response || []);
    } catch (error) {
      console.error('Error loading practice materials:', error);
      toast.error('Failed to load practice materials');
    } finally {
      setLoading(prev => ({ ...prev, practiceMaterials: false }));
    }
  };

  const loadReviews = async (params = {}) => {
    try {
      setLoading(prev => ({ ...prev, reviews: true }));
      const response = await apiService.getReviews(params);
      setReviews(response.data?.reviews || response.reviews || response || []);
    } catch (error) {
      console.error('Error loading reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(prev => ({ ...prev, reviews: false }));
    }
  };

  const handleUserCreate = async (userData) => {
    try {
      await apiService.createUser(userData);
      toast.success('User created successfully');
      loadUsers();
      loadDashboardStats();
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error(error.message || 'Failed to create user');
    }
  };

  const handleUserUpdate = async (userId, userData) => {
    try {
      await apiService.updateUser(userId, userData);
      toast.success('User updated successfully');
      loadUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error(error.message || 'Failed to update user');
    }
  };

  const handleUserDelete = async (userId) => {
    try {
      await apiService.deleteUser(userId);
      toast.success('User deleted successfully');
      loadUsers();
      loadDashboardStats();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error(error.message || 'Failed to delete user');
    }
  };

  const handleMaterialCreate = async (materialData) => {
    try {
      console.log('Creating material with data:', materialData);
      const result = await apiService.createLearningMaterial(materialData);
      console.log('Material creation result:', result);
      toast.success('Learning material created successfully');
      loadLearningMaterials();
      loadDashboardStats();
    } catch (error) {
      console.error('Error creating material:', error);
      toast.error(error.message || 'Failed to create learning material');
    }
  };

  const handleMaterialUpdate = async (materialId, materialData) => {
    try {
      await apiService.updateLearningMaterial(materialId, materialData);
      toast.success('Learning material updated successfully');
      loadLearningMaterials();
    } catch (error) {
      console.error('Error updating material:', error);
      toast.error(error.message || 'Failed to update learning material');
    }
  };

  const handleMaterialDelete = async (materialId) => {
    try {
      await apiService.deleteLearningMaterial(materialId);
      toast.success('Learning material deleted successfully');
      loadLearningMaterials();
      loadDashboardStats();
    } catch (error) {
      console.error('Error deleting material:', error);
      toast.error(error.message || 'Failed to delete learning material');
    }
  };

  const handlePracticeMaterialCreate = async (materialData) => {
    try {
      console.log('Creating practice material with data:', materialData);
      const result = await apiService.createPracticeMaterial(materialData);
      console.log('Practice material creation result:', result);
      toast.success('Practice material created successfully');
      loadPracticeMaterials();
      loadDashboardStats();
    } catch (error) {
      console.error('Error creating practice material:', error);
      toast.error(error.message || 'Failed to create practice material');
    }
  };

  const handlePracticeMaterialUpdate = async (materialId, materialData) => {
    try {
      await apiService.updatePracticeMaterial(materialId, materialData);
      toast.success('Practice material updated successfully');
      loadPracticeMaterials();
    } catch (error) {
      console.error('Error updating practice material:', error);
      toast.error(error.message || 'Failed to update practice material');
    }
  };

  const handlePracticeMaterialDelete = async (materialId) => {
    try {
      await apiService.deletePracticeMaterial(materialId);
      toast.success('Practice material deleted successfully');
      loadPracticeMaterials();
      loadDashboardStats();
    } catch (error) {
      console.error('Error deleting practice material:', error);
      toast.error(error.message || 'Failed to delete practice material');
    }
  };

  const handleReviewStatusUpdate = async (reviewId, status) => {
    try {
      await apiService.updateReviewStatus(reviewId, status);
      toast.success('Review status updated successfully');
      loadReviews();
    } catch (error) {
      console.error('Error updating review status:', error);
      toast.error(error.message || 'Failed to update review status');
    }
  };

  const handleReviewDelete = async (reviewId) => {
    try {
      await apiService.deleteReview(reviewId);
      toast.success('Review deleted successfully');
      loadReviews();
      loadDashboardStats();
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error(error.message || 'Failed to delete review');
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const renderContent = () => {
    switch(activeModule) {
      case "dashboard":
        // Only admins can see dashboard
        return isAdmin() ? (
          <DashboardModule 
            stats={dashboardStats}
            loading={loading.dashboard}
            onRefresh={loadDashboardStats}
          />
        ) : (
          <div className="p-6 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to view the dashboard.</p>
          </div>
        );
      case "users":
        // Only admins can manage users
        return isAdmin() ? (
          <UsersModule 
            users={users} 
            loading={loading.users}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onUserCreate={handleUserCreate}
            onUserUpdate={handleUserUpdate}
            onUserDelete={handleUserDelete}
            onRefresh={() => loadUsers({ search: searchTerm })}
          />
        ) : (
          <div className="p-6 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to manage users.</p>
          </div>
        );
      case "materials":
        // Only instructors can manage learning materials
        return user?.roleName === "instructor" ? (
          <MaterialsModule 
            learningMaterials={learningMaterials} 
            loading={loading.materials}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            onMaterialCreate={handleMaterialCreate}
            onMaterialUpdate={handleMaterialUpdate}
            onMaterialDelete={handleMaterialDelete}
            onRefresh={() => loadLearningMaterials({ 
              search: searchTerm, 
              category: selectedCategory !== 'all' ? selectedCategory : undefined 
            })}
          />
        ) : (
          <div className="p-6 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
            <p className="text-gray-600">Only instructors can manage learning materials.</p>
          </div>
        );
      case "practice-materials":
        // Only instructors can manage practice materials
        return user?.roleName === "instructor" ? (
          <PracticeMaterialsModule />
        ) : (
          <div className="p-6 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
            <p className="text-gray-600">Only instructors can manage practice materials.</p>
          </div>
        );
      case "reviews":
        // Only admins can manage reviews
        return isAdmin() ? (
          <ReviewsModule 
            reviews={reviews} 
            loading={loading.reviews}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onReviewStatusUpdate={handleReviewStatusUpdate}
            onReviewDelete={handleReviewDelete}
            onRefresh={() => loadReviews({ search: searchTerm })}
          />
        ) : (
          <div className="p-6 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to manage reviews.</p>
          </div>
        );
      default:
        return (
          <DashboardModule 
            stats={dashboardStats}
            loading={loading.dashboard}
            onRefresh={loadDashboardStats}
          />
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar 
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        activeModule={activeModule}
        setActiveModule={setActiveModule}
      />
      
      <div className="flex-1 overflow-auto">
        <AdminHeader 
          activeModule={activeModule}
          user={user}
        />
        
        <main className="p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}