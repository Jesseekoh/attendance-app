import { ReactNode, useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { authClient, User } from '../lib/auth-client';
import { Session } from 'better-auth/types';

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>({} as User);
  const [session, setSession] = useState<Session | null>({} as Session);
  const [isLoading, setIsLoading] = useState(true);

  const { data } = authClient.useSession();
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (data) {
          setSession(data.session);
          setUser(data.user);
        } else {
          setUser(null);
          setSession(null);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    initializeAuth();
  }, []);
  if (isLoading) {
    return (
      <div className="min-h-svh w-full flex justify-center">
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    );
  }
  return (
    <AuthContext.Provider value={{ user, session, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
