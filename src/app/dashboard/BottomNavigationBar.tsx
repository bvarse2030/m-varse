// components/BottomNavigationBar.tsx
import React from 'react'
import { useRouter, usePathname } from 'next/navigation'
import {
    FaHandPointRight,
    FaShoppingCart,
    FaCloudUploadAlt,
    FaCog,
} from 'react-icons/fa'

interface BottomNavItem {
    id: number
    name: string
    path: string
    icon: React.ElementType
}

const bottomNavItems: BottomNavItem[] = [
    { id: 1, name: 'Button1', path: '/dashboard', icon: FaHandPointRight },
    {
        id: 2,
        name: 'Button2',
        path: '/dashboard/account',
        icon: FaShoppingCart,
    },
    {
        id: 3,
        name: 'Button3',
        path: '/dashboard/users',
        icon: FaCloudUploadAlt,
    },
    { id: 4, name: 'Settings', path: '/settings-toggle', icon: FaCog },
]

interface BottomNavigationBarProps {
    setIsSidebarOpen: (open: boolean) => void
}

const BottomNavigationBar: React.FC<BottomNavigationBarProps> = ({
    setIsSidebarOpen,
}) => {
    const router = useRouter()
    const pathname = usePathname()

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-800 dark:bg-gray-950 text-white h-16 flex justify-around items-center border-t border-gray-700 z-50 md:hidden">
            {bottomNavItems.map((item) => {
                const isActive =
                    pathname === item.path ||
                    (item.path !== '/dashboard' &&
                        pathname.startsWith(item.path) &&
                        item.path !== '/settings-toggle')
                return (
                    <button
                        key={item.id}
                        className={`
                            flex flex-col items-center justify-center p-2 text-xs
                            ${isActive ? 'text-blue-500' : 'text-gray-300 hover:text-white'}
                            transition-colors duration-200
                        `}
                        onClick={() => {
                            if (item.path === '/settings-toggle') {
                                setIsSidebarOpen(true)
                            } else {
                                router.push(item.path)
                            }
                        }}
                    >
                        <item.icon className="h-6 w-6 mb-1" />
                        <span>{item.name}</span>
                    </button>
                )
            })}
        </div>
    )
}

export default BottomNavigationBar
