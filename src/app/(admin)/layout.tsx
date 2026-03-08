import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://myexamhelp.com"),
  title: "MyExamHelp Admin",
  description: "Admin inbox for MyExamHelp.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}