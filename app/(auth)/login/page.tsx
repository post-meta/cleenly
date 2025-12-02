import { Metadata } from "next";
import { LoginForm } from "@/components/auth";

export const metadata: Metadata = {
  title: "Sign In | Cleenly",
  description: "Sign in to your Cleenly account",
};

export default function LoginPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 text-center mb-8">
        Welcome back
      </h1>
      <LoginForm />
    </div>
  );
}
