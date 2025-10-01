/*
|-----------------------------------------
| setting up Page for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: m varse, October, 2025
|-----------------------------------------
*/

'use server'

import { Suspense } from 'react'
import Image from 'next/image'

// Define the type for the 'About' data based on the API response
interface AboutData {
    _id: string
    title: string
    description: string
    images: string[]
    title1: string
    description1: string
    title2: string
    description2: string
    title3: string
    description3: string
    createdAt: string
    updatedAt: string
}

// Asynchronous function to fetch 'About' data
async function getAboutData(): Promise<AboutData> {
    // Fetch data from the local API endpoint
    const res = await fetch(
        `${process.env.BASE_URL}api/site-setting/private/v1`,
        {
            cache: 'no-store', // Ensure fresh data on every request
        }
    )

    // Check for a successful response
    if (!res.ok) {
        throw new Error('Failed to fetch data')
    }

    // Parse the JSON response
    const jsonResponse = await res.json()
    // Return the first 'about' item from the data array
    return jsonResponse.data.abouts[0]
}

// The main component for the private page
export default async function PrivatePage() {
    // Fetch the 'about' data
    const about = await getAboutData()

    // JSX for the component's UI
    return (
        <div className="min-h-screen bg-gray-50 text-gray-800">
            <div className="container mx-auto px-4 py-16">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">
                        {about.title}
                    </h1>
                    <p className="text-lg md:text-xl max-w-3xl mx-auto">
                        {about.description}
                    </p>
                </div>

                {/* Image Grid Section */}
                <Suspense
                    fallback={
                        <div className="text-center">Loading images...</div>
                    }
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                        {about.images.map((src, index) => (
                            <div
                                key={index}
                                className="overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
                            >
                                <Image
                                    src={src}
                                    alt={`${about.title} image ${index + 1}`}
                                    width={500}
                                    height={500}
                                    className="w-full h-auto object-cover"
                                />
                            </div>
                        ))}
                    </div>
                </Suspense>

                {/* Detailed Sections */}
                <div className="space-y-12">
                    {/* Section 1 */}
                    <div>
                        <h2 className="text-3xl font-semibold mb-4">
                            {about.title1}
                        </h2>
                        <p className="text-base leading-relaxed">
                            {about.description1}
                        </p>
                    </div>

                    {/* Section 2 */}
                    <div>
                        <h2 className="text-3xl font-semibold mb-4">
                            {about.title2}
                        </h2>
                        <p className="text-base leading-relaxed">
                            {about.description2}
                        </p>
                    </div>

                    {/* Section 3 */}
                    <div>
                        <h2 className="text-3xl font-semibold mb-4">
                            {about.title3}
                        </h2>
                        <p className="text-base leading-relaxed">
                            {about.description3}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
