import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="text-6xl font-extrabold text-[#1152d4]/20 mb-4">404</p>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">페이지를 찾을 수 없습니다</h1>
        <p className="text-slate-600 mb-8">
          요청하신 주소가 잘못되었거나 페이지가 이동되었을 수 있습니다.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-[#1152d4] hover:bg-blue-700 text-white font-medium rounded-full transition-colors"
          >
            홈으로
          </Link>
          <Link
            href="/chat"
            className="px-6 py-3 border border-slate-300 text-slate-700 font-medium rounded-full hover:bg-slate-50 transition-colors"
          >
            AI 챗봇 체험
          </Link>
        </div>
      </div>
    </main>
  );
}
