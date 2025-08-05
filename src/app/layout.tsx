import './globals.css'
import type { Metadata } from "next";
import { Inter, Lexend_Tera } from 'next/font/google'


const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const lexend = Lexend_Tera({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-lexend',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Portfolio Jeevan ',
  description: 'Built by Jeevan ✨',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        {/* Mobile viewport meta tag */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        {/* Preload critical fonts */}
        <link rel="preload" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Lexend+Tera:wght@400;500;600&display=swap" as="style" />
        {/* Preload critical images */}
        <link rel="preload" href="/HTML.svg" as="image" />
        <link rel="preload" href="/CSS.svg" as="image" />
        <link rel="preload" href="/JS.svg" as="image" />
        <link rel="preload" href="/react.svg" as="image" />
        <link rel="preload" href="/nextjs.svg" as="image" />
        <link rel="preload" href="/tailwind.svg" as="image" />
        {/* SEO Meta Tags */}
        <meta name="description" content="Jeevan Baabu's Portfolio - Full Stack Developer, AI/ML Engineer, and Creative Technologist" />
        <meta name="keywords" content="portfolio, developer, AI, ML, React, Next.js, TypeScript" />
        <meta name="author" content="Jeevan Baabu Murugan" />
        <meta property="og:title" content="Jeevan Baabu - Portfolio" />
        <meta property="og:description" content="Full Stack Developer, AI/ML Engineer, and Creative Technologist" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://your-domain.vercel.app" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Jeevan Baabu - Portfolio" />
        <meta name="twitter:description" content="Full Stack Developer, AI/ML Engineer, and Creative Technologist" />
      </head>
      <body className={`${inter.variable} ${lexend.variable}`}>


        {children}
      </body>
    </html>
  );
}
