import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mini Mart | Self-Checkout",
  description: "Smart shopping cart self-checkout prototype",
  applicationName: "Mini Mart Self-Checkout",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Mini Mart",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0a1117",
  colorScheme: "dark",
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
