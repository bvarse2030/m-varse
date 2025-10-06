import { client } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        await client.connect()
        const db = client.db()
        const varification = await db
            .collection('varification')
            .find({})
            .toArray()

        return NextResponse.json(varification)
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { error: 'Failed to fetch varification' },
            { status: 500 }
        )
    } finally {
        await client.close()
    }
}
