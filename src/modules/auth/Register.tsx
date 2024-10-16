import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { useAuthApi } from './api';
import { NavLink, useNavigate } from 'react-router-dom';
import LoadingButton from '@/components/ui/loading-button';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

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
  const [loading, setLoading] = useState<boolean>(false);
  const { register, login } = useAuthApi();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      await register(values);
      const response = await login({
        email: values.email,
        password: values.password,
      });
      setLoading(false);

      const currentWorkspace = response.workspaces.filter(
        (workspace) => workspace.pivot.current
      );

      navigate(`/workspace/${currentWorkspace[0].id}/boards`);
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
            className="w-full space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="text"
                      {...field}
                      placeholder={t('register.form.username')}
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
                      placeholder={t('register.form.email')}
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
                      placeholder={t('register.form.password')}
                    />
                  </FormControl>
                  <FormDescription>
                    {t('register.form.passwordHint')}
                  </FormDescription>
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
                      placeholder={t('register.form.passwordConfirmation')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <LoadingButton
              loading={loading}
              className="w-full"
              variant="default"
            >
              {t('register.register')}
            </LoadingButton>
          </form>
        </Form>
        <NavLink
          to={'/login'}
          className="mt-2 hover:underline"
        >
          {t('register.back')}
        </NavLink>
      </div>
    </div>
  );
}
