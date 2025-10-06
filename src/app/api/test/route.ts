import { NextResponse } from 'next/server'

export async function GET() {
    const users = { id: 123, title: 'The Title' }
    return NextResponse.json(users)
}
