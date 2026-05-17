import type { Metadata } from "next";
import Link from "next/link";
import { Manrope, Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { readSessionUser } from "@/lib/auth";
import { LogoutButton } from "@/components/logout-button";

const displayFont = Manrope({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const bodyFont = Noto_Sans_JP({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "JLPT Smart - Luyen de va cham diem tu dong",
  description:
    "Nen tang luyen de JLPT toan nang: dang nhap, thi thu, cham diem tu dong, phan tich ket qua thong minh.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await readSessionUser();

  return (
    <html lang="vi" className={`${displayFont.variable} ${bodyFont.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <header className="sticky top-0 z-40 border-b border-[color:var(--line)] bg-[color:var(--surface)]/95 backdrop-blur">
          <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6">
            <Link href="/" className="flex items-center gap-3 font-display">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[color:var(--accent)] text-sm font-extrabold text-[color:var(--accent-strong)]">
                J
              </span>
              <span className="text-base font-bold tracking-tight text-[color:var(--text-strong)]">
                JLPT Smart
              </span>
            </Link>

            <nav className="flex items-center gap-2 text-sm">
              {user ? (
                <>
                  <Link className="nav-link" href="/dashboard">
                    De thi
                  </Link>
                  {user.role === "ADMIN" ? (
                    <Link className="nav-link" href="/admin">
                      Admin
                    </Link>
                  ) : null}
                  <span className="hidden rounded-full border border-[color:var(--line)] bg-[color:var(--surface-soft)] px-3 py-1 text-xs text-[color:var(--text-muted)] sm:inline-flex">
                    {user.name}
                  </span>
                  <LogoutButton />
                </>
              ) : (
                <>
                  <Link className="nav-link" href="/login">
                    Dang nhap
                  </Link>
                  <Link className="btn btn-primary" href="/register">
                    Dang ky
                  </Link>
                </>
              )}
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
