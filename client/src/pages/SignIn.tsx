import { SquareCheckBig } from 'lucide-react';
import SignInForm from '../components/SignInForm';
import { useStore } from '../stores/appStore';
import { Navigate } from 'react-router';

const SignIn = () => {
  const { user } = useStore();

  if (user) return <Navigate to="/dashboard" />;
  return (
    <div className="grid place-items-center content-center min-h-svh font-[Inter]">
      <div>
        <h1 className="flex text-2xl font-bold items-center mb-4">
          <SquareCheckBig />
          CheckIn
        </h1>
      </div>
      <SignInForm />
    </div>
  );
};

export default SignIn;
