import ContactForm from "@/components/contactForm";

export default function ContactPage() {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "1234567890";
  const email = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@myexamhelp.com";

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-semibold">Contact</h1>
        <p className="mt-2 text-sm opacity-70">
          Send your task details and deadline. Fastest response is WhatsApp.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <ContactForm />

        <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-900">
          <h2 className="text-lg font-semibold">Direct options</h2>
          <p className="mt-1 text-sm opacity-70">
            Replace these with your real contacts in <code>.env.local</code>.
          </p>

          <div className="mt-4 grid gap-3 text-sm">
            <div className="rounded-xl border border-black/10 bg-black/5 p-4 dark:border-white/10 dark:bg-white/5">
              <div className="font-semibold">WhatsApp</div>
              <div className="opacity-70">{phone}</div>
            </div>
            <div className="rounded-xl border border-black/10 bg-black/5 p-4 dark:border-white/10 dark:bg-white/5">
              <div className="font-semibold">Email</div>
              <div className="opacity-70">{email}</div>
            </div>
            <div className="rounded-xl border border-black/10 bg-black/5 p-4 dark:border-white/10 dark:bg-white/5">
              <div className="font-semibold">Hours</div>
              <div className="opacity-70">Daily • 24/7</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
