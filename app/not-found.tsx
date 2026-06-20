import Link from "next/link";

export default function NotFound() {
  return (
    <section className="page-shell py-20">
      <div className="rounded border border-slateLine bg-white p-8 shadow-soft">
        <h1 className="text-3xl font-bold text-ink">Page not found</h1>
        <p className="mt-3 text-slate-600">The requested finance portfolio page does not exist.</p>
        <Link href="/projects" className="mt-6 inline-flex rounded bg-navy px-4 py-2 text-sm font-bold text-white">
          Back to Projects
        </Link>
      </div>
    </section>
  );
}
