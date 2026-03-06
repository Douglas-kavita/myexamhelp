export default function ToolShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold tracking-widest text-orange-600">FREE TOOLS</p>
        <h1 className="mt-2 text-3xl md:text-4xl font-extrabold text-slate-900">{title}</h1>
        {subtitle ? <p className="mt-2 max-w-2xl text-slate-600">{subtitle}</p> : null}
      </div>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-white shadow-sm p-5 md:p-6">
        {children}
      </div>
    </div>
  );
}