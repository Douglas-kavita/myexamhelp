// src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";

export const metadata: Metadata = {
  title: "MyExamHelp",
  description: "MyExamHelp — Services and Free Tools for students.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-slate-900 antialiased">
        <Navbar />
        {children}
        <Footer />

        {/* Chat widget loads globally */}
        <ChatWidget publicKey={process.env.NEXT_PUBLIC_TIDIO_KEY!} />
      </body>
    </html>
  );
}
