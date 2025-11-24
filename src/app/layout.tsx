import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/src/components/Navbar";
import { ThemeProvider } from "@/src/components/ThemeProvider";

export const metadata: Metadata = {
  title: "Nexal - Next.js Starter Template",
  description: "A complete Next.js starter template with authentication",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="pt-24 min-h-screen">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}

