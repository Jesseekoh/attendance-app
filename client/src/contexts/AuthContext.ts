import { Session, User } from '@/lib/auth-client';
import { createContext, useContext } from 'react';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
}
export const AuthContext = createContext<AuthContextType | undefined>(
  {} as AuthContextType
);
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context) return context;

  throw new Error('useAuth must be used within an AuthProvider');
};
