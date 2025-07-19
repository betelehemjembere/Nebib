"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

// Define the form schema with Zod
const formSchema = z
  .object({
    organizationName: z
      .string()
      .min(1, { message: "Organization name is required." })
      .min(2, { message: "Organization name must be at least 2 characters." }),
    adminName: z
      .string()
      .min(1, { message: "Admin name is required." })
      .min(2, { message: "Admin name must be at least 2 characters." }),
    adminEmail: z
      .string()
      .min(1, { message: "Email is required." })
      .email({ message: "Please enter a valid email address." }),
    password: z
      .string()
      .min(1, { message: "Password is required." })
      .min(8, { message: "Password must be at least 8 characters." }),
    confirmPassword: z
      .string()
      .min(1, { message: "Please confirm your password." })
      .min(8, { message: "Password must be at least 8 characters." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const RegisterPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organizationName: "",
      adminName: "",
      adminEmail: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      // Here you would typically send the data to your API
      console.log(values);
      // Simulate API call
   await authClient.signUp.email(
        {
          email: values.adminEmail,
          password: values.password,
          name: values.adminName,
          organizationName: values.organizationName,
          callbackURL: "/form-generator",
        } as any,
        {
          onSuccess: (ctx) => {
            router.push("/form-generator");
          },
        }
      );
    } catch (error) {
      console.error("Registration failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl space-y-8">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-2 mb-2">
            <Image
              src="/images/logo.svg"
              alt="NEBIB Logo"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <h1 className="text-2xl font-semibold text-gray-800">NEBIB</h1>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            Generate forms of your own
          </h2>
          <Link href="/" className="text-blue-600 hover:text-blue-700 hover:underline text-sm mt-2">
            ← Back to Landing Page
          </Link>
        </div>

        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <FormField
                control={form.control}
                name="organizationName"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1.5">
                    <Label className="text-sm font-medium text-gray-700">
                      Organization Name
                    </Label>
                    <FormControl>
                      <Input
                        placeholder="Example Org"
                        className="border-gray-300 rounded-md h-10 px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="adminName"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1.5">
                    <Label className="text-sm font-medium text-gray-700">
                      Admin Name
                    </Label>
                    <FormControl>
                      <Input
                        placeholder="John Doe"
                        className="border-gray-300 rounded-md h-10 px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="adminEmail"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1.5">
                    <Label className="text-sm font-medium text-gray-700">
                      Admin Email
                    </Label>
                    <FormControl>
                      <Input
                        placeholder="example@gmail.com"
                        className="border-gray-300 rounded-md h-10 px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1.5">
                    <Label className="text-sm font-medium text-gray-700">
                      Password
                    </Label>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="border-gray-300 rounded-md h-10 px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1.5">
                    <Label className="text-sm font-medium text-gray-700">
                      Confirm Password
                    </Label>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="border-gray-300 rounded-md h-10 px-4 focus:border-blue-500 transition-all duration-200 bg-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white h-10 mt-2 font-medium"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Registering..." : "Register Organization"}
              </Button>
            </form>
          </Form>

          <p className="text-gray-600 text-sm text-center mt-3">
            Already have an account?{" "}
            <Link className="text-blue-600 hover:text-blue-700 hover:underline" href="/sign-in">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
