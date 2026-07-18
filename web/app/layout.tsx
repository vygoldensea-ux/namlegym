import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const gymDisplay = localFont({
  variable: "--font-gym",
  display: "swap",
  src: [
    { path: "./fonts/SFUFuturaRegular.TTF", weight: "400", style: "normal" },
    { path: "./fonts/SFUFuturaBold.TTF", weight: "600", style: "normal" },
    { path: "./fonts/SFUFuturaBold.TTF", weight: "800", style: "normal" },
  ],
});

export const metadata: Metadata = {
  title: "Foxfit | Boutique Wellness Club",
  description: "Mạnh mẽ. Rạng rỡ. Không giới hạn.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className={gymDisplay.variable}>{children}</body>
    </html>
  );
}
