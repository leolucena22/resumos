import { supabaseServerClient } from './supabaseServerClient';
import { Congress, CongressData } from '../../types/congress';

// Function to get all congresses
export async function getCongresses(): Promise<Congress[]> {
  const { data, error } = await supabaseServerClient.from('congresses').select('*');

  if (error) {
    console.error('Error fetching congresses:', error);
    return [];
  }

  return data || [];
}

// Function to get a single congress by its slug
export async function getCongress(slug: string): Promise<CongressData | null> {
  const { data, error } = await supabaseServerClient
    .from('congresses')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
        return null;
    }
    console.error(`Error fetching congress with slug ${slug}:`, error);
    throw new Error(`Could not fetch congress with slug ${slug}.`);
  }

  const congressData = data as CongressData & { book_chapter_edital_url?: string };

  if (congressData && congressData.book_chapter_edital_url) {
    congressData.bookChapterEditalUrl = congressData.book_chapter_edital_url;
    delete congressData.book_chapter_edital_url;
  }

  return congressData;
}

// Function to get a single congress by its ID
export async function getCongressById(id: string): Promise<CongressData | null> {
    const { data, error } = await supabaseServerClient
      .from('congresses')
      .select('*')
      .eq('id', id)
      .single();
  
    if (error) {
        if (error.code === 'PGRST116') {
            return null;
        }
        console.error(`Error fetching congress with id ${id}:`, error);
        throw new Error(`Could not fetch congress with id ${id}.`);
    }
  
    const congressData = data as CongressData & { book_chapter_edital_url?: string };

    if (congressData && congressData.book_chapter_edital_url) {
        congressData.bookChapterEditalUrl = congressData.book_chapter_edital_url;
        delete congressData.book_chapter_edital_url;
    }

    return congressData;
  }

// Function to create a new congress
export async function createCongress(congress: Partial<Congress>): Promise<Congress> {
  const { data, error } = await supabaseServerClient
    .from('congresses')
    .insert([congress])
    .select()
    .single();

  if (error) {
    console.error('Error creating congress:', error);
    throw new Error('Could not create congress.');
  }

  return data;
}

// Function to update an existing congress
export async function updateCongress(id: string, congress: Partial<CongressData>): Promise<CongressData> {
  const updateData: Partial<CongressData> & { book_chapter_edital_url?: string } = { ...congress };

  if (updateData.bookChapterEditalUrl !== undefined) {
    updateData['book_chapter_edital_url'] = updateData.bookChapterEditalUrl;
    delete updateData.bookChapterEditalUrl;
  }

  const { data, error } = await supabaseServerClient
    .from('congresses')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating congress with id ${id}:`, error);
    throw new Error(`Could not update congress with id ${id}.`);
  }

  return data;
}

// Function to delete a congress
export async function deleteCongress(id: string): Promise<void> {
  // 1. First, delete associated files from storage
  try {
    const folderPath = `congress-templates/${id}`;
    const { data: files, error: listError } = await supabaseServerClient.storage
      .from('templates')
      .list(folderPath);

    if (listError) {
      if (listError.message !== 'The resource was not found') {
          console.error(`Error listing files for congress ${id}:`, listError);
          throw new Error(`Could not list files for deletion for congress ${id}.`);
      }
    }

    if (files && files.length > 0) {
      const filePaths = files.map(file => `${folderPath}/${file.name}`);
      const { error: removeError } = await supabaseServerClient.storage
        .from('templates')
        .remove(filePaths);

      if (removeError) {
        console.error(`Error removing files for congress ${id}:`, removeError);
        throw new Error(`Could not remove files for congress ${id}.`);
      }
    }
  } catch (storageError) {
    console.error(`A storage error occurred during deletion of congress ${id}:`, storageError);
    throw storageError;
  }

  // 2. Then, delete the congress record from the database
  const { error: dbError } = await supabaseServerClient.from('congresses').delete().eq('id', id);

  if (dbError) {
    console.error(`Error deleting congress with id ${id} from database:`, dbError);
    throw new Error(`Could not delete congress with id ${id}.`);
  }
}
