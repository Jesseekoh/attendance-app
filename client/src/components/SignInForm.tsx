import { Link, useLocation, useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
// import { signIn } from '../utils/auth';
import { useStore } from '../stores/appStore';

const SignInSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'password must be at least 6 characters'),
});

type SignInFormType = z.infer<typeof SignInSchema>;

const SignInForm = () => {
  const location = useLocation();
  const previousUrl = location.state?.from || '/dashboard';
  console.log(previousUrl);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<SignInFormType>({ resolver: zodResolver(SignInSchema) });

  const { signIn } = useStore();
  const onSubmit = async ({ email, password }: SignInFormType) => {
    const loggedIn = await signIn({ email, password });
    if (loggedIn) {
      toast.success('Signed in successfully');
      navigate(previousUrl, { replace: true });
    } else {
      toast.error('Failed to sign in');
    }
  };
  const navigate = useNavigate();
  return (
    <>
      <div className="max-w-sm w-full px-4 py-8 rounded-md font-[Inter]">
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
