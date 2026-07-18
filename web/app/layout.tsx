import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const gymDisplay = Montserrat({
  variable: "--font-gym",
  display: "swap",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800", "900"],
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
