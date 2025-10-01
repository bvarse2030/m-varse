/*
|-----------------------------------------
| setting up PrivatePageEditor for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: m varse, October, 2025
|-----------------------------------------
*/

'use client' // This directive makes this a client component

import { useState, useEffect } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'

// Define the type for the 'About' data
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
}

// The main component for the private page editor
export default function PrivatePageEditor() {
    const [about, setAbout] = useState<AboutData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [saveStatus, setSaveStatus] = useState<'success' | 'error' | null>(
        null
    )

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty },
    } = useForm<AboutData>()

    // Fetch initial data on component mount
    useEffect(() => {
        const fetchAboutData = async () => {
            try {
                const res = await fetch('/api/site-setting/private/v1')
                const jsonResponse = await res.json()
                const data = jsonResponse.data.abouts[0]
                setAbout(data)
                reset(data) // Populate the form with fetched data
            } catch (error) {
                console.error('Failed to fetch data', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchAboutData()
    }, [reset])

    // Handle form submission
    const onSubmit: SubmitHandler<AboutData> = async (data) => {
        setIsSaving(true)
        setSaveStatus(null)
        try {
            const response = await fetch('/api/site-setting/private/v1', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: about?._id, ...data }),
            })

            if (!response.ok) {
                throw new Error('Failed to update data')
            }

            setSaveStatus('success')
        } catch (error) {
            console.error(error)
            setSaveStatus('error')
        } finally {
            setIsSaving(false)
            setTimeout(() => setSaveStatus(null), 3000) // Hide status message after 3 seconds
        }
    }

    // Render a loading state while fetching data
    if (isLoading) {
        return <div className="text-center p-10">Loading editor...</div>
    }

    // Render the editor form
    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6"
            >
                <h1 className="text-3xl font-bold mb-6">Edit About Page</h1>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Form fields for each data point */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Title
                        </label>
                        <input
                            {...register('title', {
                                required: 'Title is required',
                            })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                        {errors.title && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.title.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Description
                        </label>
                        <textarea
                            {...register('description')}
                            rows={3}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        ></textarea>
                    </div>

                    {/* You can add more fields here for title1, description1, etc., following the same pattern. */}

                    {/* Action buttons */}
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => reset(about ?? undefined)}
                            disabled={!isDirty || isSaving}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
                        >
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </motion.div>

            {/* Save status notification */}
            <AnimatePresence>
                {saveStatus && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className={`fixed bottom-5 right-5 p-4 rounded-md text-white ${saveStatus === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
                    >
                        {saveStatus === 'success'
                            ? 'Data saved successfully!'
                            : 'Failed to save data.'}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
