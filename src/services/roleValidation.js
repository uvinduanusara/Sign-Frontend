import { toast } from "sonner";

// API endpoint access rules by role
const API_ACCESS_RULES = {
  admin: {
    allowed: [
      '/admin/*',
      '/api/role/*',
      '/api/user/all',
      '/api/learn', // Only for creating lessons
    ],
    blocked: [
      '/api/user/subscription',
      '/api/learn/*/progress',
      '/api/learn/user/progress',
      '/api/module', // Viewing modules (not managing)
    ]
  },
  user: {
    allowed: [
      '/api/learn/*',
      '/api/module/*',
      '/api/user/subscription',
    ],
    blocked: [
      '/api/user/all',
      '/admin/*',
      '/api/role/*',
    ]
  }
};

// Check if user role can access specific API endpoint
export function canAccessEndpoint(userRole, endpoint) {
  if (!userRole || !API_ACCESS_RULES[userRole]) {
    return false;
  }

  const rules = API_ACCESS_RULES[userRole];
  
  // Check if explicitly blocked
  const isBlocked = rules.blocked.some(pattern => {
    const regex = new RegExp(pattern.replace('*', '.*'));
    return regex.test(endpoint);
  });

  if (isBlocked) {
    return false;
  }

  // Check if explicitly allowed
  const isAllowed = rules.allowed.some(pattern => {
    const regex = new RegExp(pattern.replace('*', '.*'));
    return regex.test(endpoint);
  });

  return isAllowed;
}

// Interceptor for API calls to validate role access
export function validateAPIAccess(userRole, endpoint, method = 'GET') {
  if (!canAccessEndpoint(userRole, endpoint)) {
    const errorMsg = `Access denied: ${userRole} users cannot access ${endpoint}`;
    toast.error(errorMsg);
    
    throw new Error(errorMsg);
  }
}

// Enhanced API service wrapper with role validation
export function createRoleAwareAPI(apiService, user) {
  return new Proxy(apiService, {
    get(target, prop) {
      const originalMethod = target[prop];
      
      // Only intercept methods that make HTTP requests
      if (typeof originalMethod !== 'function') {
        return originalMethod;
      }

      return function(...args) {
        // Extract endpoint from method name and arguments
        let endpoint = '';
        
        switch(prop) {
          case 'getLessons':
            endpoint = '/api/learn';
            break;
          case 'getLessonById':
            endpoint = `/api/learn/${args[0]}`;
            break;
          case 'updateLessonProgress':
            endpoint = `/api/learn/${args[0]}/progress`;
            break;
          case 'getUserProgress':
            endpoint = '/api/learn/user/progress';
            break;
          case 'createUser':
            endpoint = '/api/admin/users';
            break;
          case 'getUsers':
            endpoint = '/api/user/all';
            break;
          case 'createSubscription':
            endpoint = '/api/user/subscription';
            break;
          default:
            // For other methods, let them pass through
            return originalMethod.apply(target, args);
        }

        // Validate access before making the call
        if (user && user.roleName) {
          try {
            validateAPIAccess(user.roleName, endpoint);
          } catch (error) {
            return Promise.reject(error);
          }
        }

        return originalMethod.apply(target, args);
      };
    }
  });
}

// Role-based navigation guard
export function validateNavigation(userRole, targetPath) {
  const restrictedPaths = {
    admin: ['/learn', '/practice', '/detect', '/community', '/userprofile'],
    user: ['/admin']
  };

  const userRestrictions = restrictedPaths[userRole] || [];
  
  const isRestricted = userRestrictions.some(path => 
    targetPath.startsWith(path)
  );

  if (isRestricted) {
    toast.error(`Navigation blocked: ${userRole} users cannot access ${targetPath}`);
    return false;
  }

  return true;
}