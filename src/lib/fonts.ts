import { Inter } from "next/font/google";
import localFont from "next/font/local";

export const nabla = localFont({
  src: "../app/fonts/Nabla.ttf",
  display: "swap",
  variable: "--font-nabla",
});

export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const nahid = localFont({
  src: "../app/fonts/Nahid.woff",
  display: "swap",
  variable: "--font-nahid",
});

export const concert = localFont({
  src: "../app/fonts/concert.ttf",
  display: "swap",
  variable: "--font-concert",
});
