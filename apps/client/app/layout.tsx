import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Freeflow",
  description: "Freeflow platform to manage the life's freelance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
