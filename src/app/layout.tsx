import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hoshi CBT",
  description: "Opensource Computer Based Test",
  icons: "HeaderLogo.svg"
};

export default function RootLayout({ children, }: Readonly<{children: React.ReactNode;}>) {
  return (
    <html lang="en" data-theme="light">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
