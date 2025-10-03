import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import MenuBarNextComponent from '@/components/common/Menu'

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
})

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
})

export const metadata: Metadata = {
    title: 'M Varse',
    description: 'Malti Varse',
    manifest: '/manifest.json',
    icons: {
        apple: '/icons/icon-192x192.png',
    },
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                {/* <MenuComponent /> */}
                <MenuBarNextComponent />
                {children}
                {/* <PWAInstallPrompt /> */}
            </body>
        </html>
    )
}
