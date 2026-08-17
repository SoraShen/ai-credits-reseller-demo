import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { brand } from "@/lib/brand";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-brand",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: `${brand.productName} | Packages`,
  description: `Demo: Choose personal or business AI token packages from ${brand.productName}. Multi-model access in one hub.`,
  icons: {
    icon: brand.favicon,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-brand={brand.dataBrand}
      className={`${montserrat.variable} h-full`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
