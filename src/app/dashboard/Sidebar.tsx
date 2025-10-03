// components/Sidebar.tsx
import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
    FaBars,
    FaTimes,
    FaHome,
    FaUserCircle,
    FaCog,
    FaUsers,
    FaClipboardList,
    FaKey,
    FaSignOutAlt,
} from 'react-icons/fa'
import { signOut } from '@/lib/auth-client'

interface SidebarItem {
    id: number
    name: string
    path: string
    icon: React.ElementType
}

const fullSidebarData: SidebarItem[] = [
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
    { id: 7, name: 'Logout', path: '/logout', icon: FaSignOutAlt },
]

interface SidebarProps {
    isMobile: boolean
    isSidebarOpen: boolean
    setIsSidebarOpen: (open: boolean) => void
    isDesktopSidebarCollapsed: boolean
    setIsDesktopSidebarCollapsed: (collapsed: boolean) => void
}

const Sidebar: React.FC<SidebarProps> = ({
    isMobile,
    isSidebarOpen,
    setIsSidebarOpen,
    isDesktopSidebarCollapsed,
    setIsDesktopSidebarCollapsed,
}) => {
    const pathname = usePathname()
    const router = useRouter()

    const handleLogout = async () => {
        const signOutData = await signOut()
        if (signOutData?.data?.success) {
            router.push('/')
        }
    }

    const toggleDesktopSidebar = () => {
        setIsDesktopSidebarCollapsed(!isDesktopSidebarCollapsed)
    }

    const handleSidebarItemClick = (path: string) => {
        if (isMobile) {
            setIsSidebarOpen(false)
        }
        if (path === '/logout') {
            handleLogout()
        } else {
            router.push(path)
        }
    }

    return (
        <>
            {isMobile && isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <aside
                className={`
                    fixed md:static top-0 left-0 h-full bg-gray-800 dark:bg-gray-950 text-white z-50
                    flex flex-col min-h-screen
                    transition-all duration-300 ease-in-out
                    ${
                        isMobile
                            ? isSidebarOpen
                                ? 'w-[90%] translate-x-0' // Mobile: 90% width when open
                                : 'w-[90%] -translate-x-full' // Mobile: 90% width but off-screen when closed
                            : isDesktopSidebarCollapsed
                              ? 'w-16' // Desktop: collapsed width
                              : 'w-64' // Desktop: expanded width
                    }
                    ${!isMobile && !isDesktopSidebarCollapsed ? 'md:translate-x-0' : ''}
                `}
                style={isMobile && !isSidebarOpen ? { display: 'none' } : {}}
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
                            onClick={() => setIsSidebarOpen(false)}
                            className="text-gray-400 hover:text-white transition-colors duration-200"
                            aria-label="Close sidebar"
                        >
                            <FaTimes className="w-6 h-6" />
                        </button>
                    )}
                    {!isMobile && (
                        <button
                            onClick={toggleDesktopSidebar}
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

                <nav className="flex-grow mt-5">
                    <ul>
                        {fullSidebarData.map((item) => {
                            const isActive =
                                pathname === item.path ||
                                (item.path !== '/dashboard' &&
                                    pathname.startsWith(item.path))
                            return (
                                <li key={item.id} className="relative">
                                    <button
                                        onClick={() =>
                                            handleSidebarItemClick(item.path)
                                        }
                                        className={`
                                            flex items-center py-3 mx-auto rounded-lg text-sm font-medium text-left w-[85%] 
                                            ${isActive ? 'bg-blue-600 text-white shadow-md' : 'text-gray-300 hover:text-white hover:bg-gray-700'}
                                            transition-all duration-200 ease-in-out
                                            ${isDesktopSidebarCollapsed && !isMobile ? 'justify-center pl-0' : ' pl-3'}
                                        `}
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
                                    </button>
                                </li>
                            )
                        })}
                    </ul>
                </nav>

                <div
                    className={`p-4 border-t border-gray-700 ${isDesktopSidebarCollapsed && !isMobile ? 'flex justify-center' : ''}`}
                />
            </aside>
        </>
    )
}

export default Sidebar
