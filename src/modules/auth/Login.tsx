import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { useAuthApi } from './api';
import LoadingButton from '@/components/ui/loading-button';
import { useState } from 'react';

const formSchema = z.object({
  email: z.string().email({ message: 'Zła nazwa użytkownika' }),
  password: z.string().min(2, { message: 'Zła nazwa użytkownika' }),
});

export default function Login() {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { login } = useAuthApi();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      const response = await login(values);
      setLoading(false);
      const currentWorkspace = response.workspaces.filter(
        (workspace) => workspace.pivot.current
      );

      navigate(`/workspace/${currentWorkspace[0].id}`);
    } catch (error) {
      if (error instanceof Error) {
        form.setError('password', { message: 'Invalid email or password' });
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="flex flex-col items-center w-[400px] mx-auto px-10 py-8 shadow-xl border rounded-md">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-4"
          >
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
                  <FormMessage />
                </FormItem>
              )}
            />
            <LoadingButton
              loading={loading}
              variant="default"
              type="submit"
              className="w-full"
            >
              Login
            </LoadingButton>
          </form>
        </Form>
        <div className="my-4">
          <NavLink
            className="font-medium hover:underline"
            to={'/forgot'}
          >
            Forgot password?{' '}
          </NavLink>
          &#x2022;
          <NavLink
            className="font-medium hover:underline"
            to={'/register'}
          >
            {' '}
            Create an account.
          </NavLink>
        </div>
      </div>
    </div>
  );
}
