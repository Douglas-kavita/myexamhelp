export default function Footer() {
  return (
    <footer className="w-full bg-slate-900 text-slate-100">

      {/* ===== TOP CTA STRIP ===== */}
      <div className="w-full px-6 sm:px-10 lg:px-16 py-16 border-b border-white/10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <h3 className="text-3xl md:text-4xl font-extrabold max-w-3xl">
            Contact us now & find out how seamlessly we can support your exams and assignments.
          </h3>
          <button className="rounded-full px-7 py-3 bg-slate-200 text-slate-900 font-semibold hover:bg-white transition">
            Get a Quote
          </button>
        </div>
      </div>

      {/* ===== TRUST / PAYMENTS ROW ===== */}
      <div className="w-full px-6 sm:px-10 lg:px-16 py-10 border-b border-white/10">
        <div className="grid gap-8 lg:grid-cols-3 items-center">

          {/* App placeholders */}
          <div>
            <div className="text-sm font-semibold text-white/80">Apps (placeholder)</div>
            <div className="mt-3 flex flex-wrap gap-3">
              <div className="h-11 w-40 bg-white/10 rounded-xl flex items-center justify-center text-sm">
                Google Play
              </div>
              <div className="h-11 w-40 bg-white/10 rounded-xl flex items-center justify-center text-sm">
                App Store
              </div>
            </div>
          </div>

          {/* Payment icons */}
          <div>
            <div className="text-sm font-semibold text-white/80">Payments (placeholder)</div>
            <div className="mt-3 flex flex-wrap gap-3">
              {["Visa","Mastercard","AMEX","Discover","JCB"].map((x) => (
                <div key={x} className="h-10 w-20 bg-white/10 rounded-lg flex items-center justify-center text-xs">
                  {x}
                </div>
              ))}
            </div>
          </div>

          {/* Guarantee */}
          <div>
            <div className="bg-white/10 rounded-2xl p-5">
              <div className="font-semibold">Money Back Guarantee</div>
              <p className="mt-2 text-sm text-white/70">
                Add refund policy text here (placeholder).
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* ===== MAIN FOOTER GRID ===== */}
      <div className="w-full px-6 sm:px-10 lg:px-16 py-16">
        <div className="grid gap-12 lg:grid-cols-4">

          {/* Brand */}
          <div>
            <div className="text-xl font-bold">MyExamHelp</div>
            <p className="mt-4 text-sm text-white/70">
              Support for exams, assignments & online assessments.
            </p>

            <div className="mt-6 flex gap-3">
              {["X","Facebook","Instagram","YouTube"].map((x) => (
                <div key={x} className="px-4 py-2 bg-white/10 rounded-lg text-sm">
                  {x}
                </div>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-lg">Legal & Policies</h4>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              <li>Terms & Conditions</li>
              <li>Refund Policy</li>
              <li>Privacy Policy</li>
              <li>Cookies Policy</li>
              <li>Code of Conduct</li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-lg">Popular Services</h4>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              <li>Dissertation Support</li>
              <li>Research Paper Support</li>
              <li>Term Paper Support</li>
              <li>College Essay Support</li>
              <li>Thesis Support</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold text-lg">Newsletter</h4>
            <p className="mt-4 text-sm text-white/70">
              Subscribe to updates and offers.
            </p>

            <div className="mt-4 flex gap-3">
              <input
                className="h-11 w-full rounded-xl bg-white/10 border border-white/10 px-4 text-sm text-white placeholder:text-white/50"
                placeholder="Email address"
              />
              <button className="h-11 px-5 rounded-xl bg-slate-200 text-slate-900 font-semibold">
                Join
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ===== FINAL BOTTOM STRIP (Integrated — No Grey Line) ===== */}
      <div className="border-t border-white/10">
        <div className="w-full px-6 sm:px-10 lg:px-16 py-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

            <div className="text-sm text-white/60">
              © {new Date().getFullYear()} MyExamHelp. All rights reserved.
            </div>

            <div className="text-sm text-white/60">
              Placeholder business/legal line (address/company name).
            </div>

          </div>
        </div>
      </div>

    </footer>
  );
}