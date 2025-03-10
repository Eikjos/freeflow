import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${amica.variable} ${montserrat.variable} ${montserratMedium.variable} bg-white`}
    >
      <body className="font-display">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
