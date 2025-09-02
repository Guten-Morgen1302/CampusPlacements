import { useState, useEffect, useMemo } from 'react';
import { onAuthChange, signOutUser } from '@/lib/firebase';

export function useFirebaseAuth() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false); // Set to false to stop loading state

  // Don't run any authentication polling for now
  // useEffect(() => {
  //   const unsubscribe = onAuthChange(async (authUser: any | null) => {
  //     setUser(authUser);
  //     setIsLoading(false);
  //   });
  //   return () => unsubscribe();
  // }, []);

  const logout = async () => {
    try {
      await signOutUser();
      setUser(null);
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Memoize the return object to prevent unnecessary re-renders
  const authState = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    isLoading,
    logout
  }), [user, isLoading]);

  return authState;
}