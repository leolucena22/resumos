
import { getCongresses } from '@/lib/data';
import { supabaseServerClient } from '@/lib/supabaseServerClient';
import { Eye, BarChart2, ExternalLink, MousePointerClick, Percent } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 60; // Revalidate data every 60 seconds

async function getAnalyticsData() {
  const [congresses, viewCountsData, clickCountsData] = await Promise.all([
    getCongresses(),
    supabaseServerClient.from('congress_views').select('congress_slug,view_count'),
    supabaseServerClient.from('congress_registration_clicks').select('congress_slug,click_count'),
  ]);

  if (viewCountsData.error) {
    console.error('Error fetching view counts:', viewCountsData.error);
    throw new Error('Could not fetch view counts.');
  }

  if (clickCountsData.error) {
    console.error('Error fetching click counts:', clickCountsData.error);
    throw new Error('Could not fetch click counts.');
  }

  const viewCountsMap = new Map(
    viewCountsData.data.map((v) => [v.congress_slug, v.view_count])
  );

  const clickCountsMap = new Map(
    clickCountsData.data.map((c) => [c.congress_slug, c.click_count])
  );

  const analytics = congresses.map((congress) => ({
    ...congress,
    views: viewCountsMap.get(congress.slug) || 0,
    clicks: clickCountsMap.get(congress.slug) || 0,
  }));

  // Sort by most viewed
  analytics.sort((a, b) => b.views - a.views);

  return analytics;
}

export default async function AnalyticsPage() {
  const analyticsData = await getAnalyticsData();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <BarChart2 className="w-8 h-8 text-blue-600" />
              Análise de Acessos e Cliques
            </h1>
            <p className="text-gray-500 mt-1">Visão geral dos acessos e cliques de inscrição por congresso.</p>
          </div>
           <Link href="/admin" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Voltar ao Painel
            </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {analyticsData.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">Nenhum dado de acesso encontrado.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {analyticsData.map((congress) => {
              const conversionRate = congress.views > 0 ? (congress.clicks / congress.views) * 100 : 0;

              return (
                <div
                  key={congress.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 ease-in-out group"
                >
                  <div 
                    className="h-2"
                    style={{ backgroundColor: congress.colors.primary || '#ccc' }}
                  />
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <h2 className="text-xl font-bold text-gray-800 mb-2 pr-4">{congress.title}</h2>
                      <Link href={`/congress/${congress.slug}`} target="_blank" className="text-gray-400 hover:text-blue-600 transition-colors">
                        <ExternalLink className="w-5 h-5" />
                      </Link>
                    </div>
                    <p className="text-sm text-gray-500 mb-6">{congress.subtitle}</p>
                    
                    <div className="space-y-5">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 rounded-full">
                          <Eye className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-4xl font-extrabold text-gray-900">{congress.views.toLocaleString('pt-BR')}</p>
                          <p className="text-sm text-gray-500 font-medium">Acessos Totais</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-100 rounded-full">
                          <MousePointerClick className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <p className="text-4xl font-extrabold text-gray-900">{congress.clicks.toLocaleString('pt-BR')}</p>
                          <p className="text-sm text-gray-500 font-medium">Cliques na submissão</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-yellow-100 rounded-full">
                          <Percent className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div>
                          <p className="text-4xl font-extrabold text-gray-900">{conversionRate.toFixed(2)}%</p>
                          <p className="text-sm text-gray-500 font-medium">Taxa de Conversão</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-6 py-3">
                      <p className="text-xs text-gray-500">ID: {congress.slug}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
