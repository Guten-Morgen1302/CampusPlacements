import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { User } from "@shared/schema";

export function useAuth() {
  const queryClient = useQueryClient();
  
  const { data: user, isLoading, isError } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnMount: true,
    queryFn: async () => {
      const response = await fetch('/api/auth/user', {
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          return null; // Return null for unauthorized instead of throwing
        }
        throw new Error(`${response.status}: ${response.statusText}`);
      }
      
      return response.json();
    }
  });
  
  const loginMutation = useMutation({
    mutationFn: async (firebaseUser: any) => {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for session persistence
        body: JSON.stringify({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Login failed');
      }
      
      const data = await response.json();
      return data.user;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["/api/auth/user"], user);
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      // Force refetch to sync state
      setTimeout(() => {
        queryClient.refetchQueries({ queryKey: ["/api/auth/user"] });
      }, 100);
    },
  });

  return {
    user,
    isLoading: isLoading && !isError,
    isAuthenticated: !!user,
    loginWithFirebase: loginMutation.mutate,
  };
}
