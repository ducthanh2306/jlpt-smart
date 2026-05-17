"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type AuthMode = "login" | "register";

type AuthFormProps = {
  mode: AuthMode;
};

type ApiResult = {
  ok?: boolean;
  error?: string;
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const isRegister = mode === "register";

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (pending) {
      return;
    }

    setError(null);
    setPending(true);

    try {
      const response = await fetch(isRegister ? "/api/auth/register" : "/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const json = (await response.json().catch(() => ({}))) as ApiResult;

      if (!response.ok || !json.ok) {
        setError(json.error ?? "Khong the xu ly yeu cau");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Loi ket noi den may chu");
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="panel rise mx-auto w-full max-w-md space-y-4 p-6 sm:p-7" onSubmit={onSubmit}>
      <div>
        <p className="chip">{isRegister ? "Tao tai khoan moi" : "Dang nhap he thong"}</p>
        <h1 className="mt-3 font-display text-2xl font-extrabold text-[color:var(--text-strong)]">
          {isRegister ? "Dang ky JLPT Smart" : "Chao mung quay lai"}
        </h1>
        <p className="mt-2 text-sm text-[color:var(--text-muted)]">
          {isRegister
            ? "Tao tai khoan de luyen de JLPT va theo doi tien bo cua ban."
            : "Dang nhap de tiep tuc luyen de va xem ket qua thi thu."}
        </p>
      </div>

      {isRegister ? (
        <label className="block space-y-1">
          <span className="text-sm text-[color:var(--text-muted)]">Ho ten</span>
          <input
            className="input"
            placeholder="Nguyen Van A"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            minLength={2}
          />
        </label>
      ) : null}

      <label className="block space-y-1">
        <span className="text-sm text-[color:var(--text-muted)]">Email</span>
        <input
          className="input"
          type="email"
          placeholder="you@email.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </label>

      <label className="block space-y-1">
        <span className="text-sm text-[color:var(--text-muted)]">Mat khau</span>
        <input
          className="input"
          type="password"
          placeholder="********"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          minLength={8}
        />
      </label>

      {error ? (
        <p className="rounded-lg border border-[#edc1c1] bg-[#fff0f0] px-3 py-2 text-sm text-[color:var(--danger)]">
          {error}
        </p>
      ) : null}

      <button className="btn btn-primary w-full" type="submit" disabled={pending}>
        {pending ? "Dang xu ly..." : isRegister ? "Dang ky" : "Dang nhap"}
      </button>
    </form>
  );
}
