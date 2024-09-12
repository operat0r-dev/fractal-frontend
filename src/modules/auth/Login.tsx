import { NavLink } from "react-router-dom"
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

const formSchema = z.object({
    email: z.string().email({ message: "Zła nazwa użytkownika" }),
    password: z.string().min(2, { message: "Zła nazwa użytkownika" })
  })

export default function Login() {
  const dispatch = useAppDispatch();
  const authData = useAppSelector((state) => state.authData);
  const { login } = useAuthApi();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const response = await login(values);

    console.log(values)
    dispatch(setUsername(response.data.username));
    dispatch(setPassword(response.data.password));
  }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          email: "",
          password: ""
        }
    })

    return (
      <div className="flex flex-col items-center max-w-[400px] space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
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
            <Button variant="default" type="submit" className="w-full">Login</Button>
          </form>
        </Form>
        <span>Don't have an account? <NavLink className="font-medium hover:underline" to={'/register'}>Register here.</NavLink></span>
      </div>
    )
}