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

     
         <link
         rel='preload'
         as='fetch'
          href="https://prod.spline.design/i7gHz8QTyTOZe0Wz/scene.splinecode"
          crossOrigin='anonymous'
         />
      
      <body
        className={`${inter.variable} ${lexend.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
