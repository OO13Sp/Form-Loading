import { Form, useActionData, redirect } from "react-router-dom";
import { useForm, getFormProps } from "@conform-to/react";
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
import type { DataFunctionArgs } from "react-router-dom";
 
// Define Zod Schema
const Formschema = z.object({
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

// Server-Side Action Function
export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  console.log("Form Data Received:", Object.fromEntries(formData)); // Debugging

  const submission = parseWithZod(formData, { schema: Formschema });

  if (submission.status === "error") {
    console.log("Validation Errors:", submission.errors); // Debugging
    return submission.reply(); // Send validation errors back
  }

  console.log("Redirecting to /success");
  return redirect("/success");
}



export default function Component() {
  const lastSubmission = useActionData<typeof action>();

  const [form, fields] = useForm({
    id: "signUpForm",
    onValidate: ({ formData }) => parseWithZod(formData, { schema: Formschema }),
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
          <form {...getFormProps(form)} noValidate>
            {/* Name Field */}
            <div className="mb-4">
              <Label htmlFor={fields.name.id}>Name</Label>
              <Input
                type="text"
                id={fields.name.id}
                name={fields.name.name}
                aria-invalid={!fields.name.valid ? true : undefined}
                aria-describedby={
                  !fields.name.valid
                    ? `${fields.name.errorId} ${fields.name.descriptionId}`
                    : fields.name.descriptionId
                }
                 
              />
              <div id={fields.name.descriptionId}>Enter your full name.</div>
              {!fields.name.valid && (
                <div id={fields.name.errorId} className="text-sm text-red-500">
                  {fields.name.errors?.map((error, index) => (
                    <div key={index}>{error}</div>
                  ))}
                </div>
              )}
            </div>

            {/* Email Field */}
            <div className="mb-4">
              <Label htmlFor={fields.email.id}>Email</Label>
              <Input
                type="email"
                id={fields.email.id}
                name={fields.email.name}
                aria-invalid={!fields.email.valid ? true : undefined}
                aria-describedby={
                  !fields.email.valid
                    ? `${fields.email.errorId} ${fields.email.descriptionId}`
                    : fields.email.descriptionId
                }
                 
              />
              <div id={fields.email.descriptionId}>Enter a valid email address.</div>
              {!fields.email.valid && (
                <div id={fields.email.errorId} className="text-sm text-red-500">
                  {fields.email.errors?.map((error, index) => (
                    <div key={index}>{error}</div>
                  ))}
                </div>
              )}
            </div>

            {/* Password Field */}
            <div className="mb-4">
              <Label htmlFor={fields.password.id}>Password</Label>
              <Input
                type="password"
                id={fields.password.id}
                name={fields.password.name}
                aria-invalid={!fields.password.valid ? true : undefined}
                aria-describedby={
                  !fields.password.valid
                    ? `${fields.password.errorId} ${fields.password.descriptionId}`
                    : fields.password.descriptionId
                }
             
              />
              <div id={fields.password.descriptionId}>
                Must be at least 8 characters long and include uppercase, lowercase, a number, and a special character.
              </div>
              {!fields.password.valid && (
                <div id={fields.password.errorId} className="text-sm text-red-500">
                  {fields.password.errors?.map((error, index) => (
                    <div key={index}>{error}</div>
                  ))}
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="mb-4">
              <Label htmlFor={fields.confirmPassword.id}>Confirm Password</Label>
              <Input
                type="password"
                id={fields.confirmPassword.id}
                name={fields.confirmPassword.name}
                aria-invalid={!fields.confirmPassword.valid ? true : undefined}
                aria-describedby={
                  !fields.confirmPassword.valid
                    ? `${fields.confirmPassword.errorId} ${fields.confirmPassword.descriptionId}`
                    : fields.confirmPassword.descriptionId
                }
                defaultValue={fields.confirmPassword.initialValue}
              />
              <div id={fields.confirmPassword.descriptionId}>Re-enter your password.</div>
              {!fields.confirmPassword.valid && (
                <div id={fields.confirmPassword.errorId} className="text-sm text-red-500">
                  {fields.confirmPassword.errors?.map((error, index) => (
                    <div key={index}>{error}</div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button with Loading State */}
            <Button type="submit" className="w-full">
              Sign Up
            </Button>
          </form>
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
