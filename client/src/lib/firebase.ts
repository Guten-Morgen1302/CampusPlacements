// Simple local authentication system for the platform
// This replaces Firebase for a more reliable local setup

// Predefined admin and recruiter accounts
const predefinedAccounts: Record<string, { password: string; role: string }> = {
  'admin@placenet.com': { password: 'admin123', role: 'admin' },
  'recruiter@placenet.com': { password: 'recruiter123', role: 'recruiter' }
};

// Get user role based on email
export const getUserRole = (email: string): string => {
  return predefinedAccounts[email]?.role || 'student';
};

// Authentication functions using local backend
export const signIn = async (email: string, password: string) => {
  try {
    // Check predefined accounts first
    const predefinedAccount = predefinedAccounts[email];
    if (predefinedAccount && password === predefinedAccount.password) {
      // Create a mock user object for predefined accounts
      const mockUser = {
        uid: `mock-${email.split('@')[0]}`,
        email: email,
        displayName: predefinedAccount.role === 'admin' ? 'Admin User' : 'Recruiter User'
      };
      
      // Send login request to backend
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          uid: mockUser.uid,
          email: mockUser.email,
          displayName: mockUser.displayName
        })
      });
      
      if (!response.ok) {
        throw new Error('Login failed');
      }
      
      return mockUser;
    }
    
    // For student accounts, create a simple mock user and try to authenticate
    const mockUser = {
      uid: `student-${Date.now()}`,
      email: email,
      displayName: email.split('@')[0]
    };
    
    // Send login request to backend
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        uid: mockUser.uid,
        email: mockUser.email,
        displayName: mockUser.displayName
      })
    });
    
    if (!response.ok) {
      throw new Error('Invalid credentials');
    }
    
    return mockUser;
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
};

export const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
  try {
    // Prevent signup for predefined admin/recruiter emails
    if (predefinedAccounts[email]) {
      throw new Error('This email is reserved. Please use the login option.');
    }
    
    // Create a mock user for student registration
    const mockUser = {
      uid: `student-${Date.now()}`,
      email: email,
      displayName: `${firstName} ${lastName}`
    };
    
    // Send registration request to backend
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        uid: mockUser.uid,
        email: mockUser.email,
        displayName: mockUser.displayName
      })
    });
    
    if (!response.ok) {
      throw new Error('Registration failed');
    }
    
    return mockUser;
  } catch (error) {
    throw error;
  }
};

export const signOutUser = async () => {
  try {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error('Logout failed');
    }
  } catch (error) {
    throw error;
  }
};

export const onAuthChange = (callback: (user: any | null) => void) => {
  // Simple one-time auth check without polling to avoid errors
  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/user', {
        credentials: 'include',
      });
      
      if (response.ok) {
        const user = await response.json();
        callback(user);
      } else {
        callback(null);
      }
    } catch (error) {
      callback(null);
    }
  };
  
  checkAuthStatus();
  
  // Return a no-op function since we're not setting up an interval
  return () => {};
};