import './globals.css'
import type { Metadata } from "next";
import { Instrument_Serif, Barlow } from 'next/font/google'

const serif = Instrument_Serif({
  subsets: ['latin'], weight: '400', style: ['normal', 'italic'],
  variable: '--font-serif', display: 'swap',
})
const barlow = Barlow({
  subsets: ['latin'], weight: ['300', '400', '500', '600'],
  variable: '--font-body', display: 'swap',
})

export const metadata: Metadata = {
  title: 'Jeevan Baabu Murugan — Portfolio',
  description: "Computer Science Engineering — AI & Machine Learning. I build full-stack products, AI tooling and edge–cloud systems, end to end.",
  openGraph: {
    title: 'Jeevan Baabu Murugan — Portfolio',
    description: "Computer Science Engineering — AI & Machine Learning. I build full-stack products, AI tooling and edge–cloud systems, end to end.",
    url: 'https://jeevanbaabu.vercel.app/',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jeevan Baabu Murugan — Portfolio',
    description: "Computer Science Engineering — AI & Machine Learning. I build full-stack products, AI tooling and edge–cloud systems, end to end.",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/J.png" sizes="any" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${serif.variable} ${barlow.variable}`}>
        {children}
      </body>
    </html>
  );
}
