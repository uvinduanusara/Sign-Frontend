import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./pages/auth/AuthContext";
import { toast } from "sonner";

// URL patterns that should be blocked for specific roles
const ROLE_RESTRICTIONS = {
  admin: {
    blocked: [
      /^\/learn/,
      /^\/practice/,
      /^\/detect/,
      /^\/userprofile/,
    ],
    allowed: [
      /^\/admin/,
      /^\/login/,
      /^\/signup/,
      /^\/$/,
    ]
  },
  instructor: {
    blocked: [
      /^\/learn/,
      /^\/practice/,
      /^\/detect/,
      /^\/userprofile/,
    ],
    allowed: [
      /^\/admin/,
      /^\/login/,
      /^\/signup/,
      /^\/$/,
    ]
  },
  user: {
    blocked: [
      /^\/admin/,
    ],
    allowed: [
      /^\/learn/,
      /^\/practice/,
      /^\/detect/,
      /^\/userprofile/,
      /^\/login/,
      /^\/signup/,
      /^\/$/,
    ]
  }
};

export default function URLGuard({ children }) {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const userRole = user.roleName;
    const currentPath = location.pathname;
    const restrictions = ROLE_RESTRICTIONS[userRole];

    if (!restrictions) return;

    // Check if current URL is blocked for this role
    const isBlocked = restrictions.blocked.some(pattern => pattern.test(currentPath));
    const isAllowed = restrictions.allowed.some(pattern => pattern.test(currentPath));

    if (isBlocked && !isAllowed) {
      toast.error(`Access denied: ${userRole} users cannot access ${currentPath}`);
      
      // Redirect to appropriate default page
      const redirectPath = (userRole === "admin" || userRole === "instructor") ? "/admin" : "/";
      navigate(redirectPath, { replace: true });
    }
  }, [location.pathname, user, isAuthenticated, navigate]);

  return children;
}

// // Hook for programmatic URL blocking
// export function useURLGuard() {
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   const checkURLAccess = (targetPath) => {
//     if (!user) return false;

//     const userRole = user.roleName;
//     const restrictions = ROLE_RESTRICTIONS[userRole];

//     if (!restrictions) return true;

//     const isBlocked = restrictions.blocked.some(pattern => pattern.test(targetPath));
//     const isAllowed = restrictions.allowed.some(pattern => pattern.test(targetPath));

//     if (isBlocked && !isAllowed) {
//       toast.error(`Access denied: ${userRole} users cannot access ${targetPath}`);
//       return false;
//     }

//     return true;
//   };

//   const navigateWithGuard = (targetPath) => {
//     if (checkURLAccess(targetPath)) {
//       navigate(targetPath);
//     } else {
//       // Redirect to appropriate default page
//       const redirectPath = (user?.roleName === "admin" || user?.roleName === "instructor") ? "/admin" : "/";
//       navigate(redirectPath, { replace: true });
//     }
//   };

//   return {
//     checkURLAccess,
//     navigateWithGuard
//   };
// }