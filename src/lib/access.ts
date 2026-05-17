import { redirect } from "next/navigation";
import { readSessionUser } from "@/lib/auth";

export async function requireUserPage() {
  const user = await readSessionUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function requireAdminPage() {
  const user = await requireUserPage();

  if (user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return user;
}
