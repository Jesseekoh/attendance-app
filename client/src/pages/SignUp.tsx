import SignUpForm from '../components/SignUpForm';
import { SquareCheckBig } from 'lucide-react';
const SignUp = () => {
  return (
    <div className="grid place-items-center content-center min-h-svh font-[Inter]">
      <div>
        <h1 className="flex text-2xl font-bold items-center mb-4 text-base-content">
          <SquareCheckBig />
          CheckIn
        </h1>
      </div>
      <SignUpForm />
    </div>
  );
};

export default SignUp;
