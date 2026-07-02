import Link from "next/link";

export default function MethodPage() {
  return (
    <div className="min-h-screen bg-[#0a1628] px-6 py-20 max-w-2xl mx-auto">
      <p className="text-[10px] tracking-[0.25em] uppercase text-slate-500 mb-4">
        <Link href="/" className="hover:text-slate-300 transition-colors">← DDAT System</Link>
      </p>
      <h1 className="text-2xl font-semibold text-white mb-6">DDAT Method</h1>
      <p className="text-sm text-slate-400 leading-relaxed">
        Method documentation coming soon.
      </p>
    </div>
  );
}
