"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CurrentUser } from "@/lib/types";
import { avatarFor, formatEventDate } from "@/lib/format";

type MyEvent = {
  id: string;
  title: string;
  date: string;
  isPublic: boolean;
  isBoosted: boolean;
  _count: { applications: number };
  applications: {
    id: string;
    status: string;
    applicant: { id: string; name: string; photoUrl: string };
  }[];
};

type Connection = { id: string; name: string; photoUrl: string; via: string };

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [events, setEvents] = useState<MyEvent[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [saving, setSaving] = useState(false);
  const [boostBusy, setBoostBusy] = useState(false);

  async function load() {
    const [me, mine, conns] = await Promise.all([
      fetch("/api/auth/me").then((r) => r.json()),
      fetch("/api/events/mine").then((r) => r.json()),
      fetch("/api/connections").then((r) => r.json()),
    ]);
    if (me.user) {
      setUser(me.user);
      setName(me.user.name);
      setAbout(me.user.about);
    }
    setEvents(mine.events ?? []);
    setConnections(conns.connections ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  async function saveProfile() {
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, about }),
      });
      const d = await res.json();
      setUser(d.user);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  }

  async function toggleBoost() {
    if (!user) return;
    setBoostBusy(true);
    try {
      const res = await fetch("/api/boost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: !user.isBoosted }),
      });
      const d = await res.json();
      setUser(d.user);
      load();
    } finally {
      setBoostBusy(false);
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/onboarding");
    router.refresh();
  }

  if (!user) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-neutral-500">
        Loading…
      </div>
    );
  }

  const photo = user.photoUrl || avatarFor(user.id);

  return (
    <div className="flex flex-1 flex-col overflow-y-auto no-scrollbar pb-8">
      <header className="flex items-center justify-between px-5 pb-2 pt-4">
        <h1 className="text-xl font-extrabold">👤 Profile</h1>
        <button onClick={logout} className="text-xs text-neutral-500 underline">
          Log out
        </button>
      </header>

      {/* Identity */}
      <div className="px-5">
        <div className="flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo}
            alt={user.name}
            className="h-20 w-20 rounded-full object-cover ring-2 ring-grass-600"
          />
          <div className="min-w-0 flex-1">
            {editing ? (
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2 text-lg font-bold outline-none focus:border-grass-500"
              />
            ) : (
              <div className="flex items-center gap-2">
                <h2 className="truncate text-2xl font-extrabold">{user.name}</h2>
                {user.isBoosted && (
                  <span className="rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-extrabold text-amber-950">
                    ⚡ BOOST
                  </span>
                )}
              </div>
            )}
            <p className="text-sm text-neutral-500">{user.phone}</p>
          </div>
        </div>

        {/* About me */}
        <div className="mt-4">
          <div className="mb-1 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-neutral-300">About me</h3>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="text-xs text-grass-400"
              >
                Edit
              </button>
            )}
          </div>
          {editing ? (
            <div className="space-y-2">
              <textarea
                rows={3}
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                placeholder="Tell people what you're into…"
                className="w-full resize-none rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm outline-none focus:border-grass-500"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditing(false);
                    setName(user.name);
                    setAbout(user.about);
                  }}
                  className="flex-1 rounded-xl border border-neutral-700 py-2 text-sm"
                >
                  Cancel
                </button>
                <button
                  disabled={saving}
                  onClick={saveProfile}
                  className="flex-1 rounded-xl bg-grass-500 py-2 text-sm font-semibold text-neutral-950 disabled:opacity-50"
                >
                  {saving ? "Saving…" : "Save"}
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-neutral-400">
              {user.about || "No bio yet — tap Edit to add one."}
            </p>
          )}
        </div>
      </div>

      {/* Boost subscription */}
      <div className="mt-5 px-5">
        <div className="rounded-2xl border border-amber-500/40 bg-gradient-to-br from-amber-500/15 to-neutral-900 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="flex items-center gap-1 font-bold text-amber-300">
                ⚡ Boost
              </h3>
              <p className="mt-0.5 text-xs text-neutral-400">
                Your events appear higher and more often in others&apos; feeds.
              </p>
            </div>
            <span className="text-sm font-bold text-amber-300">$4.99/mo</span>
          </div>
          <button
            disabled={boostBusy}
            onClick={toggleBoost}
            className={`mt-3 w-full rounded-xl py-2.5 text-sm font-semibold transition disabled:opacity-50 ${
              user.isBoosted
                ? "border border-amber-400 text-amber-300"
                : "bg-amber-400 text-amber-950"
            }`}
          >
            {boostBusy
              ? "…"
              : user.isBoosted
              ? "Boost active — tap to cancel"
              : "Subscribe to Boost"}
          </button>
        </div>
      </div>

      {/* My events */}
      <Section title="My events" count={events.length}>
        {events.length === 0 ? (
          <Empty text="You haven't created any events yet." />
        ) : (
          <div className="space-y-2">
            {events.map((e) => (
              <div
                key={e.id}
                className="rounded-2xl border border-neutral-800 bg-neutral-900 p-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{e.title}</span>
                  <div className="flex gap-1">
                    {e.isBoosted && (
                      <span className="rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-bold text-amber-950">
                        ⚡
                      </span>
                    )}
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        e.isPublic
                          ? "bg-grass-600 text-neutral-950"
                          : "bg-neutral-700 text-neutral-200"
                      }`}
                    >
                      {e.isPublic ? "Public" : "Private"}
                    </span>
                  </div>
                </div>
                <div className="mt-1 text-xs text-neutral-500">
                  {formatEventDate(e.date)} · {e._count.applications}{" "}
                  {e._count.applications === 1 ? "applicant" : "applicants"}
                </div>
                {e.applications.length > 0 && (
                  <div className="mt-2 flex -space-x-2">
                    {e.applications.slice(0, 6).map((a) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={a.id}
                        src={a.applicant.photoUrl || avatarFor(a.applicant.id)}
                        alt={a.applicant.name}
                        title={`${a.applicant.name} · ${a.status}`}
                        className="h-7 w-7 rounded-full object-cover ring-2 ring-neutral-900"
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Connections */}
      <Section title="My connections" count={connections.length}>
        {connections.length === 0 ? (
          <Empty text="No connections yet. Join events to meet people." />
        ) : (
          <div className="space-y-2">
            {connections.map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-3 rounded-2xl border border-neutral-800 bg-neutral-900 p-3"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.photoUrl || avatarFor(c.id)}
                  alt={c.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold">{c.name}</div>
                  <div className="text-xs text-neutral-500">{c.via}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}

function Section({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-6 px-5">
      <h3 className="mb-2 text-sm font-semibold text-neutral-300">
        {title} <span className="text-neutral-600">({count})</span>
      </h3>
      {children}
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <p className="rounded-2xl border border-dashed border-neutral-800 p-4 text-center text-sm text-neutral-500">
      {text}
    </p>
  );
}
