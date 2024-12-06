import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

export const metadata: Metadata = {
  title: "Freeflow",
  description: "Freeflow platform to manage the life's freelance",
};

const amica = localFont({
  src: "./fonts/AmaticSC-Regular.ttf",
  variable: "--font-amica",
});

const montserrat = localFont({
  src: "./fonts/Montserrat-Regular.ttf",
  variable: "--font-montserrat",
});

const montserratMedium = localFont({
  src: "./fonts/Montserrat-Medium.ttf",
  variable: "--font-montserrat-medium",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${amica.variable} ${montserrat.variable} ${montserratMedium.variable} bg-white`}
    >
      <body className="font-display">{children}</body>
    </html>
  );
}
