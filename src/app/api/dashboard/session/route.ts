import { client } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        await client.connect()
        const db = client.db()
        const session = await db.collection('session').find({}).toArray()

        return NextResponse.json(session)
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { error: 'Failed to fetch session' },
            { status: 500 }
        )
    } finally {
        await client.close()
    }
}
