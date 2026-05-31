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
    <nav className="pointer-events-none fixed inset-x-0 bottom-0 z-30 mx-auto flex max-w-md justify-center px-4 pb-[max(env(safe-area-inset-bottom),0.75rem)] pt-2">
      <div className="glass pointer-events-auto flex w-full items-stretch justify-around gap-1 rounded-[1.75rem] p-1.5 shadow-soft">
        {tabs.map((t) => {
          const active = pathname.startsWith(t.href);
          const isCreate = t.href === "/create";
          return (
            <Link
              key={t.href}
              href={t.href}
              className={`flex flex-1 flex-col items-center gap-0.5 rounded-[1.4rem] py-2 text-[10.5px] font-semibold transition-all ${
                active
                  ? isCreate
                    ? "bg-brand-gradient text-ink-900 shadow-glow"
                    : "bg-white/10 text-brand-300"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              <svg
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={active ? 2.5 : 2}
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
