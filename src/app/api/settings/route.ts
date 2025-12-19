import { NextResponse } from 'next/server';
import { getGlobalSettings, updateGlobalSettings } from '@/lib/data';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (!key) {
        return NextResponse.json({ error: 'Key is required' }, { status: 400 });
    }

    try {
        const value = await getGlobalSettings(key);
        return NextResponse.json(value || {});
    } catch {
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { key, value } = await request.json();

        if (!key || !value) {
            return NextResponse.json({ error: 'Key and value are required' }, { status: 400 });
        }

        const updated = await updateGlobalSettings(key, value);
        return NextResponse.json(updated);
    } catch {
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }
}
