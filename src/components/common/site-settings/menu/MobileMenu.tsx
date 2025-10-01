'use client'
import Link from 'next/link'
import { useState } from 'react'
// Client component for mobile menu interaction
export function MobileMenu({
    menuItems,
}: {
    menuItems: { name: string; path: string }[]
}) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="focus:outline-none"
            >
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d={
                            isOpen
                                ? 'M6 18L18 6M6 6l12 12'
                                : 'M4 6h16M4 12h16m-7 6h7'
                        }
                    ></path>
                </svg>
            </button>
            {isOpen && (
                <div className="absolute top-16 left-0 w-full bg-gray-800">
                    <div className="flex flex-col items-center space-y-4 py-4">
                        {menuItems.map((item) => (
                            <Link
                                href={item.path}
                                key={item.name}
                                className="hover:text-gray-400 transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </>
    )
}
