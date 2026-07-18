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

const gymHeading = localFont({
  variable: "--font-heading",
  display: "swap",
  src: [{ path: "./fonts/SVN-Engine.ttf", weight: "400", style: "normal" }],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://foxfit-wellness-club.polite-ibex-0423.chatgpt.site"),
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
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className={`${gymDisplay.variable} ${gymHeading.variable}`}>{children}</body>
    </html>
  );
}
