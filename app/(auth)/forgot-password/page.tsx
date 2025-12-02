import { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth";

export const metadata: Metadata = {
  title: "Reset Password | Cleenly",
  description: "Reset your Cleenly account password",
};

export default function ForgotPasswordPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 text-center mb-8">
        Reset your password
      </h1>
      <ForgotPasswordForm />
    </div>
  );
}
