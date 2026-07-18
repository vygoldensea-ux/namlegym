import type { Metadata } from "next";
import localFont from "next/font/local";
import { Be_Vietnam_Pro } from "next/font/google";
import { ScrollProgress } from "./Motion";
import "./globals.css";

const bodyFont = Be_Vietnam_Pro({
  variable: "--font-gym",
  display: "swap",
  subsets: ["vietnamese"],
  weight: ["400", "500", "600", "700"],
});

const gymHeading = localFont({
  variable: "--font-heading",
  display: "swap",
  src: [{ path: "./fonts/SVN-Engine.ttf", weight: "400", style: "normal" }],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://namlegym.vercel.app"),
  title: "Phòng tập nữ tại Vũng Tàu | Foxfit Wellness Club",
  description: "Foxfit là phòng tập nữ boutique tại 43 Lê Phụng Hiểu, Vũng Tàu. Tập sức mạnh, cardio và mobility với huấn luyện viên theo sát.",
  keywords: ["phòng tập nữ Vũng Tàu", "gym nữ Vũng Tàu", "huấn luyện viên cá nhân Vũng Tàu", "Foxfit"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "/",
    siteName: "Foxfit Boutique Wellness Club",
    title: "Foxfit | Phòng tập nữ boutique tại Vũng Tàu",
    description: "Không gian riêng tư, thiết bị hiện đại và lộ trình tập cá nhân dành cho phụ nữ tại Vũng Tàu.",
    images: [{ url: "/foxfit-cardio.png", width: 2048, height: 1152, alt: "Không gian tập luyện tại Foxfit Vũng Tàu" }],
  },
  twitter: { card: "summary_large_image", title: "Foxfit | Phòng tập nữ tại Vũng Tàu", description: "Tập đúng, khỏe hơn và tự tin hơn trong không gian boutique dành cho phụ nữ.", images: ["/foxfit-cardio.png"] },
  icons: {
    icon: [{ url: "/foxfit-fox-head-v3.png", type: "image/png", sizes: "512x512" }],
    shortcut: "/foxfit-fox-head-v3.png",
    apple: [{ url: "/foxfit-fox-head-v3.png", sizes: "512x512", type: "image/png" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className={`${bodyFont.variable} ${gymHeading.variable}`}><ScrollProgress />{children}</body>
    </html>
  );
}
