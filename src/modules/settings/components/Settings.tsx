import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { useAppSelector } from '@/hooks';
import { Button } from '@/components/ui/button';
import { useSettingsApi } from '@/modules/settings/SettingsApi';

const formSchema = z.object({
  email: z.string().email({ message: 'Zła nazwa użytkownika' }),
  name: z.string().min(2, { message: 'Zła nazwa użytkownika' }),
});

const Settings = () => {
  const { user } = useAppSelector((state) => state.authData);
  const { updateUser } = useSettingsApi();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: user?.email,
      name: user?.name,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await updateUser(values);
    } catch (error) {
      form.setError('email', {
        type: 'validate',
        message: 'Email jest zajęty',
      });
    }
  };

  return (
    <div className="container">
      <h1 className="text-white">Settings</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-4">
            <div className="border rounded-lg h-[100px]">
              <div></div>
              <div></div>
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="text"
                      {...field}
                      placeholder="Email"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="text"
                      {...field}
                      placeholder="Full name"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <Button
            type="submit"
            variant={'default'}>
            Save changes
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Settings;
