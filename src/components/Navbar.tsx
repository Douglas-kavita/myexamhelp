"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import OpenChatButton from "../components/OpenChatButton";


type NavItem = { label: string; href: string };
type NavGroup = { label: string; items: NavItem[] };

const TOP_LINKS: NavItem[] = [{ label: "Blog", href: "/blog" }];

// ✅ ONLY CHANGE: fix Services dropdown hrefs to use /services?tab=...
// ✅ also add GED (since you requested it earlier)
// (No styling/layout changes anywhere else)
const SERVICES: NavGroup = {
  label: "Services",
  items: [
    { label: "Services Overview", href: "/services" },
    { label: "Certification Exam Help", href: "/services?tab=certification" },
    { label: "GED Exam Help", href: "/services?tab=ged" },
    { label: "ATI TEAS Exam Help", href: "/services?tab=teas" },
    { label: "LSAT Exam Help Master Guide", href: "/services?tab=lsat" },
    { label: "AWS Exam Help Master Guide", href: "/services?tab=aws" },
    { label: "Proctored Exam Help", href: "/services?tab=proctored" },
  ],
};

const FREE_TOOLS: NavGroup = {
  label: "Free Tools",
  items: [
    { label: "GPA Calculator", href: "/tools?tool=gpa" },
    { label: "Exam Countdown Planner", href: "/tools?tool=countdown" },
    { label: "Study Time Tracker", href: "/tools?tool=study" },
    { label: "Citation Generator", href: "/tools?tool=citation" },
    { label: "AI Flashcard Generator", href: "/tools?tool=flashcards" },
    { label: "Rubric Analyzer", href: "/tools?tool=rubric" },
    { label: "Am I Ready? Quiz", href: "/tools?tool=ready" },
  ],
};

const GROUPME: NavGroup = {
  label: "GroupMe",
  items: [
    { label: "GroupMe Overview", href: "/groupme" },
    { label: "Proctored Exam Support", href: "/groupme/proctored-exams" },
    { label: "Assignments & Coursework", href: "/groupme/assignments" },
    { label: "Nursing & TEAS / HESI", href: "/groupme/nursing-teas-hesi" },
    { label: "Praxis Exam Prep", href: "/groupme/praxis" },
    { label: "GMAT / GRE Support", href: "/groupme/gmat-gre" },
    { label: "Real Estate Licensing Exams", href: "/groupme/real-estate" },
    { label: "CompTIA / IT Certification Exams", href: "/groupme/comptia-it" },
    { label: "LSAT / Law School Prep", href: "/groupme/lsat" },
  ],
};

function normalize(path: string) {
  if (path !== "/" && path.endsWith("/")) return path.slice(0, -1);
  return path;
}

