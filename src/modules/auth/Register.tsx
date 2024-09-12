import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { z } from "zod"
import { useAppDispatch, useAppSelector } from "@/hooks"
import { setPassword, setUsername } from "./slices/auth"
import { useAuthApi } from "./api"
import { NavLink } from "react-router-dom"

const formSchema = z.object({
    name: z.string(),
    email: z.string().email({ message: "Nieprawidłowy format adresu e-mail" }),
    password: z.string().min(8, { message: "Hasło ma za mało znaków" }),
    password_confirmation: z.string().min(8, { message: "Podane hasła różnią się" })
  })

export default function Register() {
  const dispatch = useAppDispatch();
  const authData = useAppSelector((state) => state.authData);
  const { register } = useAuthApi();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const response = await register(values);

    console.log(values)
    dispatch(setUsername(response.data.username));
    dispatch(setPassword(response.data.password));
  }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          name: "",
          email: "",
          password: "",
          password_confirmation: ""
        }
    })

    return (
      <div className="flex flex-col items-center max-w-[400px] space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
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
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password_confirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password confirmation</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" variant="default">Register</Button>
          </form>
        </Form>
        <NavLink to={'/login'} className="font-medium hover:underline">Back to login</NavLink>
      </div>
    )
}