import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./pages/auth/AuthContext";
import { toast } from "sonner";
import { useEffect } from "react";

export default function ProtectedRoute({ 
  children, 
  allowedRoles = [], 
  blockedRoles = [],
  requireAuth = true 
}) {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Show toast for unauthorized access attempts
    if (!loading && isAuthenticated && user) {
      const userRole = user.roleName;
      
      if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
        toast.error(`Access denied: ${allowedRoles.join(', ')} access required`);
      }
      
      if (blockedRoles.length > 0 && blockedRoles.includes(userRole)) {
        toast.error(`Access denied: ${userRole} users cannot access this feature`);
      }
    }
  }, [user, allowedRoles, blockedRoles, loading, isAuthenticated]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // If authentication required but not authenticated -> force login
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user exists, check role restrictions
  if (user) {
    const userRole = user.roleName;
    
    // Check allowed roles
    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
      // Redirect based on user role
      const redirectPath = userRole === "admin" ? "/admin" : "/";
      return <Navigate to={redirectPath} replace />;
    }
    
    // Check blocked roles
    if (blockedRoles.length > 0 && blockedRoles.includes(userRole)) {
      // Redirect based on user role
      const redirectPath = userRole === "admin" ? "/admin" : "/";
      return <Navigate to={redirectPath} replace />;
    }
  }

  return children;
}

// Specific role-based route components
export function AdminRoute({ children }) {
  return (
    <ProtectedRoute allowedRoles={["admin", "instructor"]} blockedRoles={["user"]}>
      {children}
    </ProtectedRoute>
  );
}

export function UserRoute({ children }) {
  return (
    <ProtectedRoute allowedRoles={["user"]} blockedRoles={["admin", "instructor"]}>
      {children}
    </ProtectedRoute>
  );
}

export function PublicRoute({ children }) {
  return (
    <ProtectedRoute requireAuth={false}>
      {children}
    </ProtectedRoute>
  );
}