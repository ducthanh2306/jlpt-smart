"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleLogout() {
    if (pending) {
      return;
    }

    setPending(true);
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } finally {
      setPending(false);
      router.push("/login");
      router.refresh();
    }
  }

  return (
    <button type="button" className="btn btn-ghost" onClick={handleLogout} disabled={pending}>
      {pending ? "Dang thoat..." : "Dang xuat"}
    </button>
  );
}
