import type { Metadata } from "next";
import "./globals.css";
import { SeepProvider } from "@/context/SeepContext";

export const metadata: Metadata = {
  title: "seep — unbilled hour tracker & leak visualizer",
  description: "detect unbilled hours freelancers lose in real time with beautiful, clinical glassmorphic precision.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&display=swap" rel="stylesheet" />
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased min-h-screen w-full bg-[#fafafa]">
        <SeepProvider>
          {children}
        </SeepProvider>
      </body>
    </html>
  );
}
