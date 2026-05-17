import { redirect } from "next/navigation";
import { readSessionUser } from "@/lib/auth";
import { AuthForm } from "@/components/auth-form";

export default async function LoginPage() {
  const user = await readSessionUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl items-center px-4 py-10 sm:px-6 sm:py-14">
      <AuthForm mode="login" />
    </div>
  );
}
