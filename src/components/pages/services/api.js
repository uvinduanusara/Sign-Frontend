// src/services/api.js
const API_BASE_URL =
  import.meta.env.REACT_APP_API_BASE_URL || "http://localhost:5001/api";

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem("token");
  }

  setAuthToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }

  getAuthHeaders() {
    return {
      "Content-Type": "application/json",
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
    };
  }

  async request(endpoint, options = {}) {
    const token = localStorage.getItem("token");
    const url = `${this.baseURL}${endpoint}`;

    console.log(`API Request to: ${url}`);
    console.log('Request options:', options);

    // Always include Authorization header if token exists
    const headers = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
      console.log('Adding auth token to request');
    }

    // Only add Content-Type if not FormData (FormData sets its own boundary)
    if (!(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    } else {
      console.log('FormData detected, letting browser set Content-Type');
    }

    // Merge with any additional headers from options
    if (options.headers) {
      Object.assign(headers, options.headers);
    }

    const config = {
      ...options,
      headers,
    };

    console.log('Final request config headers:', config.headers);

    try {
      const response = await fetch(url, config);
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        console.error('API request failed:', data);
        throw new Error(data.message || "API request failed");
      }

      return data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  // Auth methods
  async login(credentials) {
    const response = await this.request("/user/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    if (response.token) {
      this.setAuthToken(response.token);
    }

    return response;
  }

  async register(userData) {
    return await this.request("/user", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async logout() {
    this.setAuthToken(null);
    localStorage.removeItem("user");
  }

  // User management methods
  async getUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await this.request(
      `/user/all${queryString ? `?${queryString}` : ""}`
    );
  }

  async createUser(userData) {
    return await this.request("/admin/users", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async updateUser(userId, userData) {
    return await this.request(`/admin/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(userId) {
    return await this.request(`/admin/users/${userId}`, {
      method: "DELETE",
    });
  }

  async getUserStats() {
    return await this.request("/admin/dashboard/stats");
  }

  // Learning materials methods
  async getLearningMaterials(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await this.request(
      `/admin/materials${queryString ? `?${queryString}` : ""}`
    );
  }

  async createLearningMaterial(materialData) {
    // Check if it's FormData (for file uploads) or regular JSON
    const isFormData = materialData instanceof FormData;
    
    const headers = isFormData ? {} : { "Content-Type": "application/json" };
    
    return await this.request("/admin/materials", {
      method: "POST",
      body: isFormData ? materialData : JSON.stringify(materialData),
      headers
    });
  }

  async updateLearningMaterial(materialId, materialData) {
    // Check if it's FormData (for file uploads) or regular JSON
    const isFormData = materialData instanceof FormData;
    
    const headers = isFormData ? {} : { "Content-Type": "application/json" };
    
    return await this.request(`/admin/materials/${materialId}`, {
      method: "PUT",
      body: isFormData ? materialData : JSON.stringify(materialData),
      headers
    });
  }

  async deleteLearningMaterial(materialId) {
    return await this.request(`/admin/materials/${materialId}`, {
      method: "DELETE",
    });
  }

  // Practice materials methods
  async getPracticeMaterials(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await this.request(
      `/admin/practice-materials${queryString ? `?${queryString}` : ""}`
    );
  }

  async createPracticeMaterial(materialData) {
    // Check if it's FormData (for file uploads) or regular JSON
    const isFormData = materialData instanceof FormData;
    
    const headers = isFormData ? {} : { "Content-Type": "application/json" };
    
    return await this.request("/admin/practice-materials", {
      method: "POST",
      body: isFormData ? materialData : JSON.stringify(materialData),
      headers
    });
  }

  async updatePracticeMaterial(materialId, materialData) {
    // Check if it's FormData (for file uploads) or regular JSON
    const isFormData = materialData instanceof FormData;
    
    const headers = isFormData ? {} : { "Content-Type": "application/json" };
    
    return await this.request(`/admin/practice-materials/${materialId}`, {
      method: "PUT",
      body: isFormData ? materialData : JSON.stringify(materialData),
      headers
    });
  }

  async deletePracticeMaterial(materialId) {
    return await this.request(`/admin/practice-materials/${materialId}`, {
      method: "DELETE",
    });
  }

  // Practice materials for users (public view)
  async getPublicPracticeMaterials(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await this.request(
      `/practice${queryString ? `?${queryString}` : ""}`
    );
  }

  async getPracticeMaterialById(practiceId) {
    return await this.request(`/practice/${practiceId}`);
  }

  async completePractice(practiceId, resultData) {
    return await this.request(`/practice/${practiceId}/complete`, {
      method: "POST",
      body: JSON.stringify(resultData),
    });
  }

  // Reviews methods
  async getReviews(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await this.request(
      `/admin/reviews${queryString ? `?${queryString}` : ""}`
    );
  }

  async updateReviewStatus(reviewId, status) {
    return await this.request(`/admin/reviews/${reviewId}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  }

  async deleteReview(reviewId) {
    return await this.request(`/admin/reviews/${reviewId}`, {
      method: "DELETE",
    });
  }

  // Dashboard stats
  async getDashboardStats() {
    return await this.request("/admin/dashboard/stats");
  }

  // Subscription methods
  async createSubscription(customerId) {
    return await this.request("/subscription/create", {
      method: "POST",
      body: JSON.stringify({ customerId }),
    });
  }

  // Role methods
  async getRoles() {
    return await this.request("/admin/roles");
  }

  // Lesson methods
  async getLessons() {
    return await this.request("/learn");
  }

  async getLessonById(lessonId) {
    return await this.request(`/learn/${lessonId}`);
  }

  async updateLessonProgress(lessonId, progressData) {
    return await this.request(`/learn/${lessonId}/progress`, {
      method: "POST",
      body: JSON.stringify(progressData),
    });
  }

  async getUserProgress() {
    return await this.request("/learn/user/progress");
  }

  // Pro Member Management
  async updateProMemberStatus(userId, proMemberData) {
    return await this.request(`/admin/users/${userId}/pro-status`, {
      method: "PATCH",
      body: JSON.stringify(proMemberData),
    });
  }

  async getProMembers(params = {}) {
    const queryParams = new URLSearchParams(params);
    const endpoint = `/admin/pro-members${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return await this.request(endpoint);
  }

  async purchaseProMembership(membershipData = {}) {
    return await this.request("/user/purchase-pro", {
      method: "POST",
      body: JSON.stringify(membershipData),
    });
  }
}

export default new ApiService();
