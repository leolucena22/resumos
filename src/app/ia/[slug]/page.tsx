import ChatPageContent from './ChatPageContent';

export default async function IAChatPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ChatPageContent slug={slug} />;
}
