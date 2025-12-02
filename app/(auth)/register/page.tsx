import { Metadata } from "next";
import { RegisterForm } from "@/components/auth";

export const metadata: Metadata = {
  title: "Create Account | Cleenly",
  description: "Create your Cleenly account to book cleaning services or start cleaning",
};

export default function RegisterPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 text-center mb-8">
        Create your account
      </h1>
      <RegisterForm />
    </div>
  );
}
