import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { inter, nabla, nahid, concert } from "@/lib/fonts";
import { QueryProvider } from "./QueryProvider";
import { ThemeSync } from "@/components/layout/ThemeSync";
import { UploadNotifier } from "@/components/layout/UploadNotifier";
import { ZustandSessionSync } from "@/components/layout/ZustandSessionSync";

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
      <head>
        <link
          rel="preconnect"
          href="https://www.openstreetmap.org"
          crossOrigin=""
        />
      </head>
      <body
        className={`${inter.variable} ${nahid.variable} ${nabla.variable} ${concert.variable}`}
      >
        <Providers>
          <QueryProvider>
            <ZustandSessionSync />
            <ThemeSync />
            <UploadNotifier />
            {children}
          </QueryProvider>
        </Providers>
      </body>
    </html>
  );
}
