'use client';

import { useState, useEffect } from 'react';
import GeminiChat from '@/components/congress/GeminiChat';
import { Congress } from '@/types/congress'; // Assuming this type exists based on admin page usage, or we define a minimal one
import { Loader2, AlertCircle } from 'lucide-react';

export default function ChatPageContent({ slug }: { slug: string }) {
  const [congress, setCongress] = useState<Congress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCongress = async () => {
      try {
        const response = await fetch('/api/congresses');
        if (!response.ok) throw new Error('Falha ao carregar dados');
        const data = await response.json();
        const found = data.find((c: Congress) => c.slug === slug);
        
        if (found) {
          setCongress(found);
        } else {
          setError('Evento não encontrado');
        }
      } catch (err) {
        console.error(err);
        setError('Erro ao carregar evento');
      } finally {
        setLoading(false);
      }
    };

    fetchCongress();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !congress) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h1 className="text-xl font-bold text-gray-800 mb-2">Ops! Algo deu errado</h1>
        <p className="text-gray-600">{error || 'Não conseguimos encontrar este evento.'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:justify-center md:items-center p-0 md:p-4">
       <div className="w-full mx-auto bg-white shadow-xl min-h-screen md:min-h-0 md:h-[85vh] md:max-h-[800px] md:rounded-2xl relative overflow-hidden flex flex-col max-w-md">
          {/* We pass isEmbedded=true to make the chat take up the full container/screen appropriately if needed, 
              or we assume GeminiChat handles its modal state. 
              Looking at GeminiChat code: it has `isEmbedded` prop. 
              If `isEmbedded` is true, it renders fixed at bottom. 
              Actually, for a dedicated page, we want it to be ALWAYS open and taking full space.
              The GeminiChat component seems designed as a popup. 
              Let's check GeminiChat implementation details again.
          */}
          <GeminiChat congress={congress} isEmbedded={true} variant="fullPage" />
       </div>
    </div>
  );
}
