import type { Metadata } from "next";
import { Suspense } from "react";
import { Ubuntu } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import { ClerkProvider } from '@clerk/nextjs'
import Navbar from "@/components/navbar";
import Questions from "./@questions/questions";
import Nprogress from "@/components/nprogress";
import { Toaster } from "@/components/ui/sonner"
import { Toaster as Toaster2 } from "@/components/ui/toaster"
const font = Ubuntu({ subsets: ["latin"], weight: ["400", "700"] });

const SITE_URL = "https://sohojboi.netlify.app";
const SITE_DESCRIPTION =
  "Sohojboi offers an engaging platform where students can ask questions, provide answers, play quizzes, and learn through a fun and interactive blog section.";
const SITE_TITLE = "Sohojboi: Learn Something with Fun";

// Clerk's frontend API host is embedded in the publishable key
// (pk_test_<base64(host)>), so we can preconnect without hardcoding it.
const clerkFrontendApiHost = (() => {
  const encoded = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.split("_")[2];
  if (!encoded) return null;
  try {
    return atob(encoded) || null;
  } catch {
    return null;
  }
})();

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Sohojboi",
      url: SITE_URL,
      logo: `${SITE_URL}/logo.png`,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Sohojboi",
      description: SITE_DESCRIPTION,
      inLanguage: "en",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  manifest: "/manifest.json",
  applicationName: "Sohojboi",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    siteName: "Sohojboi",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    locale: "en_US",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "Sohojboi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/logo.png"],
  },
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
        <body className={font.className}>
          {clerkFrontendApiHost && (
            <>
              <link rel="preconnect" href={`https://${clerkFrontendApiHost}`} />
              <link rel="dns-prefetch" href={`https://${clerkFrontendApiHost}`} />
            </>
          )}
          <script
            type="application/ld+json"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          />
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster />
            <Toaster2 />
            <Nprogress />
            {/*
              The navbar reads Clerk + Prisma. Streaming it lets the shell and
              the page content flush immediately instead of waiting on auth/DB
              (TTFB was ~1.7 s). The fallback reserves the same height so the
              swap does not shift the layout.
            */}
            <Suspense
              fallback={
                <nav
                  aria-hidden="true"
                  className="flex items-center justify-between p-4 border-b min-h-[57px]"
                />
              }
            >
              <Navbar />
            </Suspense>
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
