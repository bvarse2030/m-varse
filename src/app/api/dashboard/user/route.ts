import { client } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        await client.connect()
        const db = client.db()
        const users = await db.collection('user').find({}).toArray()

        return NextResponse.json(users)
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { error: 'Failed to fetch users' },
            { status: 500 }
        )
    } finally {
        await client.close()
    }
}
