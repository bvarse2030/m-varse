'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button' // Assuming you use shadcn/ui.

// TypeScript interface for the BeforeInstallPromptEvent
interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[]
    readonly userChoice: Promise<{
        outcome: 'accepted' | 'dismissed'
        platform: string
    }>
    prompt(): Promise<void>
}

export default function PWAInstallPrompt() {
    const [installPromptEvent, setInstallPromptEvent] =
        useState<BeforeInstallPromptEvent | null>(null)
    const [isBannerVisible, setIsBannerVisible] = useState(false)

    // Effect to handle the 'beforeinstallprompt' event
    useEffect(() => {
        const handleBeforeInstallPrompt = (event: Event) => {
            event.preventDefault()
            setInstallPromptEvent(event as BeforeInstallPromptEvent)
            setIsBannerVisible(true)
        }

        window.addEventListener(
            'beforeinstallprompt',
            handleBeforeInstallPrompt
        )

        return () => {
            window.removeEventListener(
                'beforeinstallprompt',
                handleBeforeInstallPrompt
            )
        }
    }, [])

    // Effect to automatically hide the banner after 5 seconds
    useEffect(() => {
        let timer: NodeJS.Timeout
        if (isBannerVisible) {
            // Set a timer to hide the banner
            timer = setTimeout(() => {
                setIsBannerVisible(false)
            }, 5000) // 5000 milliseconds = 5 seconds
        }

        // Cleanup the timer if the component unmounts or banner is hidden manually
        return () => {
            if (timer) {
                clearTimeout(timer)
            }
        }
    }, [isBannerVisible])

    const handleInstallClick = async () => {
        if (!installPromptEvent) {
            return
        }

        // Show the browser's installation prompt
        installPromptEvent.prompt()

        // Wait for the user to respond
        await installPromptEvent.userChoice

        // The prompt can only be used once, so clear the state
        setInstallPromptEvent(null)
        setIsBannerVisible(false)
    }

    return (
        <AnimatePresence>
            {isBannerVisible && (
                <motion.div
                    initial={{ y: 200, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 200, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                    // Positioning container for the banner
                    className="fixed bottom-4 inset-x-4 z-50 sm:inset-x-0 sm:flex sm:justify-center"
                >
                    {/* The visual banner */}
                    <div className="w-full max-w-lg bg-gray-900 text-white rounded-xl shadow-2xl p-4 flex items-center justify-between gap-4">
                        <div className="flex-grow">
                            <h3 className="font-bold">Install App</h3>
                            <p className="text-sm text-gray-300">
                                Get a better experience on your device.
                            </p>
                        </div>
                        <Button
                            onClick={handleInstallClick}
                            className="bg-indigo-600 text-white hover:bg-indigo-700 shrink-0"
                            size="lg"
                        >
                            Install
                        </Button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
