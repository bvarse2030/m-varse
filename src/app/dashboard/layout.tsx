/*
|-----------------------------------------
| setting up Page for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: m varse, October, 2025
|-----------------------------------------
*/

'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
    FaBars,
    FaTimes,
    FaHome,
    FaUserCircle,
    FaCog,
    FaUsers,
    FaClipboardList,
    FaKey,
    FaSignOutAlt, // Import the logout icon
} from 'react-icons/fa'
import { signOut } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'

interface SidebarItem {
    id: number
    name: string
    path: string
    icon: React.ElementType
}

const sidebarData: SidebarItem[] = [
    { id: 1, name: 'Dashboard', path: '/dashboard', icon: FaHome },
    { id: 2, name: 'Account', path: '/dashboard/account', icon: FaUserCircle },
    { id: 3, name: 'Settings', path: '/dashboard/settings', icon: FaCog },
    { id: 4, name: 'Users', path: '/dashboard/users', icon: FaUsers },
    {
        id: 5,
        name: 'Sessions',
        path: '/dashboard/sessions',
        icon: FaClipboardList,
    },
    { id: 6, name: 'Token', path: '/dashboard/token', icon: FaKey },
]

interface DashboardLayoutProps {
    children: React.ReactNode
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    const pathname = usePathname()
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] =
        useState(false)

    useEffect(() => {
        if (isSidebarOpen) {
            setIsSidebarOpen(false)
        }
    }, [pathname, isSidebarOpen])

    const router = useRouter()

    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768)
        }

        if (typeof window !== 'undefined') {
            handleResize()
            window.addEventListener('resize', handleResize)
        }

        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('resize', handleResize)
            }
        }
    }, [])

    const toggleSidebar = () => {
        if (isMobile) {
            setIsSidebarOpen(!isSidebarOpen)
        } else {
            setIsDesktopSidebarCollapsed(!isDesktopSidebarCollapsed)
        }
    }
    const handleLogout = async () => {
        const signOutData = await signOut()
        if (signOutData?.data?.success) {
            router.push('/')
        }
    }

    const sidebarVariants = {
        mobileOpen: { x: 0, opacity: 1 },
        mobileClosed: { x: '-100%', opacity: 0 },
        desktopExpanded: { width: '16rem', opacity: 1 },
        desktopCollapsed: { width: '4rem', opacity: 1 },
    }

    const navItemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 },
    }

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <AnimatePresence>
                {isMobile && isSidebarOpen && (
                    <motion.div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {(isMobile && isSidebarOpen) ||
                (!isMobile && isDesktopSidebarCollapsed === false) ||
                (!isMobile && isDesktopSidebarCollapsed === true) ? (
                    <motion.aside
                        className={`
              fixed md:static top-0 left-0 h-full bg-gray-800 dark:bg-gray-950 text-white z-50
              ${isMobile ? 'w-64' : isDesktopSidebarCollapsed ? 'w-16' : 'w-64'}
              flex flex-col
              transition-all duration-300 ease-in-out
            `}
                        initial={
                            isMobile
                                ? 'mobileClosed'
                                : isDesktopSidebarCollapsed
                                  ? 'desktopCollapsed'
                                  : 'desktopExpanded'
                        }
                        animate={
                            isMobile
                                ? isSidebarOpen
                                    ? 'mobileOpen'
                                    : 'mobileClosed'
                                : isDesktopSidebarCollapsed
                                  ? 'desktopCollapsed'
                                  : 'desktopExpanded'
                        }
                        exit={
                            isMobile
                                ? 'mobileClosed'
                                : isDesktopSidebarCollapsed
                                  ? 'desktopCollapsed'
                                  : 'desktopExpanded'
                        }
                        variants={sidebarVariants}
                        transition={{
                            type: 'spring',
                            stiffness: 200,
                            damping: 25,
                        }}
                    >
                        <div
                            className={`p-4 flex items-center ${isDesktopSidebarCollapsed && !isMobile ? 'justify-center' : 'justify-between'}`}
                        >
                            {!isDesktopSidebarCollapsed || isMobile ? (
                                <Link href="/">
                                    <span className="text-2xl font-bold cursor-pointer transition-opacity duration-300">
                                        Profile
                                    </span>
                                </Link>
                            ) : (
                                <span className="text-2xl font-bold transition-opacity duration-300"></span>
                            )}
                            {isMobile && (
                                <button
                                    onClick={toggleSidebar}
                                    className="text-gray-400 hover:text-white transition-colors duration-200"
                                    aria-label="Close sidebar"
                                >
                                    <FaTimes className="w-6 h-6" />
                                </button>
                            )}
                            {!isMobile && (
                                <button
                                    onClick={toggleSidebar}
                                    className={`text-gray-400 hover:text-white transition-all duration-300 ease-in-out
                    ${isDesktopSidebarCollapsed ? 'rotate-180' : ''}`}
                                    aria-label={
                                        isDesktopSidebarCollapsed
                                            ? 'Expand sidebar'
                                            : 'Collapse sidebar'
                                    }
                                >
                                    <FaBars className="w-5 h-5" />
                                </button>
                            )}
                        </div>

                        {/* Sidebar Navigation */}
                        <nav className="flex-grow mt-5">
                            <ul>
                                {sidebarData.map((item) => {
                                    const isActive =
                                        pathname === item.path ||
                                        (item.path !== '/dashboard' &&
                                            pathname.startsWith(item.path))
                                    return (
                                        <motion.li
                                            key={item.id}
                                            className="relative"
                                            initial="hidden"
                                            animate="visible"
                                            variants={navItemVariants}
                                            transition={{ delay: 0.1 }}
                                            whileHover={{
                                                backgroundColor:
                                                    'rgba(255,255,255,0.08)',
                                                scale: 1.02,
                                            }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <Link href={item.path}>
                                                <span
                                                    className={`
                            flex items-center py-3 mx-3 rounded-lg text-sm font-medium
                            ${isActive ? 'bg-blue-600 text-white shadow-md' : 'text-gray-300 hover:text-white'}
                            transition-all duration-200 ease-in-out
                            ${isDesktopSidebarCollapsed && !isMobile ? 'justify-center pl-0' : ' pl-3'}
                          `}
                                                    aria-current={
                                                        isActive
                                                            ? 'page'
                                                            : undefined
                                                    }
                                                >
                                                    <item.icon
                                                        className={`h-5 w-5 ${!isDesktopSidebarCollapsed || isMobile ? 'mr-3' : ''}`}
                                                    />
                                                    {(!isDesktopSidebarCollapsed ||
                                                        isMobile) && (
                                                        <span>{item.name}</span>
                                                    )}
                                                    {isDesktopSidebarCollapsed &&
                                                        !isMobile && (
                                                            <span className="absolute left-full ml-2 w-max px-3 py-1 bg-gray-700 text-white text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                                                                {item.name}
                                                            </span>
                                                        )}
                                                </span>
                                            </Link>
                                        </motion.li>
                                    )
                                })}
                            </ul>
                        </nav>

                        {/* Logout Button */}
                        <div
                            className={`p-4 border-t border-gray-700 ${isDesktopSidebarCollapsed && !isMobile ? 'flex justify-center' : ''}`}
                        >
                            <motion.button
                                onClick={handleLogout}
                                className={`
                    flex items-center py-3 mx-3 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-red-600
                    transition-all duration-200 ease-in-out
                    ${isDesktopSidebarCollapsed && !isMobile ? 'justify-center pl-0 min-w-[40px]' : 'min-w-[120px] pl-3'}
                `}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <FaSignOutAlt
                                    className={`h-5 w-5 ${!isDesktopSidebarCollapsed || isMobile ? 'mr-3' : ''}`}
                                />
                                {(!isDesktopSidebarCollapsed || isMobile) && (
                                    <span>Logout</span>
                                )}
                                {isDesktopSidebarCollapsed && !isMobile && (
                                    <span className="absolute left-full ml-2 w-max px-3 py-1 bg-gray-700 text-white text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                                        Logout
                                    </span>
                                )}
                            </motion.button>
                        </div>
                    </motion.aside>
                ) : null}
            </AnimatePresence>

            <main
                className={`flex-grow p-6 transition-all duration-300 ease-in-out ${isDesktopSidebarCollapsed && !isMobile ? 'md:ml-4' : 'md:ml-8'}`}
            >
                {isMobile && !isSidebarOpen && (
                    <button
                        onClick={toggleSidebar}
                        className="fixed top-4 left-4 z-30 bg-gray-700 p-2 rounded-md text-white md:hidden shadow-lg hover:bg-gray-600 transition-colors duration-200"
                        aria-label="Open sidebar"
                    >
                        <FaBars className="w-6 h-6" />
                    </button>
                )}
                {children}
            </main>
        </div>
    )
}

export default DashboardLayout
