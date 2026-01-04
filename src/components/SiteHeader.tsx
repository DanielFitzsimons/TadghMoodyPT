import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="fixed top-0 z-50 w-full">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="text-xs tracking-[0.35em] text-white/70 hover:text-white">
          TADGH MOODY
        </Link>

        <nav className="flex items-center gap-6 text-xs text-white/60">
          <Link href="/#standard" className="hover:text-white">Standard</Link>
          <Link href="/#how" className="hover:text-white">How</Link>
          <Link href="/#proof" className="hover:text-white">Proof</Link>
          <Link
            href="/apply"
            className="rounded-full border border-white/20 px-4 py-2 text-white/80 hover:border-white/40 hover:text-white"
          >
            Apply
          </Link>
        </nav>
      </div>

      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </header>
  );
}
