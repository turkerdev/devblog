import Link from "next/link";
import { Code, FilePlus } from "phosphor-react";
import cookie from "cookie";
import { useEffect, useState } from "react";

export default function NavBar() {
  const [isAdmin, setAdmin] = useState(false);

  useEffect(() => {
    const cookies = cookie.parse(document.cookie);
    setAdmin(!!cookies.admin_key || false);
  }, []);

  return (
    <nav className="bg-neutral-900 h-12 px-4 flex gap-4 items-center border-b border-neutral-600">
      <Link href="/">
        <a className="flex items-center gap-2 text-amber-500 hover:text-amber-400">
          <Code weight="bold" size={24} />
          <p className="font-jetbrains text-2xl tracking-tighter">turker.dev</p>
        </a>
      </Link>
      <span className="text-neutral-500 select-none">|</span>
      {isAdmin && (
        <Link href="/create">
          <a className="flex items-center gap-1 hover:underline hover:text-amber-400">
            <FilePlus weight="bold" />
            <p>Create Post</p>
          </a>
        </Link>
      )}
    </nav>
  );
}
