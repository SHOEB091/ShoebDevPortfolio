import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ShoebDev',
  description: 'this is the Portfolio of Developer shoeb ',
  generator: '',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
