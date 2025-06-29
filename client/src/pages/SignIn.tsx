import { SquareCheckBig } from 'lucide-react';
import { LoginForm } from '@/components/login-form';
import { Link } from 'react-router';
const SignIn = () => {
  return (
    <div className="grid min-h-svh lg:grid-cols-1">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link to="/" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <SquareCheckBig className="size-6" />
            </div>
            <div className="grid flex-1 text-left text-lg leading-tight">
              <span className="truncate font-bold">Check-in</span>
            </div>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
