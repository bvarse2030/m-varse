/*
|-----------------------------------------
| setting up RelavidatePrivatePage for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: m varse, October, 2025
|-----------------------------------------
*/

import { Button } from '@/components/ui/button'
import { revalidatePath } from 'next/cache'

const RelavidatePrivatePage = () => {
    // Define the Server Action
    async function handleRevalidation() {
        'use server'
        revalidatePath('/private')
    }

    return (
        <main className="flex items-center justify-center">
            <form action={handleRevalidation}>
                <Button type="submit">Update Private Page</Button>
            </form>
        </main>
    )
}

export default RelavidatePrivatePage
