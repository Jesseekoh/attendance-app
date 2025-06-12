import { ReactNode, useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { authClient, User, Session } from '../lib/auth-client';

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>({} as User);
  const [session, setSession] = useState<Session>({} as Session);
  const [isLoading, setIsLoading] = useState(true);

  const { data, isPending, error } = authClient.useSession();

  useEffect(() => {
    if (data) {
      setSession(data.session);
      setUser(data.user);
    }
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
