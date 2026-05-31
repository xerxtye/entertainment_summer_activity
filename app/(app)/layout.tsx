import BottomNav from "@/components/BottomNav";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col">
      {/* Reserve space for the floating tab bar */}
      <main className="flex flex-1 flex-col overflow-hidden pb-[88px]">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
