/*
|-----------------------------------------
| setting up Page for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: m varse, October, 2025
|-----------------------------------------
*/

'use client'

// components/ComingSoonPage.tsx
import React, { useState, useEffect, useCallback } from 'react'
import { motion, Variants } from 'framer-motion'
import Link from 'next/link'

// --- Interfaces for Props ---
interface ComingSoonPageProps {
    logoUrl?: string
    launchDate?: string // ISO 8601 string, e.g., "YYYY-MM-DDTHH:mm:ssZ"
    headline?: string
    teaserText?: string
    socialLinks?: {
        twitter?: string
        linkedin?: string
        instagram?: string
    }
}

interface Countdown {
    days: number
    hours: number
    minutes: number
    seconds: number
}

// --- Placeholder API for Subscription ---
const handleSubscriptionSubmit = async (email: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (email.includes('@') && email.includes('.')) {
                // Simulate success
                resolve("You've been successfully subscribed!")
            } else {
                // Simulate error
                reject('Please enter a valid email address.')
            }
        }, 1500) // Simulate network delay
    })
}

const ComingSoonPage: React.FC<ComingSoonPageProps> = ({
    launchDate = '2024-12-31T00:00:00Z',
    headline = 'Something Awesome is Brewing!',
    teaserText = 'Our revolutionary new platform is launching soon. Get ready for a seamless experience!',
    socialLinks = {
        twitter: 'https://twitter.com/yourcompany',
        linkedin: 'https://linkedin.com/company/yourcompany',
        instagram: 'https://instagram.com/yourcompany',
    },
}) => {
    const [email, setEmail] = useState('')
    const [subscriptionStatus, setSubscriptionStatus] = useState<
        'idle' | 'loading' | 'success' | 'error'
    >('idle')
    const [message, setMessage] = useState('')
    const [countdown, setCountdown] = useState<Countdown>({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    })

    const calculateTimeLeft = useCallback(() => {
        const target = new Date(launchDate).getTime()
        const now = new Date().getTime()
        const difference = target - now

        if (difference <= 0) {
            return { days: 0, hours: 0, minutes: 0, seconds: 0 }
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor(
            (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        )
        const minutes = Math.floor(
            (difference % (1000 * 60 * 60)) / (1000 * 60)
        )
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        return { days, hours, minutes, seconds }
    }, [launchDate])

    useEffect(() => {
        setCountdown(calculateTimeLeft()) // Initial calculation
        const timer = setInterval(() => {
            setCountdown(calculateTimeLeft())
        }, 1000)

        return () => clearInterval(timer)
    }, [calculateTimeLeft])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (subscriptionStatus === 'loading') return

        setSubscriptionStatus('loading')
        setMessage('')

        try {
            const successMessage = await handleSubscriptionSubmit(email)
            setSubscriptionStatus('success')
            setMessage(successMessage)
            setEmail('') // Clear email on success
        } catch (error) {
            setSubscriptionStatus('error')
            setMessage(error instanceof Error ? error.message : String(error))
        }
    }

    // Framer Motion Variants
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    }

    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                damping: 10,
                stiffness: 100,
            },
        },
    }

    const countdownItemVariants: Variants = {
        hidden: { scale: 0.8, opacity: 0 },
        visible: { scale: 1, opacity: 1, transition: { duration: 0.5 } },
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">
            {/* Subtle Animated Background Gradients */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-neonBlue/20 via-neonGreen/20 to-neonPink/20 opacity-30 blur-3xl scale-150 animate-gradient-shift"
                initial={{ opacity: 0, scale: 1.2 }}
                animate={{ opacity: 0.3, scale: 1.5 }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: 'linear',
                    repeatType: 'reverse',
                }}
            ></motion.div>
            <motion.div
                className="absolute inset-0 bg-gradient-to-br from-neonGreen/20 via-neonBlue/20 to-neonPink/20 opacity-20 blur-3xl scale-125 animate-gradient-shift delay-1000"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 0.2, scale: 1.25 }}
                transition={{
                    duration: 7,
                    repeat: Infinity,
                    ease: 'linear',
                    repeatType: 'reverse',
                }}
            ></motion.div>

            <motion.div
                className="relative z-10 text-center max-w-4xl w-full"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <h2 className="h2">Public page </h2> {/* Headline */}
                <motion.h1
                    variants={itemVariants}
                    className="text-4xl md:text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-neonBlue to-neonGreen drop-shadow-lg"
                >
                    {headline}
                </motion.h1>
                {/* Teaser Text */}
                <motion.p
                    variants={itemVariants}
                    className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
                >
                    {teaserText}
                </motion.p>
                {/* Countdown Timer */}
                {new Date(launchDate).getTime() > new Date().getTime() && (
                    <motion.div variants={itemVariants} className="mb-12">
                        <h2 className="text-2xl font-semibold mb-4 text-neonPink">
                            Launching In:
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-lg mx-auto">
                            <motion.div
                                variants={countdownItemVariants}
                                className="bg-gray-700/50 p-4 rounded-lg backdrop-blur-sm shadow-xl border border-neonBlue/30"
                            >
                                <p className="text-4xl md:text-5xl font-bold text-neonBlue">
                                    {countdown.days.toString().padStart(2, '0')}
                                </p>
                                <p className="text-sm text-gray-400">Days</p>
                            </motion.div>
                            <motion.div
                                variants={countdownItemVariants}
                                className="bg-gray-700/50 p-4 rounded-lg backdrop-blur-sm shadow-xl border border-neonGreen/30"
                            >
                                <p className="text-4xl md:text-5xl font-bold text-neonGreen">
                                    {countdown.hours
                                        .toString()
                                        .padStart(2, '0')}
                                </p>
                                <p className="text-sm text-gray-400">Hours</p>
                            </motion.div>
                            <motion.div
                                variants={countdownItemVariants}
                                className="bg-gray-700/50 p-4 rounded-lg backdrop-blur-sm shadow-xl border border-neonPink/30"
                            >
                                <p className="text-4xl md:text-5xl font-bold text-neonPink">
                                    {countdown.minutes
                                        .toString()
                                        .padStart(2, '0')}
                                </p>
                                <p className="text-sm text-gray-400">Minutes</p>
                            </motion.div>
                            <motion.div
                                variants={countdownItemVariants}
                                className="bg-gray-700/50 p-4 rounded-lg backdrop-blur-sm shadow-xl border border-neonBlue/30"
                            >
                                <p className="text-4xl md:text-5xl font-bold text-neonBlue">
                                    {countdown.seconds
                                        .toString()
                                        .padStart(2, '0')}
                                </p>
                                <p className="text-sm text-gray-400">Seconds</p>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
                {/* Email Subscription Form */}
                <motion.div
                    variants={itemVariants}
                    className="mb-12 max-w-md mx-auto"
                >
                    <h2 className="text-xl md:text-2xl font-semibold mb-4 text-neonGreen">
                        Get Notified on Launch!
                    </h2>
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col sm:flex-row gap-4"
                    >
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="flex-grow p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-neonBlue transition-all duration-200"
                            required
                            aria-label="Email address for notification"
                        />
                        <motion.button
                            type="submit"
                            className={`bg-neonPink hover:bg-neonBlue text-white font-bold py-3 px-6 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out
                ${subscriptionStatus === 'loading' ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}`}
                            disabled={subscriptionStatus === 'loading'}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {subscriptionStatus === 'loading'
                                ? 'Subscribing...'
                                : 'Notify Me!'}
                        </motion.button>
                    </form>
                    {message && (
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`mt-4 text-sm ${
                                subscriptionStatus === 'success'
                                    ? 'text-neonGreen'
                                    : 'text-red-400'
                            }`}
                        >
                            {message}
                        </motion.p>
                    )}
                </motion.div>
                {/* Social Media Links */}
                <motion.div
                    variants={itemVariants}
                    className="flex justify-center space-x-6"
                >
                    {socialLinks.twitter && (
                        <Link
                            href={socialLinks.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <motion.span
                                className="text-gray-400 hover:text-neonBlue transition-colors duration-200 text-3xl"
                                whileHover={{ scale: 1.2, y: -5 }}
                                whileTap={{ scale: 0.9 }}
                                aria-label="Twitter"
                            >
                                {/* Placeholder for a Twitter icon, use a library like react-icons in a real app */}
                                <i className="fab fa-twitter"></i> 🚀
                            </motion.span>
                        </Link>
                    )}
                    {socialLinks.linkedin && (
                        <Link
                            href={socialLinks.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <motion.span
                                className="text-gray-400 hover:text-neonGreen transition-colors duration-200 text-3xl"
                                whileHover={{ scale: 1.2, y: -5 }}
                                whileTap={{ scale: 0.9 }}
                                aria-label="LinkedIn"
                            >
                                {/* Placeholder for a LinkedIn icon */}
                                <i className="fab fa-linkedin"></i> 💼
                            </motion.span>
                        </Link>
                    )}
                    {socialLinks.instagram && (
                        <Link
                            href={socialLinks.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <motion.span
                                className="text-gray-400 hover:text-neonPink transition-colors duration-200 text-3xl"
                                whileHover={{ scale: 1.2, y: -5 }}
                                whileTap={{ scale: 0.9 }}
                                aria-label="Instagram"
                            >
                                {/* Placeholder for an Instagram icon */}
                                <i className="fab fa-instagram"></i> 📸
                            </motion.span>
                        </Link>
                    )}
                </motion.div>
            </motion.div>
        </div>
    )
}

export default ComingSoonPage
