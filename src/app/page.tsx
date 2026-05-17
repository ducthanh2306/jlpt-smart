import Link from "next/link";
import { redirect } from "next/navigation";
import { readSessionUser } from "@/lib/auth";

const highlights = [
  {
    title: "Cham diem tu dong chuan JLPT",
    text: "He thong tu tinh LANGUAGE/READING/LISTENING, bao ket qua dat hay chua dat ngay khi nop bai.",
  },
  {
    title: "Luyen de da cap do N5 -> N1",
    text: "Hoc tu vung, ngu phap, doc hieu, nghe hieu theo cau truc thi that, do kho tang dan thong minh.",
  },
  {
    title: "Quan tri de linh hoat",
    text: "Admin co the tao/sua/xoa de, section, cau hoi, dap an va lien ket audio cho bai nghe.",
  },
];

export default async function Home() {
  const user = await readSessionUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-10 sm:px-6 sm:py-14">
      <section className="panel rise relative overflow-hidden px-6 py-10 sm:px-10 sm:py-14">
        <div className="pointer-events-none absolute -left-20 -top-20 h-52 w-52 rounded-full bg-[#ffe5a4]/70 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-16 -right-16 h-60 w-60 rounded-full bg-[#f6bf9d]/60 blur-2xl" />

        <div className="relative grid gap-8 lg:grid-cols-2 lg:items-center">
          <div className="space-y-5">
            <span className="chip">Smart JLPT Platform</span>
            <h1 className="font-display text-3xl font-extrabold leading-tight tracking-tight text-[color:var(--text-strong)] sm:text-5xl">
              Luyen de JLPT sieu toan nang,
              <br />
              nop bai la co diem ngay.
            </h1>
            <p className="max-w-xl text-sm leading-7 text-[color:var(--text-muted)] sm:text-base">
              JLPT Smart giup ban hoc nhanh hon bang cach phan tich ket qua tung phan va luu lich su
              thi thu. Giao dien toi uu cho ca desktop va mobile.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link href="/register" className="btn btn-primary">
                Bat dau mien phi
              </Link>
              <Link href="/login" className="btn btn-ghost">
                Da co tai khoan
              </Link>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="panel bg-[color:var(--surface-soft)] p-4">
              <p className="text-xs text-[color:var(--text-muted)]">Tong diem</p>
              <p className="mt-1 font-display text-3xl font-extrabold text-[color:var(--text-strong)]">/180</p>
            </div>
            <div className="panel bg-[color:var(--surface-soft)] p-4">
              <p className="text-xs text-[color:var(--text-muted)]">Muc tieu qua mon</p>
              <p className="mt-1 font-display text-3xl font-extrabold text-[color:var(--text-strong)]">&gt;= 90</p>
            </div>
            <div className="panel bg-[color:var(--surface-soft)] p-4 sm:col-span-2">
              <p className="text-xs text-[color:var(--text-muted)]">Danh gia thong minh</p>
              <p className="mt-1 text-sm leading-6 text-[color:var(--text)]">
                Tong hop ty le dung sai theo section va goi y uu tien hoc lai phan yeu.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {highlights.map((item, index) => (
          <article key={item.title} className="panel rise p-5" style={{ animationDelay: `${index * 100}ms` }}>
            <h2 className="font-display text-lg font-bold text-[color:var(--text-strong)]">{item.title}</h2>
            <p className="mt-2 text-sm leading-7 text-[color:var(--text-muted)]">{item.text}</p>
          </article>
        ))}
      </section>

      <section className="panel p-6 sm:p-8">
        <h2 className="font-display text-xl font-extrabold text-[color:var(--text-strong)] sm:text-2xl">
          Lo trinh su dung
        </h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-4">
            <p className="chip">B1</p>
            <p className="mt-3 text-sm font-semibold text-[color:var(--text-strong)]">Tao tai khoan</p>
            <p className="mt-1 text-sm text-[color:var(--text-muted)]">Dang ky va dang nhap trong 20 giay.</p>
          </div>
          <div className="rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-4">
            <p className="chip">B2</p>
            <p className="mt-3 text-sm font-semibold text-[color:var(--text-strong)]">Lam bai thi thu</p>
            <p className="mt-1 text-sm text-[color:var(--text-muted)]">Chon de, lam bai theo tung section nhu thi that.</p>
          </div>
          <div className="rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-4">
            <p className="chip">B3</p>
            <p className="mt-3 text-sm font-semibold text-[color:var(--text-strong)]">Nhan ket qua</p>
            <p className="mt-1 text-sm text-[color:var(--text-muted)]">Xem diem va phan tich dung/sai chi tiet de toi uu hoc tap.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
