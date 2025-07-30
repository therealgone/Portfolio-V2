import './globals.css'
import type { Metadata } from "next";
import { Inter, Lexend_Tera } from 'next/font/google'
import { PrismScene } from "./components/three/PrismScene"

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
      </head>
      <body className={`${inter.variable} ${lexend.variable}`}>

        
        {children}
      </body>
    </html>
  );
}
