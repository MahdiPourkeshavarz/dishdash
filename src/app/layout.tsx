import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const nahidFont = localFont({
  src: "../assets/font/Nahid.woff",
  display: "swap",
  variable: "--font-nahid",
});

export const metadata: Metadata = {
  title: "DishDash",
  description: "Discover and share the best local eats.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${nahidFont.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
