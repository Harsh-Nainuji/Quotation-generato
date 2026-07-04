import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Toaster } from 'sonner'

import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Kalam, Patrick_Hand } from 'next/font/google'

const kalam = Kalam({ subsets: ['latin'], variable: '--font-kalam', weight: ['300', '400', '700'] })
const patrickHand = Patrick_Hand({ subsets: ['latin'], variable: '--font-patrick-hand', weight: ['400'] })

export const metadata: Metadata = {
  title: 'QuoteFlow - Professional Proposal Builder',
  description: 'Create, customize, and share professional proposals instantly with QuoteFlow',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${kalam.variable} ${patrickHand.variable} light`}>
      <body className="font-sans antialiased text-[#2d2d2d] bg-[#fdfbf7] selection:bg-[#ff4d4d] selection:text-white">
        {children}
        <Toaster />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
