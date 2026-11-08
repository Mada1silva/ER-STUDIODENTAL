import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { site } from "@/lib/config/site";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: {
    default: `${site.nome} | Laboratório de Prótese Dentária em Brasília`,
    template: `%s | ${site.nomeCurto}`,
  },
  description: `Laboratório de prótese dentária desde ${site.desde}. Fluxo digital CAD/CAM, zircônia, E-max, protocolos e reabilitação para dentistas de Brasília e região.`,
};

export const viewport: Viewport = { themeColor: "#252a2e" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="bg-prata-50 text-grafite-900">{children}</body>
    </html>
  );
}
