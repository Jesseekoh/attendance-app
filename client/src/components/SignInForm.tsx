import { Link, useLocation, useNavigate } from 'react-router';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { authClient } from '../lib/auth-client';
import toast from 'react-hot-toast';

const SignInSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'password must be at least 6 characters'),
});

type SignInFormType = z.infer<typeof SignInSchema>;

const SignInForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const previousUrl = location.state?.from.pathname || '/dashboard';
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<SignInFormType>({ resolver: zodResolver(SignInSchema) });

  const onSubmit = async ({ email, password }: SignInFormType) => {
    const { data, error } = await authClient.signIn.email(
      {
        email,
        password,
        // callbackURL: previousUrl,
      },
      {
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
        onSuccess: (ctx) => {
          toast.success(ctx.response.statusText);
          navigate(previousUrl, { replace: true });
        },
      }
    );
  };
  return (
    <>
      <div className="max-w-sm w-full px-8 py-6 rounded-md font-[Inter]">
        <h1 className="text-xl font-semibold mb-3 text-center">
          Sign In to your account
        </h1>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="email" className="text-sm block">
              Email
            </label>
            <input
              className="block w-full outline-2 outline-neutral-content aria-[invalid=true]:outline-error focus:outline-accent focus:bg-base-200 py-2 bg-base-300 rounded-md px-4"
              placeholder="Email"
              {...register('email', { required: true })}
              aria-invalid={errors.email ? 'true' : 'false'}
            />
            {errors.email && (
              <p role="alert" className="text-sm text-error">
                Enter a valid email
              </p>
            )}
          </div>
          <div>
            <label htmlFor="password" className="text-sm block">
              Password
            </label>
            <input
              className="block w-full outline-transparent  aria-[invalid=true]:outline-error focus:outline-accent focus:outline-2 py-2 bg-base-300 rounded-md px-4"
              {...register('password', { required: true, minLength: 6 })}
              type="password"
              placeholder="Password"
              aria-invalid={errors.password ? 'true' : 'false'}
            />
            {errors.password && (
              <p role="alert" className="text-sm text-error">
                {errors.password.message}
              </p>
            )}
          </div>
          <p className="text-sm">
            Don't have an account?{' '}
            <Link to={'/signup'} className="text-emerald-400">
              Sign up
            </Link>
          </p>
          <button
            type="submit"
            className="bg-neutral text-lg px-4 py-2 block text-neutral-content rounded-md w-full mt-4"
          >
            Sign in
          </button>
        </form>
      </div>
    </>
  );
};

export default SignInForm;
