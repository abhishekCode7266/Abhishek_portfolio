import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-900">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-indigo-600 mb-4">404</h1>
        <h2 className="text-2xl font-medium mb-6">Page Not Found</h2>
        <Link href="/" className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors">
          Go Home
        </Link>
      </div>
    </div>
  );
}
