import Link from "next/link";
import { redirect } from "next/navigation";
import { requireUserPage } from "@/lib/access";
import { getAdminExamTree } from "@/lib/query";

export default async function AdminDashboardPage() {
  const user = await requireUserPage();
  if (user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const exams = await getAdminExamTree();

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10">
      <section className="panel p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-extrabold text-[color:var(--text-strong)] sm:text-3xl">
              Quan tri he thong JLPT
            </h1>
            <p className="mt-2 text-sm text-[color:var(--text-muted)]">
              Quan ly danh sach de thi, chi tiet cac phan va luot thi cua nguoi dung.
            </p>
          </div>
          <Link href="/admin/exam/new" className="btn btn-primary">
            + Tao de moi
          </Link>
        </div>
      </section>

      <section className="panel p-5 sm:p-6">
        <h2 className="font-display text-lg font-bold text-[color:var(--text-strong)] mb-4">Danh sach de thi</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead>
              <tr className="border-b border-[color:var(--line)] text-xs uppercase tracking-wide text-[color:var(--text-muted)]">
                <th className="pb-3 font-medium">Trang thai</th>
                <th className="pb-3 font-medium">Cap do</th>
                <th className="pb-3 font-medium">Ten de thi</th>
                <th className="pb-3 font-medium">Thoi gian (p)</th>
                <th className="pb-3 font-medium">Luot thi</th>
                <th className="pb-3 font-medium">Hanh dong</th>
              </tr>
            </thead>
            <tbody>
              {exams.map((exam) => (
                <tr key={exam.id} className="border-b border-[color:var(--line)]/50 last:border-0 hover:bg-[color:var(--surface-soft)]">
                  <td className="py-4 px-2">
                    {exam.published ? (
                      <span className="inline-flex rounded-full bg-[color:var(--success)]/10 px-2 py-1 text-xs font-bold text-[color:var(--success)]">
                        Cong khai
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full bg-[color:var(--text-muted)]/10 px-2 py-1 text-xs font-bold text-[color:var(--text-muted)]">
                        Ban nhap
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-2 font-bold text-[color:var(--text-strong)]">{exam.level}</td>
                  <td className="py-4 px-2 font-medium">{exam.title}</td>
                  <td className="py-4 px-2 text-[color:var(--text-muted)]">{exam.durationMinutes}</td>
                  <td className="py-4 px-2 text-[color:var(--text-muted)]">{exam._count.attempts}</td>
                  <td className="py-4 px-2">
                    <button type="button" className="text-[color:var(--text-muted)] hover:text-[#ddb259] font-medium transition mr-4">
                      Sua
                    </button>
                    <button type="button" className="text-[color:var(--danger)] hover:text-red-500 font-medium transition">
                      Xoa
                    </button>
                  </td>
                </tr>
              ))}
              
              {exams.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[color:var(--text-muted)]">
                    Chua co de thi nao trong he thong.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
