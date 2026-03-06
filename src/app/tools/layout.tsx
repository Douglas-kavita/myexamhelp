// src/app/tools/layout.tsx
export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-white">
      {/* Full width wrapper so HERO can go edge-to-edge */}
      <section className="w-full pt-28 pb-16">
        {children}
      </section>
    </main>
  );
}