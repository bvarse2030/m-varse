// app/dashboard/layout.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Sidebar from './Sidebar'
import BottomNavigationBar from './BottomNavigationBar'

interface DashboardLayoutProps {
    children: React.ReactNode
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    const pathname = usePathname()
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] =
        useState(false)
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

    useEffect(() => {
        if (isMobile && isSidebarOpen && pathname !== '/settings-toggle') {
            setIsSidebarOpen(false)
        }
    }, [pathname, isMobile])
    useEffect(() => {
        if (!isMobile && isSidebarOpen) {
            setIsSidebarOpen(false)
            setIsDesktopSidebarCollapsed(false)
        }
    }, [isMobile, isSidebarOpen])

    return (
        <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <Sidebar
                isMobile={isMobile}
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                isDesktopSidebarCollapsed={isDesktopSidebarCollapsed}
                setIsDesktopSidebarCollapsed={setIsDesktopSidebarCollapsed}
            />

            <main
                className={`flex-grow p-6 transition-all duration-300 ease-in-out
                    ${isMobile ? 'pb-16' : ''}
                    ${!isMobile && isDesktopSidebarCollapsed ? 'md:ml-16' : 'md:ml-64'}
                `}
            >
                {children}
            </main>

            {isMobile && (
                <BottomNavigationBar setIsSidebarOpen={setIsSidebarOpen} />
            )}
        </div>
    )
}

export default DashboardLayout
