import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Quiz Hub Live",
  description: "Live multiplayer quiz platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />
          <div className="absolute -right-20 bottom-24 h-80 w-80 rounded-full bg-yellow-300/20 blur-3xl" />
        </div>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
