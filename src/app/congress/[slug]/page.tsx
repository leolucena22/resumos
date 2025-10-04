import { notFound } from 'next/navigation';
import CongressPage from '@/components/congress/CongressPage';
import { getCongress } from '@/lib/data';


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

  // Increment view count is not required for this project, so I will remove it.
  const congress = await getCongress(slug);

  if (!congress) {
    notFound();
  }

  return <CongressPage congress={congress} />;
}
