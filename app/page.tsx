import Link from "next/link";

const RED_SIGNALS = [
  { id: "R1", label: "No Re-entry" },
  { id: "R2", label: "No Contestability" },
  { id: "R3", label: "Responsibility Gap" },
  { id: "R4", label: "No Support Pathway" },
  { id: "R5", label: "Long-term Lock-in" },
  { id: "R6", label: "No Expiration" },
  { id: "R7", label: "No Human Review" },
  { id: "R8", label: "No System Revision" },
];

const CARDS = [
  {
    title: "Red Signal Framework",
    text: "Defines eight recurring risk conditions in adverse AI and institutional decisions: no re-entry, no contestability, responsibility gap, no support pathway, long-term lock-in, no expiration, no human review, and no system revision.",
  },
  {
    title: "Case Ledger",
    text: "Records cases in a unified format so that hiring AI, welfare AI, medical prediction AI, education scoring, credit systems, and platform ranking can be compared through the same audit structure.",
  },
  {
    title: "Pilot Evidence",
    text: "Converts case audits into cross-case comparison, evidence notes, and pilot reports for DDAT Journal and future governance implementation.",
  },
];

const FLOW_STEPS = [
  "Define Red Signals",
  "Record Cases",
  "Compare Cases",
  "Generate Evidence Notes",
  "Build Pilot Reports",
  "Prepare Governance Integration",
];

function SiteHeader() {
  return (
    <header className="border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 bg-[#0a1628] z-10">
      <span className="text-[11px] tracking-[0.25em] uppercase text-slate-400 font-medium">
        DDAT System
      </span>
      <nav className="flex items-center gap-6">
        <Link
          href="/method"
          className="text-xs text-slate-400 hover:text-white transition-colors"
        >
          Method
        </Link>
        <Link
          href="/contact"
          className="text-xs text-slate-400 hover:text-white transition-colors"
        >
          Contact
        </Link>
      </nav>
    </header>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a1628] flex flex-col">
      <SiteHeader />

      <main className="flex-1">

        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className="px-6 py-20 max-w-2xl mx-auto">
          <p className="text-[10px] tracking-[0.25em] uppercase text-slate-500 mb-5 font-medium">
            Decision Direction Audit Theory
          </p>
          <h1 className="text-3xl sm:text-4xl font-semibold text-white leading-tight mb-6">
            Evidence-first infrastructure for auditing the direction of AI and institutional decisions.
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed mb-4 max-w-xl">
            DDAT System is a Zero-PII decision audit infrastructure for detecting whether
            AI-driven or institutional adverse decisions close future possibility without
            re-entry, contestability, responsibility, support pathways, expiration,
            human review, or system revision.
          </p>
          <p className="text-sm text-slate-500 italic mb-1">It does not score people.</p>
          <p className="text-sm text-slate-500 italic mb-10">It audits decision architectures.</p>

          {/* Core messages */}
          <div className="border-l-2 border-slate-700 pl-5 space-y-2">
            <p className="text-xs text-slate-300">Evidence first. Then scale.</p>
            <p className="text-xs text-slate-500">We do not predict the future.</p>
            <p className="text-xs text-slate-500">
              We detect and document institutional risk conditions that close future possibility.
            </p>
          </div>
        </section>

        {/* ── Cards ────────────────────────────────────────────── */}
        <section className="border-t border-slate-800 px-6 py-14 max-w-2xl mx-auto">
          <p className="text-[10px] tracking-[0.2em] uppercase text-slate-600 mb-6 font-medium">
            Core Components
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            {CARDS.map((card) => (
              <div key={card.title} className="border border-slate-700 bg-[#0f1f3a] p-5">
                <p className="text-[10px] font-semibold text-white uppercase tracking-widest mb-3">
                  {card.title}
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">{card.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Red Signals ──────────────────────────────────────── */}
        <section className="border-t border-slate-800 px-6 py-14 max-w-2xl mx-auto">
          <p className="text-[10px] tracking-[0.2em] uppercase text-slate-600 mb-6 font-medium">
            Red Signal Conditions
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {RED_SIGNALS.map((s) => (
              <div key={s.id} className="flex items-center gap-2 border border-slate-700 px-3 py-2.5">
                <span className="text-[9px] font-mono text-red-500 shrink-0">{s.id}</span>
                <span className="text-[11px] text-slate-300">{s.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Audit Process ────────────────────────────────────── */}
        <section className="border-t border-slate-800 px-6 py-14 max-w-2xl mx-auto">
          <p className="text-[10px] tracking-[0.2em] uppercase text-slate-600 mb-6 font-medium">
            Audit Process
          </p>
          <div className="flex flex-wrap items-center gap-y-2">
            {FLOW_STEPS.map((step, i) => (
              <div key={step} className="flex items-center">
                <div className="flex items-center gap-2 border border-slate-700 px-3 py-2">
                  <span className="text-[9px] font-mono text-slate-600">{i + 1}</span>
                  <span className="text-[11px] text-slate-300">{step}</span>
                </div>
                {i < FLOW_STEPS.length - 1 && (
                  <span className="text-slate-700 text-xs px-1.5">→</span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── Design principles ────────────────────────────────── */}
        <section className="border-t border-slate-800 px-6 py-14 max-w-2xl mx-auto">
          <p className="text-[10px] tracking-[0.2em] uppercase text-slate-600 mb-6 font-medium">
            Design Principles
          </p>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { label: "Zero-PII", desc: "No personal data collected or stored. Audit targets are decision architectures, not individuals." },
              { label: "Evidence-First", desc: "Every judgment is grounded in documented evidence. Theoretical hypotheses are labelled as such." },
              { label: "Research Prototype", desc: "DDAT System is evidence-building infrastructure, not a certified or legally binding audit tool." },
            ].map((p) => (
              <div key={p.label}>
                <p className="text-xs font-semibold text-white uppercase tracking-widest mb-2">{p.label}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────── */}
        <section className="border-t border-slate-800 px-6 py-14 max-w-2xl mx-auto">
          <div className="flex flex-wrap gap-3">
            <Link
              href="/method"
              className="inline-flex items-center bg-white text-[#0a1628] text-sm font-medium px-6 py-3 hover:bg-slate-100 transition-colors"
            >
              View DDAT Method
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center border border-slate-600 text-slate-300 text-sm px-6 py-3 hover:border-white hover:text-white transition-colors"
            >
              Contact for Audit Collaboration
            </Link>
            <span className="inline-flex items-center border border-slate-800 text-slate-700 text-sm px-6 py-3 cursor-default select-none">
              DDAT Evidence Simulator — Coming Soon
            </span>
          </div>
        </section>

      </main>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer className="border-t border-slate-800 px-6 py-5 flex items-center justify-between flex-wrap gap-3">
        <span className="text-[11px] text-slate-600">
          DDAT System — Decision Direction Audit Theory
        </span>
        <div className="flex items-center gap-5">
          <Link href="/method" className="text-[11px] text-slate-600 hover:text-slate-300 transition-colors">
            Method
          </Link>
          <Link href="/contact" className="text-[11px] text-slate-600 hover:text-slate-300 transition-colors">
            Contact
          </Link>
        </div>
      </footer>
    </div>
  );
}
