import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import MenuComponent from '@/components/common/site-settings/MenuComponent'
import PWAInstallPrompt from '@/components/common/home-pwa-install-popup/PWAInstallPrompt'

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
})

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
})

export const metadata: Metadata = {
    title: '__common_Name',
    description: '_common_2_Description',
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
                <MenuComponent />
                {children}
                <PWAInstallPrompt />
            </body>
        </html>
    )
}
