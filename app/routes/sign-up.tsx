import { useState } from "react";
import { useForm, getFormProps, getInputProps } from "@conform-to/react";
import { parseWithZod, getZodConstraint } from "@conform-to/zod";
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

// ✅ **Define Validation Schema using Zod**
const schema = z
  .object({
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
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords must match",
  });

// ✅ **Server-Side Action Function**
export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema });

  if (submission.status === "error") {
    return new Response(JSON.stringify({ errors: submission.errors }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  return redirect("/success");
}

// ✅ **Main Form Component**
export default function Component() {
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState(false);

  const [form, fields] = useForm({
    id: "signUpForm",
    constraint: getZodConstraint(schema),
    onValidate: ({ formData }) => parseWithZod(formData, { schema }),
    shouldValidate: "onBlur", // Validate when leaving the field
    shouldRevalidate: "onInput", // Validate while typing
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
              <p className="text-xs text-gray-500">Enter your full name.</p>
              <Input {...getInputProps(fields.name, { type: "text" })} />
              {fields.name.errors?.length ? (
                <div className="text-sm text-red-500">{fields.name.errors.join(", ")}</div>
              ) : null}
            </div>

            {/* Email Field */}
            <div className="mb-4">
              <Label htmlFor={fields.email.id}>Email</Label>
              <p className="text-xs text-gray-500">Enter a valid email address.</p>
              <Input {...getInputProps(fields.email, { type: "email" })} />
              {fields.email.errors?.length ? (
                <div className="text-sm text-red-500">{fields.email.errors.join(", ")}</div>
              ) : null}
            </div>

            {/* Password Field */}
            <div className="mb-4">
              <Label htmlFor={fields.password.id}>Password</Label>
              <p className="text-xs text-gray-500">
                Must be at least 8 characters long and include uppercase, lowercase, a number, and a special character.
              </p>
              <Input {...getInputProps(fields.password, { type: "password" })} />
              {fields.password.errors?.length ? (
                <div className="text-sm text-red-500">{fields.password.errors.join(", ")}</div>
              ) : null}
            </div>

            {/* Confirm Password Field */}
            <div className="mb-4">
              <Label htmlFor={fields.confirmPassword.id}>Confirm Password</Label>
              <p className="text-xs text-gray-500">Re-enter your password.</p>
              <Input {...getInputProps(fields.confirmPassword, { type: "password" })} />
              {fields.confirmPassword.errors?.length ? (
                <div className="text-sm text-red-500">{fields.confirmPassword.errors.join(", ")}</div>
              ) : null}
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full">Sign Up</Button>
          </form>

          {/* Display Error or Success Message */}
          {formError && <div className="text-sm text-red-500 mt-2">{formError}</div>}
          {formSuccess && <div className="text-sm text-green-500 mt-2">Form submitted successfully!</div>}
        </CardContent>
        <CardFooter>
          <p className="text-sm text-gray-500">
            Already have an account?{" "}
            <a href="/login" className="text-blue-500 underline">Log in</a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
