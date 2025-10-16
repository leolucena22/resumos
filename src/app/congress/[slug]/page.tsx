import { notFound } from 'next/navigation';
import CongressPage from '@/components/congress/CongressPage';
import { getCongress } from '@/lib/data';


import { supabaseServerClient } from '@/lib/supabaseServerClient';


export async function generateMetadata(context: { params: Promise<{ slug: string }> }) {
  const params = await context.params;
  const slug = params.slug;
  const congress = await getCongress(slug);

  if (!congress) {
    notFound();
  }

  return {
    title: `${congress.title} - Edital de Submissão`,
    description: congress.description,
  };
}

export default async function CongressPageRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Increment view count and fetch congress data in parallel
  const [congress] = await Promise.all([
    getCongress(slug),
    supabaseServerClient.rpc('increment_view_count', { slug_text: slug })
  ]);

  if (!congress) {
    notFound();
  }

  return <CongressPage congress={congress} />;
}
