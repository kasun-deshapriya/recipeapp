"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z.string().email().min(2, {
    message: "Email must be at valid.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export default function LoginForm() {
  const api_url = process.env.NEXT_PUBLIC_API_URL;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const router = useRouter();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await axios.post(`${api_url}/login-user`, values, {
        withCredentials: true,
      });

      if (response.status === 201 || response.status === 200) {
        toast("Login Sucess", {
          description: "User Login sucessfull",
          action: {
            label: "Done",
            onClick: () => console.log("Done"),
          },
        });
        router.push("home");
      } else {
        throw new Error("Failed to Login User");
      }
    } catch (error) {
      console.error("Error Login User:", error);
      toast("Failed to Login User", {
        description: "Something went wrong!",
        action: {
          label: "Retry",
          onClick: () => onSubmit(values),
        },
      });
    }

    console.log(values);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8">
        <div className="flex items-center justify-center mb-8">
          <span className="text-4xl font-bold text-[#FF4E79]">co</span>
          <Search size={32} className="text-[#FF4E79]" />
          <span className="text-4xl font-bold text-[#FF4E79]">k</span>
        </div>

        <h1 className="text-2xl font-semibold text-gray-800 mb-8">Login</h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      {...field}
                      className="border-gray-300 focus:border-green-500"
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="********"
                      {...field}
                      className=" border-gray-300 focus:border-green-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg"
            >
              Sign In
            </Button>

            <p className="text-center text-sm text-gray-500">
              Don`t have an account?{" "}
              <a href="singup" className="text-red-500 hover:underline">
                Create an account
              </a>
            </p>
          </form>
        </Form>
      </div>
    </div>
  );
}
