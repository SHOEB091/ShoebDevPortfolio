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
      <head>
        {/* Remixicon stylesheet for arrow icon used in GTA landing */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/remixicon@4.3.0/fonts/remixicon.css"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
