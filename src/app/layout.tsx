import type { Metadata, Viewport } from "next";
import { Sora } from "next/font/google";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sora",
});

export const metadata: Metadata = {
  title: "TRIVAX • Três Escolhas. Uma Proteção.",
  description:
    "Descubra quais vacinas podem ser indicadas para você e siga seu caminho com confiança. Informação que conecta. Escolhas que protegem.",
  icons: {
    icon: "/trivax-symbol-v3.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${sora.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#080612] text-[#F2F3F7] font-sans selection:bg-[#7B28E2] selection:text-white">
        {children}
      </body>
    </html>
  );
}
