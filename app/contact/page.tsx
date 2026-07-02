import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#0a1628] px-6 py-20 max-w-2xl mx-auto">
      <p className="text-[10px] tracking-[0.25em] uppercase text-slate-500 mb-4">
        <Link href="/" className="hover:text-slate-300 transition-colors">← DDAT System</Link>
      </p>
      <h1 className="text-2xl font-semibold text-white mb-6">Audit Collaboration</h1>
      <p className="text-sm text-slate-400 leading-relaxed mb-4">
        For research collaboration, audit enquiries, or governance integration discussions.
      </p>
      <a
        href="mailto:contact@platodesign.io"
        className="inline-flex items-center border border-slate-600 text-slate-300 text-sm px-6 py-3 hover:border-white hover:text-white transition-colors"
      >
        Send enquiry
      </a>
    </div>
  );
}
