import type { Metadata } from "next";
import "./globals.css";
import { ToastContainer } from "../components/ToastContainer";

export const metadata: Metadata = {
  title: "Taskflow — AI Task Processing",
  description: "Run intelligent text tasks asynchronously with real-time tracking.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300..900;1,300..900&family=Montserrat:ital,wght@0,300..700;1,300..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}