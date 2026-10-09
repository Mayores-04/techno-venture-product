import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mini Mart | Self-Checkout",
  description: "A self-service checkout kiosk prototype.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
