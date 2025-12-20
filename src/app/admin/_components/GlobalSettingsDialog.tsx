'use client';

import { useState, useEffect } from 'react';
import { X, Bot, Zap, Key, Eye, EyeOff, Save, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface GlobalSettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GlobalSettingsDialog({ isOpen, onClose }: GlobalSettingsDialogProps) {
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
  const [saving, setSaving] = useState(false);
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [showOpenAIKey, setShowOpenAIKey] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetch('/api/settings?key=ai_config')
        .then(res => res.json())
        .then(data => {
          if (data) {
            setAiConfig({
              provider: data.provider || 'gemini',
              model: data.model || 'gemini-2.5-flash',
              apiKeys: {
                gemini: data.apiKeys?.gemini || '',
                openai: data.apiKeys?.openai || ''
              }
            });
          }
        })
        .catch(() => toast.error('Erro ao carregar configurações'))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'ai_config', value: aiConfig })
      });
      if (!res.ok) throw new Error('Failed to save settings');
      toast.success('Configurações salvas com sucesso!');
      onClose();
    } catch {
      toast.error('Erro ao salvar configurações.');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 transition-all duration-300">
      {/* Backdrop with Blur */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden transform transition-all scale-100 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 leading-tight">Inteligência Artificial</h2>
              <p className="text-xs text-gray-500 font-medium mt-0.5">Configure o provedor global de IA</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <Loader2 className="w-10 h-10 animate-spin mb-3 text-blue-500" />
              <p className="text-sm">Carregando configurações...</p>
            </div>
          ) : (
            <div className="space-y-8">
              
              {/* Provider Selection */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Bot className="w-4 h-4 text-blue-600" />
                  <label className="text-sm font-bold text-gray-800 uppercase tracking-wide">
                    Provedor de IA
                  </label>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Google Gemini Option */}
                  <div 
                    onClick={() => setAiConfig({ ...aiConfig, provider: 'gemini', model: 'gemini-2.5-flash' })}
                    className={`relative cursor-pointer group rounded-xl border-2 p-4 transition-all duration-200 hover:shadow-md ${
                      aiConfig.provider === 'gemini' 
                        ? 'border-blue-600 bg-blue-50/30 ring-1 ring-blue-600/20' 
                        : 'border-gray-200 hover:border-blue-400 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          aiConfig.provider === 'gemini' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
                        }`}>
                          <Zap className="w-6 h-6" />
                        </div>
                        <div>
                          <p className={`font-semibold ${aiConfig.provider === 'gemini' ? 'text-blue-900' : 'text-gray-700'}`}>Google Gemini</p>
                          <p className="text-xs text-gray-500 mt-0.5">Recomendado</p>
                        </div>
                      </div>
                      {aiConfig.provider === 'gemini' && (
                        <div className="w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-sm ring-1 ring-blue-600" />
                      )}
                    </div>
                  </div>

                  {/* OpenAI Option */}
                  <div 
                    onClick={() => setAiConfig({ ...aiConfig, provider: 'openai', model: 'gpt-4o' })}
                    className={`relative cursor-pointer group rounded-xl border-2 p-4 transition-all duration-200 hover:shadow-md ${
                      aiConfig.provider === 'openai' 
                        ? 'border-emerald-600 bg-emerald-50/30 ring-1 ring-emerald-600/20' 
                        : 'border-gray-200 hover:border-emerald-400 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          aiConfig.provider === 'openai' ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-500'
                        }`}>
                          <Bot className="w-6 h-6" />
                        </div>
                        <div>
                          <p className={`font-semibold ${aiConfig.provider === 'openai' ? 'text-emerald-900' : 'text-gray-700'}`}>OpenAI</p>
                          <p className="text-xs text-gray-500 mt-0.5">GPT-4 Turbo e mais</p>
                        </div>
                      </div>
                      {aiConfig.provider === 'openai' && (
                        <div className="w-4 h-4 rounded-full bg-emerald-600 border-2 border-white shadow-sm ring-1 ring-emerald-600" />
                      )}
                    </div>
                  </div>
                </div>
              </section>

              {/* Model & Keys Configuration */}
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 space-y-6">
                
                {/* Model Selection */}
                <div>
                   <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Modelo Utilizado
                  </label>
                  <div className="relative">
                    <select
                      value={aiConfig.model}
                      onChange={(e) => setAiConfig({ ...aiConfig, model: e.target.value })}
                      className="w-full pl-4 pr-10 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer hover:border-gray-300"
                    >
                      {aiConfig.provider === 'openai' ? (
                        <>
                          <option value="gpt-4o">GPT-4o (Mais rápido e inteligente)</option>
                          <option value="gpt-4-turbo">GPT-4 Turbo</option>
                          <option value="gpt-4">GPT-4</option>
                          <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Econômico)</option>
                        </>
                      ) : (
                        <>
                          <option value="gemini-2.5-flash">Gemini 2.5 Flash (Novo, Ultrarrápido)</option>
                          <option value="gemini-1.5-pro">Gemini 1.5 Pro (Mais capaz)</option>
                          <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
                          <option value="gemini-1.0-pro">Gemini 1.0 Pro</option>
                        </>
                      )}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    O modelo escolhido afetará a velocidade e a qualidade das respostas.
                  </p>
                </div>

                {/* API Keys */}
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Key className="w-4 h-4 text-gray-500" />
                    Chaves de API
                  </h3>

                  <div className="space-y-4">
                    {/* Gemini Key */}
                    <div className={`transition-opacity duration-200 ${aiConfig.provider === 'gemini' ? 'opacity-100' : 'opacity-70 grayscale'}`}>
                       <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                        Gemini API Key
                        {aiConfig.provider === 'gemini' && <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700">ATIVO</span>}
                      </label>
                      <div className="relative">
                        <input
                          type={showGeminiKey ? "text" : "password"}
                          value={aiConfig.apiKeys.gemini || ''}
                          onChange={(e) => setAiConfig({ ...aiConfig, apiKeys: { ...aiConfig.apiKeys, gemini: e.target.value } })}
                          className="w-full pl-4 pr-12 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono text-sm"
                          placeholder="AIzaSy..."
                        />
                         <button
                          type="button"
                          onClick={() => setShowGeminiKey(!showGeminiKey)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                        >
                          {showGeminiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* OpenAI Key */}
                    <div className={`transition-opacity duration-200 ${aiConfig.provider === 'openai' ? 'opacity-100' : 'opacity-70 grayscale'}`}>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                        OpenAI API Key
                        {aiConfig.provider === 'openai' && <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">ATIVO</span>}
                      </label>
                      <div className="relative">
                        <input
                          type={showOpenAIKey ? "text" : "password"}
                          value={aiConfig.apiKeys.openai || ''}
                          onChange={(e) => setAiConfig({ ...aiConfig, apiKeys: { ...aiConfig.apiKeys, openai: e.target.value } })}
                          className="w-full pl-4 pr-12 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-mono text-sm"
                          placeholder="sk-..."
                        />
                         <button
                          type="button"
                          onClick={() => setShowOpenAIKey(!showOpenAIKey)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                        >
                          {showOpenAIKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 rounded-b-2xl">
          <button 
            onClick={onClose} 
            className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 transition-all"
          >
            Cancelar
          </button>
          <button 
            onClick={handleSave} 
            disabled={saving || loading}
            className="px-5 py-2.5 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-95"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Salvar Configurações
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
