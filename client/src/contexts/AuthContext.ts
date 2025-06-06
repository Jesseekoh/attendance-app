import { createContext, useContext } from 'react';
import { User, Session } from '../lib/auth-client';

interface AuthContextType {
  user: User;
  session: Session;
  isLoading: boolean;
}
export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);
export const useAuth = () => {
  return useContext(AuthContext);
};
