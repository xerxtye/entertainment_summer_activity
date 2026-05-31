"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/feed", label: "Discover", icon: "M3 12l9-9 9 9M5 10v10h14V10" },
  { href: "/map", label: "Map", icon: "M9 20l-6 2V6l6-2 6 2 6-2v16l-6 2-6-2zM9 4v16M15 6v16" },
  { href: "/create", label: "Create", icon: "M12 5v14M5 12h14" },
  { href: "/profile", label: "Profile", icon: "M16 14a4 4 0 10-8 0M12 7a3 3 0 100-6 3 3 0 000 6zM4 21a8 8 0 0116 0" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky bottom-0 z-30 border-t border-neutral-800 bg-neutral-950/95 backdrop-blur">
      <div className="mx-auto flex max-w-md items-stretch justify-around px-2 pb-[env(safe-area-inset-bottom)]">
        {tabs.map((t) => {
          const active = pathname.startsWith(t.href);
          return (
            <Link
              key={t.href}
              href={t.href}
              className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors ${
                active ? "text-grass-400" : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={active ? 2.4 : 2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d={t.icon} />
              </svg>
              {t.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
