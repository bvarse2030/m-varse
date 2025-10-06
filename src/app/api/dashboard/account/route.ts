import { client } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        await client.connect()
        const db = client.db()
        const account = await db.collection('account').find({}).toArray()

        return NextResponse.json(account)
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { error: 'Failed to fetch account' },
            { status: 500 }
        )
    } finally {
        await client.close()
    }
}
