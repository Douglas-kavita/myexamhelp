import "../globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";

export const metadata: Metadata = {
  metadataBase: new URL("https://myexamhelp.com"),
  title: "MyExamHelp",
  description: "MyExamHelp — Services and Free Tools for students.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAdmin =
    typeof window !== "undefined" &&
    (window.location.pathname.startsWith("/admin") ||
      window.location.pathname.startsWith("/reset-password"));

  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-slate-900 antialiased">
        {!isAdmin && <Navbar />}

        {children}

        {!isAdmin && <Footer />}
        {!isAdmin && <ChatWidget />}
      </body>
    </html>
  );
}