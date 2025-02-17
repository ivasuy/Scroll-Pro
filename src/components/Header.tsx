import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-white/10">
      <div className="container mx-auto px-4 py-3">
        <nav className="flex items-center justify-center">
          <Link href="/" className="flex items-center gap-2">
            <img
              src="https://www.toastd.in/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogoo.994d557c.png&w=256&q=75"
              alt="Logo"
              className=""
            />
          </Link>
        </nav>
      </div>
    </header>
  );
}
