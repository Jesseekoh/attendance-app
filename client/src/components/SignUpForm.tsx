import { Link, useNavigate } from 'react-router';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { authClient } from '../lib/auth-client';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axiosClient';

type SignUpFormInput = {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  departmentId: string;
  password: string;
  matricNumber?: string;
  level?: string;
};
const SignUpForm = ({ className, ...props }: React.ComponentProps<'form'>) => {
  const form = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      departmentId: '',
      password: '',
      matricNumber: '',
      level: '',
      role: 'student',
    },
  });

  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const resp = await api.get('/departments');
      return resp.data.data;
    },
  });

  const role = form.watch('role');
  const navigate = useNavigate();
  const onSubmit = async (data: SignUpFormInput) => {
    const { firstName, lastName, ...rest } = data;
    const fullName = firstName + ' ' + lastName;
    await authClient.signUp.email(
      {
        ...rest,
        name: fullName,
      },
      {
        onSuccess: (ctx) => {
          toast.success(ctx.response.statusText);
          navigate('/signin', { replace: true });
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
      }
    );
  };
  return (
    <>
      <Form {...form}>
        <form
          className={cn('flex flex-col gap-6', className)}
          {...props}
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold">Sign In to your account</h1>
            <p className="text-muted-foreground text-sm text-balance">
              Enter your email below to login to your account
            </p>
          </div>
          <div className="grid gap-6">
            <FormField
              control={form.control}
              name="firstName"
              rules={{
                required: 'Enter your first name',
                maxLength: {
                  value: 20,
                  message: 'First name must be 20 characters maximum',
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Mike" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              rules={{
                required: true,
                maxLength: {
                  value: 20,
                  message: 'First name must be 20 characters maximum',
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Ross" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              rules={{
                required: 'Enter your email',
                pattern: {
                  message: 'Enter a valid email',
                  value:
                    /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9-]*\.)+[a-z]{2,}$/i,
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="m@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="departmentId"
              rules={{ required: true }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select your department" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {departments &&
                        departments.map(
                          (item: { id: string; name: string }) => (
                            <SelectItem key={item.id} value={item.id}>
                              {item.name}
                            </SelectItem>
                          )
                        )}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    You can manage email addresses in your{' '}
                    <Link to="/examples/forms">email settings</Link>.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => {
                return (
                  <FormItem className="flex flex-row items-center gap-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value === 'teacher'}
                        onCheckedChange={(checked) => {
                          field.onChange(checked ? 'teacher' : 'student');
                        }}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">
                      Are you a teacher?
                    </FormLabel>
                  </FormItem>
                );
              }}
            />

            {role === 'student' && (
              <>
                <FormField
                  control={form.control}
                  name="matricNumber"
                  rules={{
                    required: {
                      value: role === 'student',
                      message: 'Enter your matric Number',
                    },
                    pattern: {
                      value: /^\d{2}\/\d{5}$/,
                      message: 'Matric number should follow 12/34567',
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Matric Number</FormLabel>
                      <FormControl>
                        <Input placeholder="12/34567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="level"
                  rules={{ required: role === 'student' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Level</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select your current level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="100">100</SelectItem>
                          <SelectItem value="200">200</SelectItem>
                          <SelectItem value="300">300</SelectItem>
                          <SelectItem value="400">400</SelectItem>
                          <SelectItem value="500">500</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        You can manage email addresses in your{' '}
                        <Link to="/examples/forms">email settings</Link>.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            <FormField
              control={form.control}
              name="password"
              rules={{
                required: 'Enter a valid password',
                minLength: {
                  value: 6,
                  message: 'Enter a password of at least 6 characters',
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Sign up
            </Button>
          </div>
          <div className="text-center text-sm">
            Already have an account?{' '}
            <Link to="/signin" className="underline underline-offset-4">
              Sign in
            </Link>
          </div>
        </form>
      </Form>
    </>
  );
};

export default SignUpForm;
