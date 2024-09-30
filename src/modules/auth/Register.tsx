import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { useAuthApi } from './api';
import { NavLink, useNavigate } from 'react-router-dom';

const formSchema = z
  .object({
    name: z.string(),
    email: z.string().email({ message: 'Invalid e-mail address format' }),
    password: z.string().min(8, { message: 'Password has too few characters' }),
    password_confirmation: z.string(),
  })
  .superRefine(({ password, password_confirmation }, ctx) => {
    if (password_confirmation !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'Password confirmation differs from password',
        path: ['password_confirmation'],
      });
    }
  });

export default function Register() {
  const { register, login } = useAuthApi();
  const navigate = useNavigate();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await register(values);
      await login({ email: values.email, password: values.password });

      navigate('/settings');
    } catch {
      form.setError('email', {
        type: 'validate',
        message: 'E-mail address already exists',
      });
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
    },
  });

  return (
    <div className="auth-container">
      <div className="flex flex-col items-center w-[400px] mx-auto px-10 py-8 shadow-xl border rounded-md">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="text"
                      {...field}
                      placeholder="Username"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="text"
                      {...field}
                      placeholder="E-mail address"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="password"
                      {...field}
                      placeholder="Password"
                    />
                  </FormControl>
                  <FormDescription>Min 8 characters</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password_confirmation"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="password"
                      {...field}
                      placeholder="Password confirmation"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className="w-full"
              variant="default">
              Register
            </Button>
          </form>
        </Form>
        <NavLink
          to={'/login'}
          className="font-medium hover:underline">
          Back to login
        </NavLink>
      </div>
    </div>
  );
}
