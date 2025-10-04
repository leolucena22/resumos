import { NextRequest, NextResponse } from 'next/server';
import { getCongressById, updateCongress, deleteCongress } from '@/lib/data';
import { Congress } from '../../../../../types/congress';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const congress = await getCongressById(id);
    if (!congress) {
      return NextResponse.json({ message: 'Congress not found' }, { status: 404 });
    }
    return NextResponse.json(congress);
  } catch (error) {
    console.error(`API GET /api/congresses/${id} failed:`, error);
    return NextResponse.json({ message: 'Failed to fetch congress' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const congressData: Partial<Congress> = await request.json();
    
    // If the title is being updated, re-generate the slug
    if (congressData.title) {
        congressData.slug = congressData.title.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
    }

    const updatedCongress = await updateCongress(id, congressData);
    return NextResponse.json(updatedCongress);
  } catch (error: unknown) {
    console.error(`API PUT /api/congresses/${id} failed:`, error);
    if (typeof error === 'object' && error !== null && 'code' in error) {
        const supabaseError = error as { code: string };
        if (supabaseError.code === '23505') { // Check for unique slug violation
            return NextResponse.json({ message: 'A congress with this slug already exists.' }, { status: 409 });
        }
    }
    return NextResponse.json({ message: 'Failed to update congress' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await deleteCongress(id);
    return NextResponse.json({ message: 'Congress deleted successfully' });
  } catch (error) {
    console.error(`API DELETE /api/congresses/${id} failed:`, error);
    return NextResponse.json({ message: 'Failed to delete congress' }, { status: 500 });
  }
}
