import { Form, useActionData } from "react-router-dom";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { z } from "zod";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { redirect } from "react-router-dom";
// Define Zod Schema
const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must include an uppercase letter")
    .regex(/[a-z]/, "Password must include a lowercase letter")
    .regex(/[0-9]/, "Password must include a number")
    .regex(/[@$!%*?&#]/, "Password must include a special character"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords must match",
});

// Type for schema
type Schema = z.infer<typeof schema>;

// Server-Side Action Function
export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema });

  if (submission.status !== "success") {
    return { errors: submission.errors };
  }

  // Handle successful form submission (e.g., create user)
  return redirect("/success");
}

export default function Component() {
  const lastSubmission = useActionData<{ errors?: Record<string, string[]>; success?: boolean }>();

  const [form, fields] = useForm<Schema>({
    id: "signUpForm",
    schema,
    lastSubmission,
    onValidate: ({ formData }) => parseWithZod(formData, { schema }),
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-6 bg-white shadow-md rounded-md">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>To get started, please enter your details below.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form method="post" id={form.id} onSubmit={form.onSubmit} noValidate>
            <div className="mb-4">
              <Label htmlFor={fields.name.id}>Name</Label>
              <Input
                type="text"
                id={fields.name.id}
                name={fields.name.name}
                defaultValue={fields.name.initialValue}
              />
              {fields.name.errors?.map((error, index) => (
                <p key={index} className="text-sm text-red-500">
                  {error}
                </p>
              ))}
            </div>
            <div className="mb-4">
              <Label htmlFor={fields.email.id}>Email</Label>
              <Input
                type="email"
                id={fields.email.id}
                name={fields.email.name}
                defaultValue={fields.email.initialValue}
              />
              {fields.email.errors?.map((error, index) => (
                <p key={index} className="text-sm text-red-500">
                  {error}
                </p>
              ))}
            </div>
            <div className="mb-4">
              <Label htmlFor={fields.password.id}>Password</Label>
              <Input
                type="password"
                id={fields.password.id}
                name={fields.password.name}
                defaultValue={fields.password.initialValue}
              />
              {fields.password.errors?.map((error, index) => (
                <p key={index} className="text-sm text-red-500">
                  {error}
                </p>
              ))}
            </div>
            <div className="mb-4">
              <Label htmlFor={fields.confirmPassword.id}>Confirm Password</Label>
              <Input
                type="password"
                id={fields.confirmPassword.id}
                name={fields.confirmPassword.name}
                defaultValue={fields.confirmPassword.initialValue}
              />
              {fields.confirmPassword.errors?.map((error, index) => (
                <p key={index} className="text-sm text-red-500">
                  {error}
                </p>
              ))}
            </div>
            <Button type="submit" className="w-full">
              Sign Up
            </Button>
          </Form>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-gray-500">
            Already have an account? <a href="/login" className="text-blue-500 underline">Log in</a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
