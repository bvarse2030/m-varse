/*
|-----------------------------------------
| setting up MenuBarNextComponent for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: m varse, October, 2025
|-----------------------------------------
*/

'use client'

// components/MenuBarNextComponent.tsx
import React, { useState } from 'react'
import Link from 'next/link'

export interface MenuItem {
    id: number
    title: string
    url: string
}

export const menuData: MenuItem[] = [
    { id: 1, title: 'Home', url: '/' },
    { id: 2, title: 'About', url: '/about' },
    { id: 3, title: 'Private', url: '/private' },
    { id: 4, title: 'Public', url: '/public' },
    { id: 5, title: 'Login', url: '/login' },
    { id: 6, title: 'Registration', url: '/registration' },
    { id: 7, title: 'Dashboard', url: '/dashboard' },
]

const MenuBarNextComponent: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false)

    const toggleMenu = () => {
        setIsOpen(!isOpen)
    }

    return (
        <nav className="bg-gray-800 text-white p-4 shadow-md relative z-50">
            <div className="container mx-auto flex justify-between items-center">
                {/* Brand/Logo */}
                <div className="flex-shrink-0">
                    <Link href="/">
                        <span className="text-xl font-bold cursor-pointer">
                            App Name
                        </span>
                    </Link>
                </div>

                {/* Hamburger Icon (Mobile) */}
                <div className="md:hidden">
                    <button
                        onClick={toggleMenu}
                        className="text-white focus:outline-none"
                        aria-label="Toggle menu"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            {isOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                ></path>
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                ></path>
                            )}
                        </svg>
                    </button>
                </div>

                {/* Navigation Links (Desktop & Mobile) */}
                <div
                    className={`${
                        isOpen ? 'block' : 'hidden'
                    } absolute md:static md:flex md:items-center md:w-auto w-full left-0 top-full bg-gray-800 md:bg-transparent shadow-lg md:shadow-none transition-all duration-300 ease-in-out`}
                >
                    <ul className="flex flex-col md:flex-row md:space-x-8 mt-4 md:mt-0 px-4 pb-4 md:p-0">
                        {menuData.map((item: MenuItem) => (
                            <li key={item.id} className="mb-2 md:mb-0">
                                <Link href={item.url}>
                                    <span
                                        onClick={() => setIsOpen(false)} // Close menu on click
                                        className="block py-2 px-3 text-white hover:text-blue-400 rounded transition-colors duration-200 cursor-pointer"
                                    >
                                        {item.title}
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default MenuBarNextComponent
