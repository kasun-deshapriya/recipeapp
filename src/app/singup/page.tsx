"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Search } from "lucide-react";

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
import { z } from "zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";

const formSchema = z
  .object({
    first_name: z.string().min(3, {
      message: "First Name must be at least 3 characters.",
    }),
    last_name: z.string().min(3, {
      message: "Last Name must be at least 3 characters.",
    }),
    email: z.string().email().min(6, {
      message: "Email must be at valid.",
    }),
    mobile: z.string().max(10).min(10, {
      message: "Mobile NUmber must be at 10 characters.",
    }),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters.",
    }),
    confirmPassword: z.string().min(6, {
      message: "Password must be at least 6 characters.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"], // Attach error to confirmPassword field
  });

export default function SingUpPage() {
  const api_url = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await axios.post(`${api_url}/singup-user`, values, {
        withCredentials: true,
      });

      if (response.status === 201 || response.status === 200) {
        toast("User has been created", {
          description: "User created sucessfull",
          action: {
            label: "Done",
            onClick: () => console.log("Done"),
          },
        });
         router.push("home");
      } else {
        throw new Error("Failed to create User");
      }
    } catch (error) {
      console.error("Error creating User:", error);
      toast("Failed to create User", {
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
      <div className="bg-white rounded-2xl shadow-xl w-[50%] p-20">
        <div className="flex justify-center mb-8">
          <div className="flex items-center justify-center mb-8">
            <span className="text-4xl font-bold text-[#FF4E79]">co</span>
            <Search size={32} className="text-[#FF4E79]" />
            <span className="text-4xl font-bold text-[#FF4E79]">k</span>
          </div>
        </div>

        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Register</h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First name</FormLabel>
                    <FormControl>
                      <Input placeholder="First name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last name</FormLabel>
                    <FormControl>
                      <Input placeholder="Last name" {...field} />
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
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="example@gmail.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mobile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone number</FormLabel>
                    <FormControl>
                      <Input placeholder="011 2222 333" {...field} />
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
                      <Input type="password" placeholder="••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-[50%] bg-red-500 hover:bg-red-600"
              >
                Create Account
              </Button>
            </div>
          </form>
        </Form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a href="login" className="text-red-500 hover:text-pink-600">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
