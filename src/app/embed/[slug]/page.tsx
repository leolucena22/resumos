import { getCongress } from '@/lib/data';
import GeminiChat from '@/components/congress/GeminiChat';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function EmbedChatPage({ params }: Props) {
  const { slug } = await params;
  const congress = await getCongress(slug);

  if (!congress) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-red-50 rounded-full">
        <p className="text-[10px] text-red-500 text-center font-bold px-1">404 Evento</p>
      </div>
    );
  }

  // Only render if chat is enabled
  if (!congress.isChatEnabled) {
      return (
          <div className="flex items-center justify-center h-screen bg-transparent">
              <p className="text-gray-500 bg-white p-2 rounded shadow">Chat não habilitado.</p>
          </div>
      )
  }

  return (
    <div className="w-full h-full bg-transparent">
      <GeminiChat congress={congress} isEmbedded={true} />
    </div>
  );
}
