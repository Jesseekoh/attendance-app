import { ReactNode, useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { authClient, User } from '../lib/auth-client';
import { Session } from 'better-auth/types';

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>({} as Session);
  const [isLoading, setIsLoading] = useState(true);

  const { data, isPending, error } = authClient.useSession();

  const logout = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            setUser(null);
            setSession(null);
          },
          onError: () => {
            console.log('Logout failed');
          },
        },
      });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  useEffect(() => {
    setSession(data?.session ?? null);
    setUser(data?.user ?? null);
    setIsLoading(isPending);
  }, [data, isPending, error]);
  if (isLoading) {
    return (
      <div className="min-h-svh w-full flex justify-center">
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    );
  }
  return (
    <AuthContext.Provider
      value={{ user, session, isLoading, logout, setUser, setSession }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
