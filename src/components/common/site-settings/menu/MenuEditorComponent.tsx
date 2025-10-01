'use client'

import { useState, useEffect } from 'react'

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

export default function MenuEditorComponent() {
    const [menuData, setMenuData] = useState<MenuData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchMenuData() {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/api/site-setting/menu/v1`
                )
                if (!res.ok) {
                    throw new Error('Failed to fetch menu data')
                }
                const data = await res.json()
                setMenuData(data.data.menus[0])
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : 'An unknown error occurred'
                )
            } finally {
                setIsLoading(false)
            }
        }
        fetchMenuData()
    }, [])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (menuData) {
            setMenuData({
                ...menuData,
                [e.target.name]: e.target.value,
            })
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!menuData) return

        try {
            const res = await fetch(
                `${process.env.BASE_URL}/api/site-setting/menu/v1`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id: menuData._id,
                        ...menuData,
                    }),
                }
            )

            if (!res.ok) {
                throw new Error('Failed to update menu')
            }

            // Revalidate the menu component
            await fetch('/api/revalidate?tag=menu')
            alert('Menu updated and revalidated successfully!')
        } catch (err) {
            setError(
                err instanceof Error ? err.message : 'An unknown error occurred'
            )
        }
    }

    if (isLoading) {
        return <div className="p-8 text-center">Loading...</div>
    }

    if (error) {
        return (
            <div className="p-8 text-center text-red-500">Error: {error}</div>
        )
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-4 p-8 bg-white shadow-md rounded-lg"
        >
            {menuData &&
                (Object.keys(menuData) as Array<keyof MenuData>).map((key) =>
                    key !== '_id' ? (
                        <div key={key}>
                            <label
                                htmlFor={key}
                                className="block text-sm font-medium text-gray-700 capitalize"
                            >
                                {key.replace(/([A-Z])/g, ' $1')}
                            </label>
                            <input
                                type="text"
                                id={key}
                                name={key}
                                value={menuData[key]} // No need for 'as string' anymore
                                onChange={handleInputChange}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                    ) : null
                )}
            <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                Save and Revalidate
            </button>
        </form>
    )
}
