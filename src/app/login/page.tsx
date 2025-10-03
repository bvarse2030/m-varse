/*
|-----------------------------------------
| setting up Page for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: m varse, October, 2025
|-----------------------------------------
*/
'use client'
// components/LoginPage.tsx
import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FaEye, FaEyeSlash, FaGoogle } from 'react-icons/fa' // For show/hide password and Google icon

const AnimatedBackgroundSVG: React.FC = () => (
    <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1440 810" // Adjust viewBox to your desired aspect ratio
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        {/* Subtle Animated Gradients */}
        <motion.circle
            cx="700"
            cy="100"
            r="300"
            className="fill-blue-400 opacity-20"
            initial={{ scale: 0.8, x: 0, y: 0 }}
            animate={{ scale: 1.2, x: 50, y: -20 }}
            transition={{
                duration: 15,
                repeat: Infinity,
                repeatType: 'mirror',
                ease: 'easeInOut',
            }}
        />
        <motion.circle
            cx="200"
            cy="500"
            r="250"
            className="fill-purple-400 opacity-20"
            initial={{ scale: 1.1, x: 0, y: 0 }}
            animate={{ scale: 0.9, x: -30, y: 30 }}
            transition={{
                duration: 12,
                repeat: Infinity,
                repeatType: 'mirror',
                ease: 'easeInOut',
            }}
        />
        <motion.circle
            cx="1000"
            cy="700"
            r="350"
            className="fill-green-400 opacity-20"
            initial={{ scale: 0.9, x: 0, y: 0 }}
            animate={{ scale: 1.1, x: 20, y: -40 }}
            transition={{
                duration: 18,
                repeat: Infinity,
                repeatType: 'mirror',
                ease: 'easeInOut',
            }}
        />

        {/* Calm, abstract wave/line animation */}
        <motion.path
            d="M0 400 C300 300, 600 500, 900 400 S1200 300, 1440 400"
            stroke="url(#gradientWave)"
            strokeWidth="3"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
                duration: 5,
                ease: 'easeInOut',
                repeat: Infinity,
                repeatType: 'mirror',
            }}
        />
        <defs>
            <linearGradient id="gradientWave" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#81E6D9" /> {/* Teal */}
                <stop offset="50%" stopColor="#4FD1C5" /> {/* Cyan */}
                <stop offset="100%" stopColor="#38B2AC" /> {/* Darker Cyan */}
            </linearGradient>
        </defs>
    </svg>
)

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        // Simulate API call
        try {
            if (email === 'test@example.com' && password === 'password123') {
                await new Promise((resolve) => setTimeout(resolve, 1500))
                alert('Login successful!')
                // In a real app, redirect to dashboard or set auth token
            } else {
                await new Promise((resolve) => setTimeout(resolve, 1500))
                setError('Invalid email or password.')
            }
        } catch (err) {
            setError('An unexpected error occurred.')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleSignIn = () => {
        alert('Google Sign-In initiated!')
        // In a real app, initiate OAuth flow
    }

    // Framer Motion variants for staggered entrance
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 },
    }

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-4">
            <div className="max-w-6xl w-full bg-gray-800 rounded-xl shadow-2xl overflow-hidden md:grid md:grid-cols-2">
                {/* Left Side: Animation */}
                <motion.div
                    className="relative hidden md:flex items-center justify-center bg-gradient-to-br from-blue-700 to-purple-800 p-8"
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                    <AnimatedBackgroundSVG />
                    <div className="relative z-10 text-center">
                        <h2 className="text-4xl font-extrabold mb-4 drop-shadow-lg text-white">
                            Welcome Back!
                        </h2>
                        <p className="text-lg text-blue-200">
                            Log in to access your personalized dashboard.
                        </p>
                    </div>
                </motion.div>

                {/* Right Side: Login Form */}
                <motion.div
                    className="p-8 lg:p-12 flex flex-col justify-center"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.h1
                        variants={itemVariants}
                        className="text-4xl font-bold text-center mb-10 text-white"
                    >
                        Login
                    </motion.h1>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <motion.div variants={itemVariants}>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-300 mb-2"
                            >
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                aria-label="Email address"
                            />
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-300 mb-2"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10 transition-all duration-200"
                                    placeholder="********"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    required
                                    aria-label="Password"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white focus:outline-none"
                                    aria-label={
                                        showPassword
                                            ? 'Hide password'
                                            : 'Show password'
                                    }
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            className="flex justify-end text-sm"
                        >
                            <Link href="/forgot-password">
                                <span className="text-blue-400 hover:text-blue-300 transition-colors duration-200 cursor-pointer">
                                    Forgot Password?
                                </span>
                            </Link>
                        </motion.div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-red-400 text-sm text-center"
                            >
                                {error}
                            </motion.div>
                        )}

                        <motion.button
                            type="submit"
                            className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 ${
                                loading
                                    ? 'opacity-70 cursor-not-allowed'
                                    : 'hover:scale-105 active:scale-95'
                            }`}
                            disabled={loading}
                            variants={itemVariants}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {loading ? 'Logging in...' : 'Sign In'}
                        </motion.button>
                    </form>

                    <motion.div
                        variants={itemVariants}
                        className="mt-8 text-center relative"
                    >
                        <div className="relative flex items-center justify-center my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-700"></div>
                            </div>
                            <div className="relative bg-gray-800 px-4 text-sm text-gray-400">
                                Or continue with
                            </div>
                        </div>

                        <motion.button
                            onClick={handleGoogleSignIn}
                            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
                            disabled={loading}
                            variants={itemVariants}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <FaGoogle className="text-lg" /> Sign in with Google
                        </motion.button>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    )
}

export default LoginPage