export default function Navbar() {
  const pathnameRaw = usePathname() || "/";
  const pathname = useMemo(() => normalize(pathnameRaw), [pathnameRaw]);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<null | "services" | "tools" | "groupme">(null);

  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-nav-root]")) setOpenDropdown(null);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // NOTE: Keep your original active logic (unchanged)
  const isActive = (href: string) => {
    const h = normalize(href);
    if (h === "/") return pathname === "/";
    return pathname === h || pathname.startsWith(h + "/");
  };

  const linkClass = (href: string) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition ${
      isActive(href)
        ? "text-orange-600 bg-orange-50"
        : "text-slate-700 hover:text-orange-600 hover:bg-slate-50"
    }`;

  const dropdownButtonClass = (keyHref: string, isOpen: boolean) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition inline-flex items-center gap-1 ${
      isOpen || isActive(keyHref)
        ? "text-orange-600 bg-orange-50"
        : "text-slate-700 hover:text-orange-600 hover:bg-slate-50"
    }`;

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/85 backdrop-blur-md border-b border-slate-200">
      <nav data-nav-root className="mx-auto max-w-6xl px-4">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-extrabold text-slate-900">MyExamHelp</span>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-1">
            {/* Home */}
            <Link href="/" className={linkClass("/")}>
              Home
            </Link>

            {/* Services dropdown */}
            <div className="relative">
              <button
                type="button"
                className={dropdownButtonClass("/services", openDropdown === "services")}
                onClick={() => setOpenDropdown((v) => (v === "services" ? null : "services"))}
                aria-haspopup="menu"
                aria-expanded={openDropdown === "services"}
              >
                {SERVICES.label}
                <span className="text-xs">▾</span>
              </button>

              {openDropdown === "services" && (
                <div className="absolute left-0 mt-2 w-64 rounded-xl border border-slate-200 bg-white shadow-lg p-2">
                  {SERVICES.items.map((it) => (
                    <Link
                      key={it.href}
                      href={it.href}
                      className={`block rounded-lg px-3 py-2 text-sm transition ${
                        isActive(it.href)
                          ? "bg-orange-50 text-orange-700"
                          : "hover:bg-slate-50 text-slate-700"
                      }`}
                      onClick={() => setOpenDropdown(null)}
                    >
                      {it.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Free tools dropdown */}
            <div className="relative">
              <button
                type="button"
                className={dropdownButtonClass("/tools", openDropdown === "tools")}
                onClick={() => setOpenDropdown((v) => (v === "tools" ? null : "tools"))}
                aria-haspopup="menu"
                aria-expanded={openDropdown === "tools"}
              >
                {FREE_TOOLS.label}
                <span className="text-xs">▾</span>
              </button>

              {openDropdown === "tools" && (
                <div className="absolute left-0 mt-2 w-64 rounded-xl border border-slate-200 bg-white shadow-lg p-2">
                  {FREE_TOOLS.items.map((it) => (
                    <Link
                      key={it.href}
                      href={it.href}
                      className={`block rounded-lg px-3 py-2 text-sm transition ${
                        isActive(it.href)
                          ? "bg-orange-50 text-orange-700"
                          : "hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      {it.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* GroupMe dropdown */}
            <div className="relative">
              <button
                type="button"
                className={dropdownButtonClass("/groupme", openDropdown === "groupme")}
                onClick={() => setOpenDropdown((v) => (v === "groupme" ? null : "groupme"))}
                aria-haspopup="menu"
                aria-expanded={openDropdown === "groupme"}
              >
                {GROUPME.label}
                <span className="text-xs">▾</span>
              </button>

              {openDropdown === "groupme" && (
                <div className="absolute left-0 mt-2 w-72 rounded-xl border border-slate-200 bg-white shadow-lg p-2">
                  {GROUPME.items.map((it) => (
                    <Link
                      key={it.href}
                      href={it.href}
                      className={`block rounded-lg px-3 py-2 text-sm transition ${
                        isActive(it.href)
                          ? "bg-orange-50 text-orange-700"
                          : "hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      {it.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Top links */}
            {TOP_LINKS.map((it) => (
              <Link key={it.href} href={it.href} className={linkClass(it.href)}>
                {it.label}
              </Link>
            ))}
<OpenChatButton
  className="ml-2 inline-flex items-center rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700 transition"
>
  Request Help
</OpenChatButton>
          </div>

          {/* Mobile button */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-800"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? "Close" : "Menu"}
          </button>
        </div>

        {/* Mobile panel */}
        {mobileOpen && (
          <div className="md:hidden pb-4">
            <ul className="list-none m-0 p-0 space-y-1">
              {/* Services */}
              <li className="rounded-xl border border-slate-200 bg-white">
                <button
                  type="button"
                  className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-slate-800"
                  onClick={() => setOpenDropdown((v) => (v === "services" ? null : "services"))}
                >
                  {SERVICES.label}
                  <span className="text-xs">▾</span>
                </button>
                {openDropdown === "services" && (
                  <div className="px-2 pb-2">
                    {SERVICES.items.map((it) => (
                      <Link
                        key={it.href}
                        href={it.href}
                        className={`block rounded-lg px-3 py-2 text-sm transition ${
                          isActive(it.href)
                            ? "bg-orange-50 text-orange-700"
                            : "hover:bg-slate-50 text-slate-700"
                        }`}
                        onClick={() => {
                          setMobileOpen(false);
                          setOpenDropdown(null);
                        }}
                      >
                        {it.label}
                      </Link>
                    ))}
                  </div>
                )}
              </li>

              {/* Free Tools */}
              <li className="rounded-xl border border-slate-200 bg-white">
                <button
                  type="button"
                  className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-slate-800"
                  onClick={() => setOpenDropdown((v) => (v === "tools" ? null : "tools"))}
                >
                  {FREE_TOOLS.label}
                  <span className="text-xs">▾</span>
                </button>
                {openDropdown === "tools" && (
                  <div className="px-2 pb-2">
                    {FREE_TOOLS.items.map((it) => (
                      <Link
                        key={it.href}
                        href={it.href}
                        className={`block rounded-lg px-3 py-2 text-sm transition ${
                          isActive(it.href)
                            ? "bg-orange-50 text-orange-700"
                            : "hover:bg-slate-50 text-slate-700"
                        }`}
                        onClick={() => setMobileOpen(false)}
                      >
                        {it.label}
                      </Link>
                    ))}
                  </div>
                )}
              </li>

              {/* GroupMe */}
              <li className="rounded-xl border border-slate-200 bg-white">
                <button
                  type="button"
                  className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-slate-800"
                  onClick={() => setOpenDropdown((v) => (v === "groupme" ? null : "groupme"))}
                >
                  {GROUPME.label}
                  <span className="text-xs">▾</span>
                </button>
                {openDropdown === "groupme" && (
                  <div className="px-2 pb-2">
                    {GROUPME.items.map((it) => (
                      <Link
                        key={it.href}
                        href={it.href}
                        className={`block rounded-lg px-3 py-2 text-sm transition ${
                          isActive(it.href)
                            ? "bg-orange-50 text-orange-700"
                            : "hover:bg-slate-50 text-slate-700"
                        }`}
                        onClick={() => setMobileOpen(false)}
                      >
                        {it.label}
                      </Link>
                    ))}
                  </div>
                )}
              </li>

              {/* Top links */}
              {TOP_LINKS.map((it) => (
                <li key={it.href}>
                  <Link
                    href={it.href}
                    className={`block rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold transition ${
                      isActive(it.href)
                        ? "text-orange-700 bg-orange-50"
                        : "text-slate-800 hover:bg-slate-50"
                    }`}
                    onClick={() => setMobileOpen(false)}
                  >
                    {it.label}
                  </Link>
                </li>
              ))}

              <li>
                <Link
                  href="/request-help"
                  className="block rounded-xl bg-orange-600 px-4 py-3 text-sm font-semibold text-white text-center hover:bg-orange-700 transition"
                  onClick={() => setMobileOpen(false)}
                >
                  Request Help
                </Link>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
}