export default function CertificationPage() {
  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
          Certification Exam Help
        </h1>
        <p className="mt-3 text-slate-600">
          Placeholder page — paste your certification exam help content here.
        </p>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">How it works</h2>
          <ul className="mt-3 list-disc pl-5 text-slate-700 space-y-2">
            <li>Tell us the exam and your deadline.</li>
            <li>We confirm the requirements and a clear plan.</li>
            <li>We guide you step-by-step until completion.</li>
          </ul>

          <h2 className="mt-6 text-lg font-semibold text-slate-900">What we need from you</h2>
          <ul className="mt-3 list-disc pl-5 text-slate-700 space-y-2">
            <li>Exam name + platform (if applicable)</li>
            <li>Deadline and any instructions</li>
            <li>Any files, prompts, or screenshots</li>
          </ul>
        </div>
      </div>
    </main>
  );
}