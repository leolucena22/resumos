'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trash2, Link as LinkIcon, Copy, MoreVertical, List, X } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminSkeletonLoader, { CongressListSkeleton } from '@/components/AdminSkeletonLoader';
import TiptapEditor from '@/components/TiptapEditor';
import DeadlineSection from '@/components/admin/DeadlineSection';

interface FAQItem {
  question: string;
  answer: string;
}

interface EditalSection {
  id: string;
  title: string;
  content: string;
}

interface Deadline {
  id: string;
  name: string;
  date: string;
  time?: string;
}

interface Congress {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  date: string;
  description: string;
  submissionUrl?: string;
  bookChapterEditalUrl?: string;
  isChatEnabled?: boolean;
  trainingData?: string;
  trainingFileUrls?: string[];
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  aiConfig?: {
    provider: 'gemini' | 'openai';
    apiKeys?: {
      gemini?: string;
      openai?: string;
    };
    model?: string;
  };
  faq: FAQItem[];
  contact: {
    email: string;
    whatsapp?: string;
    instagram?: string;
  };
  templateUrls?: {
    resumoExpandidoComId?: string;
    resumoExpandidoSemId?: string;
    apresentacaoOral?: string;
    eBanner?: string;
  };
  editalSections?: EditalSection[];
  editalDates?: {
    openingDate?: string;
    submissionDeadlines?: Deadline[];
    presentationDeadlines?: Deadline[];
    resultsDeadlines?: Deadline[];
    publicationDate?: string;
  };
}


type AdminTab = 'basic' | 'colors' | 'templates' | 'editalSections' | 'editalDates' | 'faq' | 'ai';


