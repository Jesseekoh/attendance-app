import { createContext, useContext } from 'react';

interface AuthContextType {
  user: any;
  session: any;
  isLoading: boolean;
}
export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);
export const useAuth = () => {
  return useContext(AuthContext);
};
