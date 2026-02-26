import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Landing Page Builder",
  description: "Event & Campaign Landing Page Platform"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}