// --- Global Settings Modal Component ---
const GlobalSettingsModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [aiConfig, setAiConfig] = useState<{
    provider: 'gemini' | 'openai';
    model: string;
    apiKeys: { gemini: string; openai: string };
  }>({
    provider: 'gemini',
    model: 'gemini-2.5-flash',
    apiKeys: { gemini: '', openai: '' }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      // Fetch Global Settings
      fetch('/api/settings?key=ai_config')
        .then(res => res.json())
        .then(data => {
          if (data) {
            setAiConfig({
              provider: data.provider || 'gemini',
              model: data.model || 'gemini-2.5-flash',
              apiKeys: data.apiKeys || { gemini: '', openai: '' }
            });
          }
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  const handleSave = async () => {
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'ai_config', value: aiConfig })
      });
      if (!res.ok) throw new Error('Failed to save settings');
      toast.success('Configurações globais salvas!');
      onClose();
    } catch {
      toast.error('Erro ao salvar configurações.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto m-4">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">✕</button>
        <h2 className="text-xl font-bold mb-4 text-gray-900">Configurações Globais de IA</h2>

        {loading ? <p>Carregando...</p> : (
          <div className="space-y-6">
            {/* Provider Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Provedor de IA Padrão (Todos os Eventos)</label>
              <div className="flex gap-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={aiConfig.provider === 'gemini'}
                    onChange={() => setAiConfig({ ...aiConfig, provider: 'gemini', model: 'gemini-2.5-flash' })}
                    className="text-blue-600"
                  />
                  <span className="text-gray-900">Google Gemini</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={aiConfig.provider === 'openai'}
                    onChange={() => setAiConfig({ ...aiConfig, provider: 'openai', model: 'gpt-4o' })}
                    className="text-blue-600"
                  />
                  <span className="text-gray-900">OpenAI (ChatGPT)</span>
                </label>
              </div>
            </div>

            {/* Model Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Modelo</label>
              <select
                value={aiConfig.model}
                onChange={(e) => setAiConfig({ ...aiConfig, model: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg bg-white text-gray-900"
              >
                {aiConfig.provider === 'openai' ? (
                  <>
                    <option value="gpt-4o">GPT-4o</option>
                    <option value="gpt-4-turbo">GPT-4 Turbo</option>
                    <option value="gpt-4">GPT-4</option>
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                  </>
                ) : (
                  <>
                    <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                    <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                    <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
                    <option value="gemini-1.0-pro">Gemini 1.0 Pro</option>
                  </>
                )}
              </select>
            </div>

            {/* API Keys */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-semibold text-gray-900">Chaves de API</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gemini API Key
                  {aiConfig.provider === 'gemini' && <span className="ml-2 text-xs text-green-600 font-bold">(Ativo)</span>}
                </label>
                <input
                  type="password"
                  value={aiConfig.apiKeys.gemini || ''}
                  onChange={(e) => setAiConfig({ ...aiConfig, apiKeys: { ...aiConfig.apiKeys, gemini: e.target.value } })}
                  className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100 text-gray-900"
                  placeholder="AIzaSy..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  OpenAI API Key
                  {aiConfig.provider === 'openai' && <span className="ml-2 text-xs text-green-600 font-bold">(Ativo)</span>}
                </label>
                <input
                  type="password"
                  value={aiConfig.apiKeys.openai || ''}
                  onChange={(e) => setAiConfig({ ...aiConfig, apiKeys: { ...aiConfig.apiKeys, openai: e.target.value } })}
                  className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100 text-gray-900"
                  placeholder="sk-..."
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 gap-3">
              <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-gray-800">Cancelar</button>
              <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Salvar Configurações</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function AdminPage() {
  const [showGlobalSettings, setShowGlobalSettings] = useState(false);
  const [congressInfo, setCongressInfo] = useState<Congress | null>(null);
  const [congresses, setCongresses] = useState<Congress[]>([]);
  const [selectedCongress, setSelectedCongress] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>('basic');
  const [isLoading, setIsLoading] = useState(true);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [showHeaderMenu, setShowHeaderMenu] = useState(false);



  useEffect(() => {
    const fetchCongresses = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/congresses');
        if (!response.ok) throw new Error('Failed to fetch congresses');
        const data = await response.json();
        setCongresses(data);
        if (data.length > 0 && !selectedCongress) {
          setSelectedCongress(data[0].id);
        }
      } catch (error) {
        console.error('Error fetching congresses:', error);
        toast.error('Erro ao carregar editais');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCongresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedCongress) {
      const congress = congresses.find((c) => c.id === selectedCongress);
      if (congress) {
        setCongressInfo(congress);
      }
    }
  }, [selectedCongress, congresses]);

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
  };

  const getContrastingTextColor = (hexColor: string) => {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  };

  const handleSave = async () => {
    if (!congressInfo) return;

    try {
      const method = isCreating ? 'POST' : 'PUT';
      const url = isCreating ? '/api/congresses' : `/api/congresses/${congressInfo.id}`;

      toast.loading('Salvando...', { id: 'saving' });

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(congressInfo),
      });

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.message || 'Failed to save congress');
      }

      const savedCongress = await response.json();

      if (isCreating) {
        setCongresses([...congresses, savedCongress]);
        setSelectedCongress(savedCongress.id);
        setIsCreating(false);
      } else {
        setCongresses(congresses.map((c) => (c.id === savedCongress.id ? savedCongress : c)));
      }

      setCongressInfo(savedCongress);
      setIsEditing(false);
      toast.success('Salvo com sucesso!', { id: 'saving' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao salvar';
      toast.error(errorMessage, { id: 'saving' });
      console.error('Error saving congress:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja apagar este edital?')) return;

    try {
      toast.loading('Apagando...', { id: 'deleting' });
      const response = await fetch(`/api/congresses/${id}`, { method: 'DELETE' });

      if (!response.ok) throw new Error('Failed to delete congress');

      setCongresses(congresses.filter((c) => c.id !== id));
      if (selectedCongress === id) {
        setSelectedCongress(congresses[0]?.id || null);
        setCongressInfo(null);
      }
      toast.success('Edital apagado!', { id: 'deleting' });
    } catch (error) {
      toast.error('Erro ao apagar edital', { id: 'deleting' });
      console.error('Error deleting congress:', error);
    }
  };



  const handleCopyLink = (slug: string) => {

    const link = `${window.location.origin}/congress/${slug}`;

    navigator.clipboard.writeText(link);

    toast.success('Link copiado!');

  };



  const handleDuplicate = async (id: string) => {
    const congressToDuplicate = congresses.find((c) => c.id === id);
    if (!congressToDuplicate) return;

    const newId = `novo-congresso-${Date.now()}`;
    const duplicatedCongress = JSON.parse(JSON.stringify(congressToDuplicate));

    duplicatedCongress.id = newId;
    duplicatedCongress.title = `${duplicatedCongress.title} (Cópia)`;
    duplicatedCongress.slug = slugify(duplicatedCongress.title);

    try {
      toast.loading('Duplicando edital...', { id: 'duplicating' });
      const response = await fetch('/api/congresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(duplicatedCongress),
      });

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.message || 'Failed to duplicate congress');
      }

      const savedCongress = await response.json();

      setCongresses([...congresses, savedCongress]);
      setSelectedCongress(savedCongress.id);
      toast.success('Edital duplicado com sucesso!', { id: 'duplicating' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao duplicar edital';
      toast.error(errorMessage, { id: 'duplicating' });
      console.error('Error duplicating congress:', error);
    }
  };



  const handleCreateNew = () => {

    const newId = 'novo-congresso';

    const newCongress: Congress = {

      id: newId,

      title: 'Novo Congresso',

      slug: 'novo-congresso',

      subtitle: 'Nome Completo do Novo Congresso',

      date: '01 a 04 de Janeiro',

      description: 'Descrição detalhada do edital de submissão.',

      submissionUrl: '',

      bookChapterEditalUrl: '',

      colors: { primary: '#0066cc', secondary: '#004499', accent: '#ff6600', background: '#f8f9fa', text: '#333333' },

      faq: [],

      contact: { email: 'contato@dominio.com', whatsapp: '5511999999999' },

      templateUrls: {},

      editalSections: [],

      editalDates: {

        openingDate: new Date().toISOString().split('T')[0],

        submissionDeadlines: [],

        presentationDeadlines: [],

        resultsDeadlines: [],

        publicationDate: undefined,

      }

    };



    setCongressInfo(newCongress);

    setSelectedCongress(newId);

    setIsEditing(true);

    setIsCreating(true);

  };



  const addFAQ = () => {

    if (!congressInfo) return;

    const newFAQ: FAQItem = { question: 'Nova pergunta?', answer: 'Nova resposta.' };

    setCongressInfo({ ...congressInfo, faq: [...congressInfo.faq, newFAQ] });

  };



  const updateFAQ = (index: number, updatedFAQ: Partial<FAQItem>) => {

    if (!congressInfo) return;

    const newFAQ = [...congressInfo.faq];

    newFAQ[index] = { ...newFAQ[index], ...updatedFAQ };

    setCongressInfo({ ...congressInfo, faq: newFAQ });

  };



  const removeFAQ = (index: number) => {

    if (!congressInfo) return;

    const newFAQ = congressInfo.faq.filter((_, i) => i !== index);

    setCongressInfo({ ...congressInfo, faq: newFAQ });

  };



  const addEditalSection = () => {

    if (!congressInfo) return;

    const newSection = { id: Date.now().toString(), title: 'Nova Seção', content: 'Conteúdo da nova seção.' };

    setCongressInfo({ ...congressInfo, editalSections: [...(congressInfo.editalSections || []), newSection] });

  };



  const updateEditalSection = (id: string, updatedSection: Partial<EditalSection>) => {

    if (!congressInfo || !congressInfo.editalSections) return;

    setCongressInfo({

      ...congressInfo,

      editalSections: congressInfo.editalSections.map(section =>

        section.id === id ? { ...section, ...updatedSection } : section

      ),

    });

  };



  const removeEditalSection = (id: string) => {

    if (!congressInfo || !congressInfo.editalSections) return;

    setCongressInfo({

      ...congressInfo,

      editalSections: congressInfo.editalSections.filter(section => section.id !== id),

    });

  };



  const handleDateChange = (field: keyof NonNullable<Congress['editalDates']>, value: string) => {

    if (!congressInfo) return;

    setCongressInfo(prev => ({

      ...prev!,

      editalDates: {

        ...(prev!.editalDates || {}),

        [field]: value,

      },

    }));

  };



  const addDeadline = (field: 'submissionDeadlines' | 'presentationDeadlines' | 'resultsDeadlines') => {

    if (!congressInfo) return;

    const newDeadline: Deadline = {

      id: `deadline-${Date.now()}`,

      name: 'Novo Prazo',

      date: new Date().toISOString().split('T')[0],

      time: '23:59',

    };

    const currentDeadlines = congressInfo.editalDates?.[field] || [];

    setCongressInfo(prev => ({

      ...prev!,

      editalDates: {

        ...(prev!.editalDates || {}),

        [field]: [...currentDeadlines, newDeadline],

      },

    }));

  };



  const updateDeadline = (field: 'submissionDeadlines' | 'presentationDeadlines' | 'resultsDeadlines', index: number, updatedDeadline: Partial<Deadline>) => {

    if (!congressInfo || !congressInfo.editalDates) return;

    const currentDeadlines = [...(congressInfo.editalDates[field] || [])];

    currentDeadlines[index] = { ...currentDeadlines[index], ...updatedDeadline };

    setCongressInfo(prev => ({

      ...prev!,

      editalDates: {

        ...(prev!.editalDates || {}),

        [field]: currentDeadlines,

      },

    }));

  };





  const removeDeadline = (field: 'submissionDeadlines' | 'presentationDeadlines' | 'resultsDeadlines', index: number) => {

    if (!congressInfo || !congressInfo.editalDates) return;

    const currentDeadlines = [...(congressInfo.editalDates[field] || [])];

    currentDeadlines.splice(index, 1);

    setCongressInfo(prev => ({

      ...prev!,

      editalDates: {

        ...(prev!.editalDates || {}),

        [field]: currentDeadlines,

      },

    }));

  };



  const handleFileUpload = async (file: File, templateType: keyof NonNullable<Congress['templateUrls']>) => {

    if (!congressInfo) return;



    let currentCongressId = congressInfo.id;



    if (isCreating) {

      toast.loading('Salvando congresso antes de fazer upload...', { id: 'saving-congress' });

      try {

        const response = await fetch('/api/congresses', {

          method: 'POST',

          headers: { 'Content-Type': 'application/json' },

          body: JSON.stringify(congressInfo),

        });



        if (!response.ok) {

          const errorBody = await response.json();

          throw new Error(errorBody.message || 'Failed to save congress before upload');

        }



        const savedCongress = await response.json();

        currentCongressId = savedCongress.id;

        setCongresses(prev => [...prev, savedCongress]);

        setSelectedCongress(savedCongress.id);

        setCongressInfo(savedCongress);

        setIsCreating(false);

        toast.success('Congresso salvo com sucesso!', { id: 'saving-congress' });

      } catch (error) {

        const errorMessage = error instanceof Error ? error.message : 'Erro ao salvar o congresso antes do upload.';

        toast.error(`Erro: ${errorMessage}`, { id: 'saving-congress' });

        return;

      }

    }



    const formData = new FormData();

    formData.append('file', file);

    formData.append('congressId', currentCongressId);

    formData.append('templateType', templateType);



    try {

      toast.loading('Fazendo upload do arquivo...', { id: 'uploading-file' });

      const response = await fetch('/api/upload', {

        method: 'POST',

        body: formData,

      });



      if (!response.ok) {

        throw new Error('Falha no upload do arquivo.');

      }



      const { congress: updatedCongress } = await response.json();



      setCongressInfo(updatedCongress);

      setCongresses(prev => prev.map(c => c.id === updatedCongress.id ? updatedCongress : c));



      toast.success(`Template ${templateType} carregado com sucesso!`, { id: 'uploading-file' });

    } catch (error) {

      toast.error('Erro ao fazer upload do template.', { id: 'uploading-file' });

      console.error(error);

    }

  };



  return (

    <div className="min-h-screen bg-gray-50">

      <div className="bg-white shadow-sm border-b">

        <div className="max-w-7xl mx-auto px-4 py-4">

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative">
            <div className="flex items-center justify-between w-full md:w-auto">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">Painel Administrativo - Editais</h1>
              <button
                className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                onClick={() => setShowHeaderMenu(!showHeaderMenu)}
              >
                {showHeaderMenu ? <X size={24} /> : <MoreVertical size={24} />}
              </button>
            </div>

            <div className={`${showHeaderMenu ? 'flex' : 'hidden'} md:flex flex-col md:flex-row gap-3 w-full md:w-auto transition-all`}>
              <button
                onClick={() => setShowGlobalSettings(true)}
                className="flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors shadow-sm w-full md:w-auto text-sm"
              >
                Configurações (IA)
              </button>
              <Link href="/admin/analytics" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center w-full md:w-auto text-sm">Métricas</Link>
              
              {!isEditing && (
                <button onClick={handleCreateNew} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors w-full md:w-auto text-sm">+ Novo</button>
              )}

              {congressInfo && !isCreating && (
                <button onClick={() => setIsEditing(!isEditing)} className={`px-4 py-2 rounded-lg transition-colors w-full md:w-auto text-sm ${isEditing ? 'bg-gray-600 text-white hover:bg-gray-700' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
                  {isEditing ? 'Cancelar' : 'Editar'}
                </button>
              )}
              {isEditing && congressInfo && (
                <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors w-full md:w-auto text-sm">Salvar</button>
              )}
            </div>
          </div>

        </div>

      </div>



      <div className="max-w-7xl mx-auto px-4 py-4 md:py-8">

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Mobile Sidebar Toggle */}
          <div className="lg:hidden mb-3">
             <button
              onClick={() => setShowMobileSidebar(!showMobileSidebar)}
              className="w-full flex items-center justify-between p-3 bg-white rounded-lg shadow-sm text-gray-700 font-medium text-sm"
            >
              <span>{showMobileSidebar ? 'Ocultar Lista de Editais' : 'Ver Lista de Editais'}</span>
              {showMobileSidebar ? <X className="w-5 h-5" /> : <List className="w-5 h-5" />}
            </button>
          </div>

          <div className={`lg:col-span-1 ${showMobileSidebar ? 'block' : 'hidden lg:block'}`}>

            <div className="bg-white rounded-lg shadow p-6">

              <h2 className="text-lg text-gray-900 font-semibold mb-4">Editais de Congresso</h2>

              <div className="space-y-2">

                {isLoading ? (

                  <CongressListSkeleton />

                ) : (

                  congresses.map((congress) => (

                    <div key={congress.id} className="flex items-center gap-1">

                      <button onClick={() => setSelectedCongress(congress.id)} className={`w-full text-left p-4 rounded-lg transition-colors ${selectedCongress === congress.id ? 'bg-blue-50 border-2 border-blue-200' : 'hover:bg-gray-50 border-2 border-transparent'}`}>

                        <div className="font-medium text-gray-900">{congress.title}</div>

                        <div className="text-sm text-gray-500">{congress.date}</div>

                      </button>

                      <div className="flex items-center">

                        <button onClick={() => handleDuplicate(congress.id)} className="p-2 text-gray-500 hover:text-green-700 hover:bg-green-100 rounded-full transition-colors" title="Duplicar edital">

                          <Copy className="w-4 h-4" />

                        </button>

                        <button onClick={() => handleCopyLink(congress.slug)} className="p-2 text-gray-500 hover:text-blue-700 hover:bg-blue-100 rounded-full transition-colors" title="Copiar link do edital">

                          <LinkIcon className="w-4 h-4" />

                        </button>

                        <button onClick={() => handleDelete(congress.id)} className="p-2 text-gray-500 hover:text-red-700 hover:bg-red-100 rounded-full transition-colors" title="Apagar edital">

                          <Trash2 className="w-4 h-4" />

                        </button>

                      </div>

                    </div>

                  ))

                )}

              </div>

            </div>

          </div>



          <div className="lg:col-span-3">

            {isLoading ? (

              <AdminSkeletonLoader />

            ) : congressInfo ? (

              <div className="bg-white rounded-lg shadow">

                <div className="border-b">

                  <nav className="flex overflow-x-auto md:flex-wrap md:overflow-visible border-b scrollbar-hide">
                    {[{ key: 'basic', label: 'Informações Básicas' }, { key: 'ai', label: 'Inteligência Artificial' }, { key: 'colors', label: 'Cores' }, { key: 'templates', label: 'Modelos' }, { key: 'editalSections', label: 'Seções do Edital' }, { key: 'editalDates', label: 'Datas do Edital' }, { key: 'faq', label: 'FAQ' }].map((tab) => (
                      <button key={tab.key} onClick={() => setActiveTab(tab.key as AdminTab)} className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.key ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                        {tab.label}
                      </button>
                    ))}
                  </nav>

                </div>



                <div className="p-6">
                  {activeTab === 'ai' && (
                    <div className="space-y-8">
                      {/* Activation Section */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-blue-900">Ativar Chatbot eIA</h3>
                            <p className="text-sm text-blue-700 mt-1">
                              Habilita o assistente virtual baseado em IA (Gemini ou OpenAI) para este evento.
                            </p>
                          </div>
                          <div className="relative inline-block w-12 align-middle select-none transition duration-200 ease-in">
                            <input
                              type="checkbox"
                              name="toggle-ai"
                              id="toggle-ai"
                              checked={congressInfo.isChatEnabled || false}
                              onChange={(e) => setCongressInfo({ ...congressInfo, isChatEnabled: e.target.checked })}
                              disabled={!isEditing}
                              className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-300"
                              style={{ right: congressInfo.isChatEnabled ? '0' : 'auto', left: congressInfo.isChatEnabled ? 'auto' : '0', borderColor: congressInfo.isChatEnabled ? '#10B981' : '#E5E7EB' }}
                            />
                            <label htmlFor="toggle-ai" className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${congressInfo.isChatEnabled ? 'bg-green-500' : 'bg-gray-300'}`}></label>
                          </div>
                        </div>
                      </div>

                      {/* AI Configuration Moved to Global Settings */}
                      {/* Only Congress-specific status remains */}
                      <div className="text-sm text-gray-500 italic mt-4">
                        A configuração do modelo de IA (Provedor, Chaves, Versão) agora é gerenciada globalmente através do botão &quot;Configurações Globais (IA)&quot; no topo da página.
                      </div>

                      {/* Training Data Section */}
                      <div className="border-t pt-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Base de Conhecimento</h3>

                        <div className="mb-6">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Instruções de Contexto</label>
                          <p className="text-sm text-gray-500 mb-4">
                            Insira aqui informações adicionais, regras específicas ou contexto extra que o assistente virtual deve saber sobre este evento.
                          </p>
                          <textarea
                            value={congressInfo.trainingData || ''}
                            onChange={(e) => setCongressInfo({ ...congressInfo, trainingData: e.target.value })}
                            disabled={!isEditing}
                            rows={10}
                            className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-lg disabled:bg-gray-50 font-mono text-sm"
                            placeholder="Exemplo: O evento terá certificado de 20 horas. O credenciamento começa às 08:00 todos os dias..."
                          />
                        </div>

                        <div className="mb-6">
                          <h4 className="text-md font-medium text-gray-900 mb-2">Arquivos de Treinamento</h4>
                          <p className="text-sm text-gray-500 mb-4">
                            Faça upload de documentos (PDF, DOCX, TXT) para servirem de base de conhecimento.
                          </p>

                          {isEditing && (
                            <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-700 mb-2">Adicionar novo arquivo</label>
                              <input
                                type="file"
                                onChange={async (e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    const file = e.target.files[0];
                                    if (!congressInfo) return;

                                    const formData = new FormData();
                                    formData.append('file', file);
                                    formData.append('congressId', congressInfo.id);
                                    formData.append('context', 'training');

                                    toast.loading('Enviando arquivo...', { id: 'upload-training' });

                                    try {
                                      const res = await fetch('/api/upload', {
                                        method: 'POST',
                                        body: formData
                                      });

                                      if (!res.ok) throw new Error('Falha no upload');

                                      const data = await res.json();
                                      setCongressInfo(data.congress);
                                      toast.success('Arquivo enviado!', { id: 'upload-training' });
                                    } catch (error) {
                                      console.error(error);
                                      toast.error('Erro ao enviar arquivo', { id: 'upload-training' });
                                    }

                                    e.target.value = '';
                                  }
                                }}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                              />
                            </div>
                          )}

                          <div className="space-y-2">
                            {congressInfo.trainingFileUrls && congressInfo.trainingFileUrls.length > 0 ? (
                              congressInfo.trainingFileUrls.map((url, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                                  <a href={url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline truncate max-w-xs md:max-w-md">
                                    {url.split('/').pop()}
                                  </a>
                                  {isEditing && (
                                    <button
                                      onClick={() => {
                                        const newUrls = congressInfo.trainingFileUrls?.filter((_, i) => i !== index);
                                        setCongressInfo({ ...congressInfo, trainingFileUrls: newUrls });
                                      }}
                                      className="text-red-500 hover:text-red-700 p-1"
                                      title="Remover arquivo"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-gray-400 italic">Nenhum arquivo enviado.</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Integration Section */}
                      <div className="border-t pt-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Instalação (Embed)</h3>
                        <p className="text-sm text-gray-500 mb-4">
                          Copie o código abaixo e cole no HTML do seu site.
                        </p>

                        <div className="relative">
                          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono">
                            {`<script src="${window.location.origin}/widget.js" data-slug="${congressInfo.slug}"></script>`}
                          </pre>
                          <button
                            onClick={() => {
                              const code = `<script src="${window.location.origin}/widget.js" data-slug="${congressInfo.slug}"></script>`;
                              navigator.clipboard.writeText(code);
                              toast.success('Código copiado!');
                            }}
                            className="absolute top-2 right-2 p-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
                            title="Copiar"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                        </div>

                      {/* Share Link Section */}
                      <div className="border-t pt-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Link para Compartilhar</h3>
                        <p className="text-sm text-gray-500 mb-4">
                           Link direto para a página exclusiva do chat com IA.
                        </p>

                        <div className="relative">
                           <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
                             <input 
                               type="text" 
                               readOnly 
                               value={`${typeof window !== 'undefined' ? window.location.origin : ''}/ia/${congressInfo.slug}`}
                               className="flex-1 bg-transparent border-none text-sm text-gray-600 focus:ring-0 outline-none w-full"
                             />
                             <button
                               onClick={() => {
                                 const link = `${window.location.origin}/ia/${congressInfo.slug}`;
                                 navigator.clipboard.writeText(link);
                                 toast.success('Link copiado!');
                               }}
                               className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                               title="Copiar Link"
                             >
                               <Copy className="w-5 h-5" />
                             </button>
                          </div>
                      
                           <div className="mt-2 text-xs text-right">
                             <a href={`/ia/${congressInfo.slug}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-1">
                               Abrir página <LinkIcon className="w-3 h-3" />
                             </a>
                           </div>
                        </div>
                      </div>
                    </div>
                  )}



                  {activeTab === 'basic' && (

                    <div className="space-y-6">

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div>

                          <label className="block text-sm font-medium text-gray-700 mb-2">Sigla do Evento</label>

                          <input type="text" value={congressInfo.title} onChange={(e) => { const newTitle = e.target.value; setCongressInfo({ ...congressInfo, title: newTitle, slug: slugify(newTitle) }) }} disabled={!isEditing} className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-lg disabled:bg-gray-50" />

                        </div>

                        <div>

                          <label className="block text-sm font-medium text-gray-700 mb-2">Data</label>

                          <input type="text" value={congressInfo.date} onChange={(e) => setCongressInfo({ ...congressInfo, date: e.target.value })} disabled={!isEditing} className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-lg disabled:bg-gray-50" />

                        </div>

                      </div>

                      <div>

                        <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo do Evento</label>

                        <input type="text" value={congressInfo.subtitle} onChange={(e) => setCongressInfo({ ...congressInfo, subtitle: e.target.value })} disabled={!isEditing} className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-lg disabled:bg-gray-50" />

                      </div>

                      <div>

                        <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>

                        <textarea value={congressInfo.description} onChange={(e) => setCongressInfo({ ...congressInfo, description: e.target.value })} disabled={!isEditing} rows={4} className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-lg disabled:bg-gray-50" />

                      </div>

                      <div>

                        <label className="block text-sm font-medium text-gray-700 mb-2">Link para Submissão</label>

                        <input

                          type="url"

                          value={congressInfo.submissionUrl || ''}

                          onChange={(e) => setCongressInfo({ ...congressInfo, submissionUrl: e.target.value })}

                          disabled={!isEditing}

                          placeholder="https://plataforma.com/submissao"

                          className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-lg disabled:bg-gray-50"

                        />

                      </div>

                      <div>

                        <label className="block text-sm font-medium text-gray-700 mb-2">Link do edital de capítulo de livro</label>

                        <input
                          type="url"
                          value={congressInfo.bookChapterEditalUrl || ''}
                          onChange={(e) => setCongressInfo({ ...congressInfo, bookChapterEditalUrl: e.target.value })}
                          disabled={!isEditing}
                          placeholder="https://plataforma.com/capitulo-livro"
                          className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-lg disabled:bg-gray-50"
                        />
                      </div>



                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        <div>

                          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>

                          <input type="email" value={congressInfo.contact.email} onChange={(e) => setCongressInfo({ ...congressInfo, contact: { ...congressInfo.contact, email: e.target.value } })} disabled={!isEditing} className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-lg disabled:bg-gray-50" />

                        </div>

                        <div>

                          <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp</label>

                          <input type="text" value={congressInfo.contact.whatsapp || ''} onChange={(e) => setCongressInfo({ ...congressInfo, contact: { ...congressInfo.contact, whatsapp: e.target.value } })} disabled={!isEditing} placeholder="5511999999999" className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-lg disabled:bg-gray-50" />

                        </div>

                        <div>

                          <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>

                          <input type="text" value={congressInfo.contact.instagram || ''} onChange={(e) => setCongressInfo({ ...congressInfo, contact: { ...congressInfo.contact, instagram: e.target.value } })} disabled={!isEditing} placeholder="@seuinstagram" className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-lg disabled:bg-gray-50" />

                        </div>

                      </div>

                    </div>

                  )}



                  {activeTab === 'colors' && (

                    <div className="space-y-6">

                      <h3 className="text-lg text-gray-900 font-semibold">Configuração de Cores</h3>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">

                        {Object.entries(congressInfo.colors).map(([colorKey, colorValue]) => (

                          <div key={colorKey}>

                            <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">{colorKey}</label>

                            <div className="flex items-center space-x-3">

                              <input type="color" value={colorValue} onChange={(e) => setCongressInfo({ ...congressInfo, colors: { ...congressInfo.colors, [colorKey]: e.target.value } })} disabled={!isEditing} className="w-12 h-10 border border-gray-300 rounded" />

                              <input type="text" value={colorValue} onChange={(e) => setCongressInfo({ ...congressInfo, colors: { ...congressInfo.colors, [colorKey]: e.target.value } })} disabled={!isEditing} className="flex-1 px-3 py-2 text-gray-900 border border-gray-300 rounded-lg disabled:bg-gray-50" />

                            </div>

                          </div>

                        ))}

                      </div>

                      <div className="mt-8">

                        <h4 className="text-md text-gray-900 font-semibold mb-4">Preview</h4>

                        <div className="border rounded-lg p-4" style={{ backgroundColor: congressInfo.colors.background }}>

                          <div className="p-4 rounded-lg mb-4" style={{ backgroundColor: congressInfo.colors.primary, color: getContrastingTextColor(congressInfo.colors.primary) }}>

                            <h3 className="text-xl font-bold">Header Primário</h3>

                          </div>

                          <div className="inline-block px-4 py-2 rounded-lg font-semibold mr-4" style={{ backgroundColor: congressInfo.colors.accent, color: getContrastingTextColor(congressInfo.colors.accent) }}>

                            Botão Destaque

                          </div>

                          <p style={{ color: congressInfo.colors.text }} className="mt-4">Texto de exemplo.</p>

                        </div>

                      </div>

                    </div>

                  )}



                  {activeTab === 'templates' && (

                    <div className="space-y-6">

                      <h3 className="text-lg text-gray-900 font-semibold">Upload de Modelos</h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {([

                          { type: 'resumoExpandidoComId', label: 'Resumo Expandido (com Identificação)' },

                          { type: 'resumoExpandidoSemId', label: 'Resumo Expandido (sem Identificação)' },

                          { type: 'apresentacaoOral', label: 'Apresentação Oral' },

                          { type: 'eBanner', label: 'e-Banner' },

                        ] as const).map(({ type, label }) => (

                          <div key={type} className={`border rounded-lg p-4 transition-colors ${!isEditing ? 'bg-gray-100' : 'bg-white'}`}>

                            <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>

                            {isEditing ? (

                              <>

                                <input

                                  type="file"

                                  onChange={(e) => e.target.files && handleFileUpload(e.target.files[0], type)}

                                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"

                                />

                                {congressInfo.templateUrls?.[type] && (

                                  <div className="mt-2">

                                    <a href={congressInfo.templateUrls[type]} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">

                                      Ver arquivo atual

                                    </a>

                                  </div>

                                )}

                              </>

                            ) : (

                              congressInfo.templateUrls?.[type] ? (

                                <div className="mt-2">

                                  <a href={congressInfo.templateUrls[type]} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">

                                    Ver arquivo

                                  </a>

                                </div>

                              ) : (

                                <p className="text-sm text-gray-500 mt-2">Nenhum modelo carregado.</p>

                              )

                            )}

                          </div>

                        ))}

                      </div>

                    </div>

                  )}



                  {activeTab === 'editalSections' && (

                    <div className="space-y-6">

                      <div className="flex justify-between items-center">

                        <h3 className="text-lg font-semibold text-gray-900">Seções do Edital</h3>

                        {isEditing && (

                          <button onClick={addEditalSection} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">

                            + Adicionar Seção

                          </button>

                        )}

                      </div>

                      <div className="space-y-4">

                        {congressInfo.editalSections?.map((section) => (

                          <div key={section.id} className="border rounded-lg p-4">

                            <div className="flex justify-between items-center mb-4">

                              <h4 className="font-semibold text-gray-900">Seção {section.title}</h4>

                              {isEditing && (

                                <button onClick={() => removeEditalSection(section.id)} className="text-red-600 hover:text-red-800">

                                  Remover

                                </button>

                              )}

                            </div>

                            <div className="space-y-4">

                              <div>

                                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>

                                <input

                                  type="text"

                                  value={section.title}

                                  onChange={(e) => updateEditalSection(section.id, { title: e.target.value })}

                                  disabled={!isEditing}

                                  className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-lg disabled:bg-gray-50"

                                />

                              </div>

                              <div>

                                <label className="block text-sm font-medium text-gray-700 mb-1">Conteúdo</label>

                                <TiptapEditor

                                  content={section.content}

                                  onChange={(newContent: string) => updateEditalSection(section.id, { content: newContent })}

                                  isEditing={isEditing}

                                />

                              </div>

                            </div>

                          </div>

                        ))}

                      </div>

                    </div>

                  )}



                  {activeTab === 'editalDates' && (

                    <div className="space-y-6">

                      <h3 className="text-lg font-semibold text-gray-900">Datas do Edital</h3>



                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div className="border rounded-lg p-4">

                          <label className="block text-sm font-medium text-gray-700 mb-2">Data de Abertura do Edital</label>

                          <input

                            type="date"

                            value={congressInfo.editalDates?.openingDate || ''}

                            onChange={(e) => handleDateChange('openingDate', e.target.value)}

                            disabled={!isEditing}

                            className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-lg disabled:bg-gray-50"

                          />

                        </div>

                        <div className="border rounded-lg p-4">

                          <label className="block text-sm font-medium text-gray-700 mb-2">Data de Publicação dos Anais</label>

                          <input

                            type="date"

                            value={congressInfo.editalDates?.publicationDate || ''}

                            onChange={(e) => handleDateChange('publicationDate', e.target.value)}

                            disabled={!isEditing}

                            className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-lg disabled:bg-gray-50"

                          />

                        </div>

                      </div>



                      <DeadlineSection

                        title="Prazos Finais para Submissão"

                        deadlines={congressInfo.editalDates?.submissionDeadlines || []}

                        onAdd={() => addDeadline('submissionDeadlines')}

                        onUpdate={(index, updatedField) => updateDeadline('submissionDeadlines', index, updatedField)}

                        onRemove={(index) => removeDeadline('submissionDeadlines', index)}

                        isEditing={isEditing}

                      />

                      <DeadlineSection

                        title="Prazos dos Resultados de Submissão"

                        deadlines={congressInfo.editalDates?.resultsDeadlines || []}

                        onAdd={() => addDeadline('resultsDeadlines')}

                        onUpdate={(index, updatedField) => updateDeadline('resultsDeadlines', index, updatedField)}

                        onRemove={(index) => removeDeadline('resultsDeadlines', index)}

                        isEditing={isEditing}

                      />

                      <DeadlineSection

                        title="Prazos para Envio das Apresentações"

                        deadlines={congressInfo.editalDates?.presentationDeadlines || []}

                        onAdd={() => addDeadline('presentationDeadlines')}

                        onUpdate={(index, updatedField) => updateDeadline('presentationDeadlines', index, updatedField)}

                        onRemove={(index) => removeDeadline('presentationDeadlines', index)}

                        isEditing={isEditing}

                      />

                    </div>

                  )}





                  {activeTab === 'faq' && (

                    <div className="space-y-6">

                      <div className="flex justify-between items-center">

                        <h3 className="text-lg text-gray-900 font-semibold">Perguntas Frequentes</h3>

                        {isEditing && (

                          <button onClick={addFAQ} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">+ Adicionar FAQ</button>

                        )}

                      </div>

                      <div className="space-y-4">

                        {congressInfo.faq.map((faqItem, index) => (

                          <div key={index} className="border rounded-lg p-4">

                            <div className="flex justify-between items-center mb-4">

                              <h4 className="font-semibold text-gray-900">FAQ {index + 1}</h4>

                              {isEditing && (

                                <button onClick={() => removeFAQ(index)} className="text-red-600 hover:text-red-800">Remover</button>

                              )}

                            </div>

                            <div className="space-y-4">

                              <div>

                                <label className="block text-sm font-medium text-gray-700 mb-1">Pergunta</label>

                                <input type="text" value={faqItem.question} onChange={(e) => updateFAQ(index, { ...faqItem, question: e.target.value })} disabled={!isEditing} className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-lg disabled:bg-gray-50" />

                              </div>

                              <div>

                                <label className="block text-sm font-medium text-gray-700 mb-1">Resposta</label>

                                <textarea value={faqItem.answer} onChange={(e) => updateFAQ(index, { ...faqItem, answer: e.target.value })} disabled={!isEditing} rows={3} className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-lg disabled:bg-gray-50" />

                              </div>

                            </div>

                          </div>

                        ))}

                      </div>

                    </div>

                  )}

                </div>

              </div>

            ) : (

              <div className="bg-white rounded-lg shadow p-8 text-center">

                <h2 className="text-xl font-semibold text-gray-700 mb-4">Selecione um edital para editar</h2>

                <p className="text-gray-500 mt-2">Você pode usar &quot;Visualizar&quot; para testar.</p>

                <p className="text-gray-500">Escolha um edital da lista ao lado ou crie um novo.</p>

              </div>

            )}

          </div>

        </div>


      </div>
      <GlobalSettingsModal isOpen={showGlobalSettings} onClose={() => setShowGlobalSettings(false)} />
    </div>
  );
}

