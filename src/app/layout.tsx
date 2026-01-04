import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tadhg Moody | Coaching",
  description: "Coaching built around the individual. The standard does not change.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
