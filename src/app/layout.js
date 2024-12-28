import localFont from "next/font/local";
import "./globals.css";
import ReduxProvider from '../redux/ReduxProvider';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "CMS",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    < ReduxProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ReduxProvider>
  );
}