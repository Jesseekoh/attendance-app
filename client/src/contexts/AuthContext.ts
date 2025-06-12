import { Session, User } from '@/lib/auth-client';
import { createContext, useContext } from 'react';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
}
export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);
export const useAuth = () => {
  return useContext(AuthContext);
};
