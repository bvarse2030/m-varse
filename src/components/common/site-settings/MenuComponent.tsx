import Link from 'next/link'
import { MobileMenu } from './MobileMenu'

interface MenuData {
    _id: string
    home: string
    about: string
    contact: string
    dashboard: string
    private: string
    public: string
    privacyPolicy: string
    termsAndCondition: string
}

async function getMenuData(): Promise<MenuData | null> {
    try {
        const res = await fetch(
            `${process.env.BASE_URL}api/site-setting/menu/v1`,
            {
                next: { tags: ['menu'] },
            }
        )

        if (!res.ok) {
            return null
        }

        const data = await res.json()
        return data.data.menus[0]
    } catch (error) {
        console.error('Failed to fetch menu data:', error)
        return null
    }
}

export default async function MenuComponent() {
    const menuData = await getMenuData()

    if (!menuData) {
        return <div>Error loading menu.</div>
    }

    const menuItems = [
        { name: 'Home', path: menuData.home },
        { name: 'About', path: menuData.about },
        { name: 'Contact', path: menuData.contact },
        { name: 'Dashboard', path: menuData.dashboard },
        { name: 'Private', path: menuData.private },
        { name: 'Public', path: menuData.public },
        { name: 'Privacy Policy', path: menuData.privacyPolicy },
        { name: 'Terms & Condition', path: menuData.termsAndCondition },
    ]

    return (
        <nav className="bg-gray-800 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-xl font-bold">
                    <Link href="/">Logo</Link>
                </div>
                <div className="hidden md:flex space-x-4">
                    {menuItems.map((item) => (
                        <Link
                            href={item.path}
                            key={item.name}
                            className="hover:text-gray-400 transition-colors"
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>
                <div className="md:hidden">
                    <MobileMenu menuItems={menuItems} />
                </div>
            </div>
        </nav>
    )
}
