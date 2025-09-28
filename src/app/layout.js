import Link from "next/link";
import { Toaster } from "react-hot-toast";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ThuêNhàVN",
  description:
    "ThuêNhàVN giúp chủ nhà và người thuê kết nối thông qua những tin đăng uy tín.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <header className="app-header">
          <div className="app-container app-header__inner">
            <Link href="/" className="app-logo">
              ThuêNhàVN
            </Link>
            <nav className="app-nav">
              <Link href="/dashboard/landlord">Bảng điều khiển</Link>
              <Link href="/listings/create">Đăng tin mới</Link>
            </nav>
          </div>
        </header>
        <main className="app-main app-container">{children}</main>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
