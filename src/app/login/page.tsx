import Link from "next/link";
import { LoginForm } from "@/components/login/login-form";
import { MOCK_TENANTS } from "@/services/mock/seed-data";

export default function LoginPage() {
  return (
    <div className="min-h-dvh bg-gradient-to-br from-blue-50 via-white to-teal-50 flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto w-full shrink-0">
        <Link href="/" className="text-2xl font-bold text-blue-700">
          OptiFlow
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 overflow-hidden">
        <LoginForm tenants={MOCK_TENANTS} />
      </main>
    </div>
  );
}
