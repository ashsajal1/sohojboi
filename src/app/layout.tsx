import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import { ClerkProvider } from '@clerk/nextjs'
import Navbar from "@/components/navbar";
import Questions from "./@questions/questions";
import Nprogress from "@/components/nprogress";
import { Toaster } from "@/components/ui/sonner"
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sohojboi: Learn Something with Fun",
  description: "Sohojboi offers an engaging platform where students can ask questions, provide answers, play quizzes, and learn through a fun and interactive blog section.",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
  questions
}: Readonly<{
  children: React.ReactNode;
  questions: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster />
            <Nprogress />
            <Navbar />
            <main className="p-2">
              {children}
              <Questions>
              {questions}
              </Questions>
        
            </main>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
