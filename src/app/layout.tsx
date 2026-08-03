import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { WhatsAppButton } from "@/components/whatsapp-button";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    "https://www.masterdieselparts.com.br"
  ),
  title: {
    default: "Master Diesel | Peças Diesel Leve",
    template: "%s | Master Diesel",
  },
  description:
    "Peças para veículos diesel leve, vans, caminhonetes e utilitários. Consulte por código, aplicação, motor ou veículo.",
  keywords: [
    "peças diesel",
    "diesel leve",
    "Hyundai HR",
    "Kia Bongo",
    "peças para vans",
    "peças para caminhonetes",
    "Master Diesel",
  ],
  openGraph: {
    title: "Master Diesel | Peças Diesel Leve",
    description:
      "Catálogo especializado em peças para veículos diesel leve.",
    url: "https://www.masterdieselparts.com.br",
    siteName: "Master Diesel",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}