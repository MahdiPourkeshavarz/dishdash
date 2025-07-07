import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { inter, nabla, nahid } from "@/lib/fonts";

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
      <body className={`${inter.variable} ${nahid.variable} ${nabla.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
