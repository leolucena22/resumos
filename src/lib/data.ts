import { supabaseServerClient } from './supabaseServerClient';
import { Congress, CongressData } from '../../types/congress';

interface RawCongress extends Congress {
  book_chapter_edital_url?: string;
  is_chat_enabled?: boolean;
  training_data?: string;
  training_file_urls?: string[];
  ai_config?: {
    provider: 'gemini' | 'openai';
    apiKeys?: { gemini?: string; openai?: string; };
    model?: string;
  };
  // Make these optional since we're extending Congress which has the camelCase versions
  bookChapterEditalUrl?: string;
  isChatEnabled?: boolean;
  trainingData?: string;
  trainingFileUrls?: string[];
  aiConfig?: {
    provider: 'gemini' | 'openai';
    apiKeys?: { gemini?: string; openai?: string; };
    model?: string;
  };
}

export async function getCongresses(): Promise<Congress[]> {
  const { data, error } = await supabaseServerClient.from('congresses').select('*');

  if (error) {
    console.error('Error fetching congresses:', error);
    return [];
  }

  if (!data) return [];

  return data.map((congress: RawCongress) => {
    const mappedCongress = { ...congress };

    if (mappedCongress.book_chapter_edital_url) {
      mappedCongress.bookChapterEditalUrl = mappedCongress.book_chapter_edital_url;
      delete mappedCongress.book_chapter_edital_url;
    }

    if (mappedCongress.is_chat_enabled !== undefined) {
      mappedCongress.isChatEnabled = mappedCongress.is_chat_enabled;
      delete mappedCongress.is_chat_enabled;
    }

    if (mappedCongress.training_data !== undefined) {
      mappedCongress.trainingData = mappedCongress.training_data;
      delete mappedCongress.training_data;
    }

    if (mappedCongress.training_file_urls !== undefined) {
      mappedCongress.trainingFileUrls = mappedCongress.training_file_urls;
      delete mappedCongress.training_file_urls;
    }

    if (mappedCongress.ai_config !== undefined) {
      mappedCongress.aiConfig = mappedCongress.ai_config;
      delete mappedCongress.ai_config;
    }

    return mappedCongress as Congress;
  });
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

  const congressData = data as CongressData & {
    book_chapter_edital_url?: string;
    is_chat_enabled?: boolean;
    training_data?: string;
    training_file_urls?: string[];
    ai_config?: {
      provider: 'gemini' | 'openai';
      apiKeys?: { gemini?: string; openai?: string; };
      model?: string;
    };
  };

  if (congressData) {
    if (congressData.book_chapter_edital_url) {
      congressData.bookChapterEditalUrl = congressData.book_chapter_edital_url;
      delete congressData.book_chapter_edital_url;
    }

    if (congressData.is_chat_enabled !== undefined) {
      congressData.isChatEnabled = congressData.is_chat_enabled;
      delete congressData.is_chat_enabled;
    }

    if (congressData.training_data !== undefined) {
      congressData.trainingData = congressData.training_data;
      delete congressData.training_data;
    }

    if (congressData.training_file_urls !== undefined) {
      congressData.trainingFileUrls = congressData.training_file_urls;
      delete congressData.training_file_urls;
    }

    if (congressData.ai_config !== undefined) {
      congressData.aiConfig = congressData.ai_config;
      delete congressData.ai_config;
    }
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

  const congressData = data as CongressData & {
    book_chapter_edital_url?: string;
    is_chat_enabled?: boolean;
    training_data?: string;
    training_file_urls?: string[];
    ai_config?: {
      provider: 'gemini' | 'openai';
      apiKeys?: { gemini?: string; openai?: string; };
      model?: string;
    };
  };

  if (congressData) {
    if (congressData.book_chapter_edital_url) {
      congressData.bookChapterEditalUrl = congressData.book_chapter_edital_url;
      delete congressData.book_chapter_edital_url;
    }

    if (congressData.is_chat_enabled !== undefined) {
      congressData.isChatEnabled = congressData.is_chat_enabled;
      delete congressData.is_chat_enabled;
    }

    if (congressData.training_data !== undefined) {
      congressData.trainingData = congressData.training_data;
      delete congressData.training_data;
    }

    if (congressData.training_file_urls !== undefined) {
      congressData.trainingFileUrls = congressData.training_file_urls;
      delete congressData.training_file_urls;
    }

    if (congressData.ai_config !== undefined) {
      congressData.aiConfig = congressData.ai_config;
      delete congressData.ai_config;
    }
  }

  return congressData;
}

// Function to create a new congress
export async function createCongress(congress: Partial<Congress>): Promise<Congress> {
  const insertData: Partial<Congress> & {
    book_chapter_edital_url?: string;
    is_chat_enabled?: boolean;
    training_data?: string;
    training_file_urls?: string[];
    ai_config?: unknown;
  } = { ...congress };

  if (insertData.bookChapterEditalUrl !== undefined) {
    insertData.book_chapter_edital_url = insertData.bookChapterEditalUrl;
    delete insertData.bookChapterEditalUrl;
  }

  if (insertData.isChatEnabled !== undefined) {
    insertData.is_chat_enabled = insertData.isChatEnabled;
    delete insertData.isChatEnabled;
  }

  if (insertData.trainingData !== undefined) {
    insertData.training_data = insertData.trainingData;
    delete insertData.trainingData;
  }

  if (insertData.trainingFileUrls !== undefined) {
    insertData.training_file_urls = insertData.trainingFileUrls;
    delete insertData.trainingFileUrls;
  }

  if (insertData.aiConfig !== undefined) {
    insertData.ai_config = insertData.aiConfig;
    delete insertData.aiConfig;
  }

  const { data, error } = await supabaseServerClient
    .from('congresses')
    .insert([insertData])
    .select()
    .single();

  if (error) {
    console.error('Error creating congress:', error);
    throw new Error('Could not create congress.');
  }

  const createdData = data as Congress & {
    is_chat_enabled?: boolean;
    training_data?: string;
    training_file_urls?: string[];
    ai_config?: {
      provider: 'gemini' | 'openai';
      apiKeys?: { gemini?: string; openai?: string; };
      model?: string;
    };
  };

  if (createdData) {
    if (createdData.is_chat_enabled !== undefined) {
      createdData.isChatEnabled = createdData.is_chat_enabled;
      delete createdData.is_chat_enabled;
    }

    if (createdData.training_data !== undefined) {
      createdData.trainingData = createdData.training_data;
      delete createdData.training_data;
    }

    if (createdData.training_file_urls !== undefined) {
      createdData.trainingFileUrls = createdData.training_file_urls;
      delete createdData.training_file_urls;
    }

    if (createdData.ai_config !== undefined) {
      createdData.aiConfig = createdData.ai_config;
      delete createdData.ai_config;
    }
  }

  return createdData;
}

// Function to update an existing congress
export async function updateCongress(id: string, congress: Partial<CongressData>): Promise<CongressData> {
  const updateData: Partial<CongressData> & {
    book_chapter_edital_url?: string;
    is_chat_enabled?: boolean;
    training_data?: string;
    training_file_urls?: string[];
    ai_config?: unknown;
  } = { ...congress };

  if (updateData.bookChapterEditalUrl !== undefined) {
    updateData.book_chapter_edital_url = updateData.bookChapterEditalUrl;
    delete updateData.bookChapterEditalUrl;
  }

  if (updateData.isChatEnabled !== undefined) {
    updateData.is_chat_enabled = updateData.isChatEnabled;
    delete updateData.isChatEnabled;
  }

  if (updateData.trainingData !== undefined) {
    updateData.training_data = updateData.trainingData;
    delete updateData.trainingData;
  }

  if (updateData.trainingFileUrls !== undefined) {
    updateData.training_file_urls = updateData.trainingFileUrls;
    delete updateData.trainingFileUrls;
  }

  if (updateData.aiConfig !== undefined) {
    updateData.ai_config = updateData.aiConfig;
    delete updateData.aiConfig;
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

  const updatedData = data as CongressData & {
    is_chat_enabled?: boolean;
    training_data?: string;
    training_file_urls?: string[];
    ai_config?: {
      provider: 'gemini' | 'openai';
      apiKeys?: { gemini?: string; openai?: string };
      model?: string;
    };
  };

  if (updatedData) {
    if (updatedData.is_chat_enabled !== undefined) {
      updatedData.isChatEnabled = updatedData.is_chat_enabled;
      delete updatedData.is_chat_enabled;
    }

    if (updatedData.training_data !== undefined) {
      updatedData.trainingData = updatedData.training_data;
      delete updatedData.training_data;
    }

    if (updatedData.training_file_urls !== undefined) {
      updatedData.trainingFileUrls = updatedData.training_file_urls;
      delete updatedData.training_file_urls;
    }

    if (updatedData.ai_config !== undefined) {
      updatedData.aiConfig = updatedData.ai_config;
      delete updatedData.ai_config;
    }
  }

  return updatedData;
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
      const filePaths = files.map((file: { name: string }) => `${folderPath}/${file.name}`);
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

// --- Global Settings ---

export async function getGlobalSettings(key: string) {
  const { data, error } = await supabaseServerClient
    .from('settings')
    .select('value')
    .eq('key', key)
    .single();

  if (error) {
    console.error(`Error fetching setting ${key}:`, error);
    return null;
  }

  return data?.value || null;
}

export async function updateGlobalSettings(key: string, value: unknown) {
  const { data, error } = await supabaseServerClient
    .from('settings')
    .upsert({ key, value })
    .select()
    .single();

  if (error) {
    console.error(`Error updating setting ${key}:`, error);
    throw new Error(`Could not update setting ${key}.`);
  }

  return data;
}
