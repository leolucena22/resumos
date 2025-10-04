import { NextRequest, NextResponse } from 'next/server';
import { supabaseServerClient } from '@/lib/supabaseServerClient';
import { updateCongress, getCongressById } from '@/lib/data'; // Import getCongressById
import { CongressData } from '../../../../types/congress'; // Import Congress type

const slugifyFilename = (filename: string) => {
  return filename
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-.]+/g, '') // Remove all non-word chars except dots
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const congressId = formData.get('congressId') as string;
    const templateType = formData.get('templateType') as keyof NonNullable<CongressData['templateUrls']>; // Use keyof for type safety

    if (!file || !congressId || !templateType) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const sanitizedFilename = slugifyFilename(file.name);
    const filePath = `congress-templates/${congressId}/${templateType}-${sanitizedFilename}`;

    // Upload file to Supabase Storage
    const { error: uploadError } = await supabaseServerClient.storage
      .from('templates') // Make sure you have a bucket named 'templates'
      .upload(filePath, file, { 
        cacheControl: '3600',
        upsert: true // Overwrite file if it already exists
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      throw new Error('Failed to upload file to storage.');
    }

    // Get public URL for the uploaded file
    const { data: publicUrlData } = supabaseServerClient.storage
      .from('templates')
      .getPublicUrl(filePath);

    if (!publicUrlData) {
        throw new Error('Could not get public URL for the file.');
    }
    
    const publicUrl = publicUrlData.publicUrl;

    // --- Start Merge Logic ---
    // 1. Fetch the current congress to get existing templateUrls
    const currentCongress = await getCongressById(congressId);
    if (!currentCongress) {
        throw new Error('Congress not found for updating template URLs.');
    }

    // 2. Merge the new URL into the existing templateUrls object
    const updatedTemplateUrls = {
        ...(currentCongress.templateUrls || {}),
        [templateType]: publicUrl,
    };

    // 3. Update the congress record with the full, merged templateUrls
    const congress = await updateCongress(congressId, {
        templateUrls: updatedTemplateUrls,
    });
    // --- End Merge Logic ---

    return NextResponse.json({ publicUrl, congress });

  } catch (error) {
    console.error('API POST /api/upload failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
