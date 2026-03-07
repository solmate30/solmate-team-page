"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.error(error);
    }
  }, [error]);

  return (
    <main className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center px-6">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">문제가 발생했습니다</h1>
        <p className="text-slate-600 mb-8">
          일시적인 오류가 발생했습니다. 다시 시도해 주세요.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            type="button"
            onClick={reset}
            className="px-6 py-3 bg-[#1152d4] hover:bg-blue-700 text-white font-medium rounded-full transition-colors"
          >
            다시 시도
          </button>
          <Link
            href="/"
            className="px-6 py-3 border border-slate-300 text-slate-700 font-medium rounded-full hover:bg-slate-50 transition-colors text-center"
          >
            홈으로
          </Link>
        </div>
      </div>
    </main>
  );
}
