import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Maya — Benefits Intake",
  description: "Voice-powered benefits triage for social service agencies",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
