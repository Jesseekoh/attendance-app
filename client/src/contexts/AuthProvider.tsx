import { ReactNode, useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { authClient, User } from '../lib/auth-client';
import { Session } from 'better-auth/types';

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { data, isPending, error } = authClient.useSession();

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
    <AuthContext.Provider value={{ user, session, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
