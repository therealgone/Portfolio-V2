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
      <body
        className={`${inter.variable} ${lexend.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
