import { NextRequest, NextResponse } from 'next/server';
import { getCongresses, createCongress } from '@/lib/data';
import type { Congress } from '../../../../types/congress'; // Adjust the import path if needed

export async function GET() {
  try {
    const data = await getCongresses();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API GET /api/congresses failed:', error);
    return NextResponse.json({ message: 'Failed to fetch congresses' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const newCongressData: Partial<Congress> = await request.json();

    // Destructure the id out of the request body to avoid sending it to the DB
    // The frontend might send a temporary ID like 'novo-congresso'
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _id, ...congressToCreate } = newCongressData;

    // Basic validation
    if (!congressToCreate.title || !congressToCreate.slug) {
      return NextResponse.json({ message: 'Title and slug are required' }, { status: 400 });
    }

    // The createCongress function in data.ts will handle the insertion
    const savedCongress = await createCongress(congressToCreate);
    
    return NextResponse.json(savedCongress, { status: 201 });
  } catch (error: unknown) {
    console.error('API POST /api/congresses failed:', error);

    if (typeof error === 'object' && error !== null) {
        if ('code' in error && error.code === '23505') { // Postgres unique violation code
            return NextResponse.json({ message: 'A congress with this slug already exists.' }, { status: 409 });
        }
        if ('message' in error && typeof error.message === 'string') {
            return NextResponse.json({ message: error.message }, { status: 500 });
        }
    }
    
    if (error instanceof Error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'An unknown error occurred while creating the congress.' }, { status: 500 });
  }
}
