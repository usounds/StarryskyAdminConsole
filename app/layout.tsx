import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import PrelineScript from "./components/PrelineScript";
import Head from 'next/head'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Starrysky Admin Console",
  description: "Starrysky Admin Console Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <Head>
          <meta name="viewport" content="width=device-width, initial-scale=0.9"/>
      </Head>
      <body className={inter.className}>{children}</body>
      <PrelineScript />
    </html>
  );
}
