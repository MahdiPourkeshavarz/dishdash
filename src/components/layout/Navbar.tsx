import Link from "next/link";
import Image from "next/image";

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-[1500] bg-white/2 backdrop-blur-none">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center text-xl font-bold text-brand-primary"
        >
          <Image src={"/Logo.png"} width={48} height={48} alt="marker" />
          <span className="text-blue-600">DishDash</span>
        </Link>

        <div className="flex items-center gap-4">
          <button className="rounded-lg bg-brand-primary px-4 py-2 font-semibold text-blue-400 transition-colors hover:bg-brand-secondary">
            Login
          </button>
        </div>
      </div>
    </header>
  );
}
