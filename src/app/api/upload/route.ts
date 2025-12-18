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
    const templateType = formData.get('templateType') as keyof NonNullable<CongressData['templateUrls']>;
    const context = formData.get('context') as string | null;

    if (!file || !congressId || (!templateType && context !== 'training')) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const sanitizedFilename = slugifyFilename(file.name);
    // Use different folder for training files if desired, or same 'templates' bucket
    const prefix = context === 'training' ? 'training' : templateType;
    const filePath = `congress-templates/${congressId}/${prefix}-${sanitizedFilename}`;

    // Upload file to Supabase Storage
    const { error: uploadError } = await supabaseServerClient.storage
      .from('templates')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
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
    const currentCongress = await getCongressById(congressId);
    if (!currentCongress) {
      throw new Error('Congress not found for updating template URLs.');
    }

    let updatedCongress;

    if (context === 'training') {
      // Append to trainingFileUrls
      const currentUrls = currentCongress.trainingFileUrls || [];
      // Optional: Avoid duplicates
      if (!currentUrls.includes(publicUrl)) {
        const updatedUrls = [...currentUrls, publicUrl];
        updatedCongress = await updateCongress(congressId, {
          trainingFileUrls: updatedUrls,
        });
      } else {
        updatedCongress = currentCongress;
      }

    } else {
      // Existing logic for templates
      const updatedTemplateUrls = {
        ...(currentCongress.templateUrls || {}),
        [templateType]: publicUrl,
      };

      updatedCongress = await updateCongress(congressId, {
        templateUrls: updatedTemplateUrls,
      });
    }
    // --- End Merge Logic ---

    // Return the updated congress data (using 'congress' key to match client expectation if needed, or just updatedCongress)
    return NextResponse.json({ publicUrl, congress: updatedCongress });

  } catch (error) {
    console.error('API POST /api/upload failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
