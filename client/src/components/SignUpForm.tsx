import { Link, useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useStore } from '../stores/appStore';
const SignUpSchema = z
  .object({
    firstName: z.string().min(3, 'First name must be at least 3 characters'),
    lastName: z.string().min(3, 'Last name must be at least 3 characters'),
    email: z.string().email('Enter a valid email'),
    role: z.enum(['student', 'teacher']),
    password: z.string().min(6, 'password must be at least 6 characters'),
    matricNumber: z
      .string()
      .regex(/^\d{2}\/\d{5}$/, 'Only numbers, and / are allowed'),
    level: z.enum(['100', '200', '300', '400', '500']).optional(),
    department: z.string().min(5),
  })
  .refine(
    (data) => {
      if (
        data.role === 'student' &&
        !(data.matricNumber && data.level && data.department)
      ) {
        return false;
      }

      return true;
    },
    {
      message: 'Matric Number, Level and Department is required for students',
      path: ['matricNumber', 'level', 'department'],
    }
  )
  .refine(
    (data) => {
      if (data.role === 'teacher' && !data.department) {
        return false;
      }
      return true;
    },
    { message: 'Department is required for teachers' }
  );

export type SignUpFormType = z.infer<typeof SignUpSchema>;

const SignUpForm = () => {
  const {
    register,
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormType>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      role: 'student',
    },
  });
  const role = watch('role');
  const navigate = useNavigate();
  const signUp = useStore((state) => state.signUp);

  const onSubmit = async ({
    email,
    password,
    firstName,
    lastName,
    role,
    matricNumber,
    department,
    level,
  }: SignUpFormType) => {
    const response = await signUp({
      email,
      password,
      firstName,
      lastName,
      role,
      matricNumber,
      department,
      level,
    });

    if (response?.success) {
      toast.success('Account created successfully');
      navigate('/signin');
      return;
    } else {
      toast.error(response?.message || 'An unexpected error occurred');
    }
  };
  return (
    <>
      <div className="max-w-sm w-full px-8 py-6 rounded-md font-[Inter]">
        <h1 className="text-xl font-semibold mb-3 text-center">
          Sign up for an account
        </h1>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="firstName" className="text-sm block">
              First Name
            </label>
            <input
              className="border-neutral-400 block w-full outline-transparent  aria-[invalid=true]:outline-error focus:outline-accent focus:outline-2 py-2 bg-base-300 rounded-md px-4"
              {...register('firstName', { required: true })}
              aria-invalid={errors.firstName ? 'true' : 'false'}
            />
            {errors.firstName && (
              <p role="alert" className="text-sm text-error">
                Enter a first name
              </p>
            )}
          </div>
          <div>
            <label htmlFor="lastName" className="text-sm block">
              Last Name
            </label>
            <input
              className="block w-full outline-transparent  aria-[invalid=true]:outline-error focus:outline-accent focus:outline-2 py-2 bg-base-300 rounded-md px-4"
              {...register('lastName', { required: true })}
              aria-invalid={errors.lastName ? 'true' : 'false'}
            />
            {errors.lastName && (
              <p role="alert" className="text-sm text-error">
                Enter a last name
              </p>
            )}
          </div>
          {/* EMAIL */}
          <div>
            <label htmlFor="email" className="text-sm block">
              Email
            </label>
            <input
              className="block w-full outline-transparent  aria-[invalid=true]:outline-error focus:outline-accent focus:outline-2 py-2 bg-base-300 rounded-md px-4"
              {...register('email', { required: true })}
              aria-invalid={errors.email ? 'true' : 'false'}
            />
            {errors.email && (
              <p role="alert" className="text-sm text-error">
                Enter a valid email
              </p>
            )}
          </div>

          {/* ROLE */}
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <div className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  defaultChecked
                  className="checkbox checkbox-accent"
                  checked={field.value === 'teacher'}
                  onChange={(e) =>
                    field.onChange(e.target.checked ? 'teacher' : 'student')
                  }
                />
                <label>I'm a teacher</label>
              </div>
            )}
          />

          {/* MATRIC NUMBER */}
          {role === 'student' && (
            <div>
              <label htmlFor="matricNumber" className="text-sm block">
                Matric Number
              </label>
              <input
                className="block w-full outline-transparent  aria-[invalid=true]:outline-error focus:outline-accent focus:outline-2 py-2 bg-base-300 rounded-md px-4"
                {...register('matricNumber', { required: true })}
                aria-invalid={errors.matricNumber ? 'true' : 'false'}
              />
              {errors.matricNumber && (
                <p role="alert" className="text-sm text-error">
                  {errors.matricNumber.message}
                </p>
              )}
            </div>
          )}
          {/* DEPARTMENT */}
          <div>
            <label htmlFor="department" className="text-sm block">
              Department
            </label>
            <input
              className="block w-full outline-transparent  aria-[invalid=true]:outline-error focus:outline-accent focus:outline-2 py-2 bg-base-300 rounded-md px-4"
              {...register('department', { required: true })}
              aria-invalid={errors.department ? 'true' : 'false'}
            />
            {errors.department && (
              <p role="alert" className="text-sm text-error">
                Enter your department
              </p>
            )}
          </div>
          {/* LEVEL */}
          <div>
            <label htmlFor="level" className="text-sm block">
              Level
            </label>
            <select
              className="block w-full outline-transparent  aria-[invalid=true]:outline-error py-2 bg-base-300 px-4 select select-accent"
              {...register('level', { required: true, minLength: 6 })}
              aria-invalid={errors.level ? 'true' : 'false'}
            >
              <option value="">Select your level</option>
              <option value="100">100</option>
              <option value="200">200</option>
              <option value="300">300</option>
              <option value="400">400</option>
              <option value="500">500</option>
            </select>
            {errors.level && (
              <p role="alert" className="text-sm text-error">
                {errors.level.message}
              </p>
            )}
          </div>
          {/* PASSWORD */}
          <div>
            <label htmlFor="password" className="text-sm block">
              Password
            </label>
            <input
              type="password"
              className="block w-full outline-transparent  aria-[invalid=true]:outline-error focus:outline-accent focus:outline-2 py-2 bg-base-300 rounded-md px-4"
              {...register('password', { required: true, minLength: 6 })}
              aria-invalid={errors.password ? 'true' : 'false'}
            />
            {errors.password && (
              <p role="alert" className="text-sm text-error">
                {errors.password.message}
              </p>
            )}
          </div>

          <p className="text-sm">
            Already have an account?{' '}
            <Link to={'/signin'} className="text-accent">
              Sign in
            </Link>
          </p>
          <button
            type="submit"
            className="bg-accent text-lg px-4 py-2 block text-accent-content rounded-md w-full mt-4"
          >
            Sign up
          </button>
        </form>
      </div>
    </>
  );
};

export default SignUpForm;
