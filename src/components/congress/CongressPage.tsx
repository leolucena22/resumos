'use client';

import { useState, useEffect, useRef } from 'react';
import { Download, Calendar, Users, Award, HelpCircle, MessageSquare, Mail, Instagram, CalendarCheck, Send, ArrowDown, ChevronDown, X } from 'lucide-react';
import Image from 'next/image';
import EditalDatesDisplay from '../edital/EditalDatesDisplay';
import { CongressData } from '../../../types/congress';

// Helper to get contrasting text color
const getContrastingTextColor = (hexColor: string) => {
  if (!hexColor) return '#000000';
  const cleanHex = hexColor.startsWith('#') ? hexColor.slice(1) : hexColor;
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b);
  return luminance > 186 ? '#000000' : '#ffffff';
};

// Section component for scroll animations
function Section({ children, className = '', id, style }: { children: React.ReactNode; className?: string; id?: string; style?: React.CSSProperties }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '-50px',
        threshold: 0.1,
      }
    );

    if (node) {
      observer.observe(node);
    }

    return () => {
      if (node) {
        observer.unobserve(node);
      }
    };
  }, []);

  return (
    <section
      id={id}
      ref={ref}
      style={style}
      className={`transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${className}`}
    >
      {children}
    </section>
  );
}

export default function CongressPage({ congress }: { congress: CongressData }) {
    const [mounted, setMounted] = useState(false);
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    useEffect(() => {
      setMounted(true);
    }, []);

    const toggleFaq = (index: number) => {
      setOpenIndex(openIndex === index ? null : index);
    };
  
    if (!mounted) {
      return null;
    }

    const { colors, title, subtitle, date, description, faq, templateUrls, editalSections, editalDates, submissionUrl } = congress;

    const templates = [
        { key: 'resumoExpandidoComId', label: 'Resumo Expandido (com Identificação)' },
        { key: 'resumoExpandidoSemId', label: 'Resumo Expandido (sem Identificação)' },
        { key: 'apresentacaoOral', label: 'Modelo de Apresentação Oral' },
        { key: 'eBanner', label: 'Modelo de E-Banner' },
    ] as const;

    const FloatingDownloads = ({ templateUrls, colors }: { templateUrls: CongressData['templateUrls']; colors: CongressData['colors'] }) => {
        const [isOpen, setIsOpen] = useState(false);
        const availableTemplates = templates.filter(({ key }) => templateUrls?.[key]);

        if (!templateUrls || availableTemplates.length === 0) {
            return null;
        }

        return (
            <div className="hidden md:block fixed bottom-8 right-8 z-50">
                <div className="relative flex flex-col items-end">
                    {/* List of downloads */}
                    <div className={`w-72 mb-4 p-4 bg-white rounded-lg shadow-2xl border transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="font-bold text-lg" style={{ color: colors.text }}>Modelos para Download</h4>
                            <button onClick={() => setIsOpen(false)} className="p-1 rounded-full hover:bg-gray-200">
                                <X className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>
                        <ul className="space-y-3">
                            {availableTemplates.map(({ key, label }) => (
                                <li key={key}>
                                    <a href={templateUrls[key]} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-all">
                                        <Download className="w-5 h-5 flex-shrink-0" style={{ color: colors.accent }}/>
                                        <span className="flex-1">{label}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Main floating button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="w-20 h-20 rounded-full shadow-2xl flex items-center justify-center text-white transform hover:scale-110 transition-transform duration-300"
                        style={{ backgroundColor: colors.accent }}
                        aria-label="Modelos para download"
                    >
                        {isOpen ? <X className="w-8 h-8" /> : <Download className="w-9 h-9" />}
                    </button>
                </div>
            </div>
        );
    };



    return (
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: colors.background }}>
            <main className="flex-grow">
                {/* Hero Header */}
                <header className="relative py-20 md:py-32 px-4 text-white overflow-hidden">
                    {/* Dynamic background */}
                    <div 
                        className="absolute inset-0"
                        style={{
                            background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary}, ${colors.accent})`,
                        }}
                    />
                    
                    {/* Animated overlay */}
                    <div className="absolute inset-0 bg-black/20"></div>
                    
                    {/* Geometric patterns */}
                    <div className="absolute inset-0 opacity-10">
                        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <pattern id="hero-pattern" patternUnits="userSpaceOnUse" width="60" height="60" patternTransform="scale(1.5) rotate(30)">
                                    <rect x="0" y="0" width="100%" height="100%" fill="none"/>
                                    <circle cx="30" cy="30" r="2" fill="white" opacity="0.4"/>
                                    <path d="M0,30 Q15,15 30,30 Q45,45 60,30" stroke="white" strokeWidth="1" fill="none" opacity="0.3"/>
                                    <polygon points="15,10 25,10 20,20" fill="white" opacity="0.2"/>
                                    <polygon points="35,40 45,40 40,50" fill="white" opacity="0.2"/>
                                </pattern>
                            </defs>
                            <rect x="0" y="0" width="100%" height="100%" fill="url(#hero-pattern)"/>
                        </svg>
                    </div>

                    {/* Floating elements */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-20 left-10 w-32 h-32 bg-white/5 rounded-full animate-pulse"></div>
                        <div className="absolute top-40 right-20 w-24 h-24 bg-white/5 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                        <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-white/5 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
                    </div>

                    <div className="max-w-7xl mx-auto text-center relative z-10">
                        {/* Event badge */}
                        <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-lg rounded-full px-6 py-3 border border-white/20 mb-8 hover:bg-white/20 transition-all duration-300">
                            <Award className="w-5 h-5" />
                            <span className="text-white/90 font-medium">Edital de Submissão</span>
                        </div>

                        {/* Main title with animations */}
                        <h1 className="text-4xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight">
                            <span className="inline-block animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
                                {title.split(' ').map((word, index) => (
                                    <span 
                                        key={index} 
                                        className="inline-block mr-4"
                                        style={{ 
                                            animationDelay: `${0.3 + index * 0.1}s`,
                                            animationFillMode: 'both'
                                        }}
                                    >
                                        {word}
                                    </span>
                                ))}
                            </span>
                        </h1>

                        {/* Subtitle */}
                        <p 
                            className="text-xl md:text-3xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed font-light animate-fade-in-up"
                            style={{ animationDelay: '0.6s', animationFillMode: 'both' }}
                        >
                            {subtitle}
                        </p>

                        {/* Event details cards */}
                        <div 
                            className="flex flex-wrap justify-center gap-4 md:gap-6 mb-12 animate-fade-in-up"
                            style={{ animationDelay: '0.8s', animationFillMode: 'both' }}
                        >
                            <div className="group bg-white/10 backdrop-blur-lg rounded-2xl px-6 py-4 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                                <div className="flex items-center gap-3">
                                    <Calendar className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                                    <span className="text-white font-semibold text-lg">{date}</span>
                                </div>
                            </div>

                            <div className="group bg-white/10 backdrop-blur-lg rounded-2xl px-6 py-4 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                                <div className="flex items-center gap-3">
                                    <svg className="w-6 h-6 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0 9c-5 0-9-4-9-9m9 9c5 0 9-4 9-9m-9 9H3m0 0a9 9 0 019-9" />
                                    </svg>
                                    <span className="text-white font-semibold text-lg">Submissão On-line</span>
                                </div>
                            </div>

                            <div className="group bg-white/10 backdrop-blur-lg rounded-2xl px-6 py-4 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                                <div className="flex items-center gap-3">
                                    <Users className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                                    <span className="text-white font-semibold text-lg">Até 5 Autores</span>
                                </div>
                            </div>
                        </div>

                        {/* CTA Button */}
                        {submissionUrl && (
                            <a
                                href="#datas-importantes"
                                className="inline-flex items-center justify-center gap-3 bg-white font-bold text-lg px-10 py-4 rounded-full shadow-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 animate-fade-in-up"
                                style={{ animationDelay: '1s', animationFillMode: 'both', color: colors.primary }}
                            >
                                <ArrowDown className="w-5 h-5" />
                                <span>Leia o Edital e Submeta</span>
                            </a>
                        )}
                    </div>


                </header>

                {/* About Section */}
                <Section className="py-20 md:py-32 px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-8 relative group">
                                <div 
                                    className="absolute inset-0 rounded-2xl opacity-10 group-hover:opacity-20 transition-opacity duration-300"
                                    style={{ backgroundColor: colors.primary }}
                                ></div>
                                <svg className="w-10 h-10 relative z-10" style={{ color: colors.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>

                                                            <h2 className="text-4xl md:text-6xl font-bold mb-8" style={{ color: colors.text }}>
                                                                Sobre o Congresso
                                                            </h2>                        </div>

                        <div className="grid md:grid-cols-1 gap-12 items-center">
                            {/* Description */}
                            <div>
                                <p className="text-xl md:text-2xl text-justify text-gray-700 leading-relaxed mb-8">
                                    {description}
                                </p>
                            </div>
                        </div>
                    </div>
                </Section>

                {/* Edital Dates Section */}
                {editalDates && (
                    <Section id="datas-importantes" className="py-20 md:py-32 px-4 bg-gradient-to-b from-white to-gray-50">
                        <div className="max-w-6xl mx-auto">
                            <div className="text-center mb-16">
                                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-8 relative group">
                                    <div 
                                        className="absolute inset-0 rounded-2xl opacity-10 group-hover:opacity-20 transition-opacity duration-300"
                                        style={{ backgroundColor: colors.secondary }}
                                    ></div>
                                    <CalendarCheck className="w-10 h-10 relative z-10" style={{ color: colors.secondary }} />
                                </div>
                                <h2 className="text-4xl md:text-6xl font-bold mb-8" style={{ color: colors.text }}>
                                    Datas Importantes
                                </h2>
                            </div>
                            <EditalDatesDisplay editalDates={editalDates} colors={colors} />
                        </div>
                    </Section>
                )}

                {/* Edital Sections */}
                {editalSections && editalSections.length > 0 && (
                    <Section id="edital-content" className="py-20 md:py-32 px-4 bg-gradient-to-b from-white to-gray-50">
                        <div className="max-w-6xl mx-auto">
                            <div className="text-center mb-16">
                                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-8 relative group">
                                    <div 
                                        className="absolute inset-0 rounded-2xl opacity-10 group-hover:opacity-20 transition-opacity duration-300"
                                        style={{ backgroundColor: colors.accent }}
                                    ></div>
                                    <MessageSquare className="w-10 h-10 relative z-10" style={{ color: colors.accent }} />
                                </div>
                                <h2 className="text-4xl md:text-6xl font-bold mb-8" style={{ color: colors.text }}>
                                    Normas para Submissão
                                </h2>
                            </div>
                            <div className="space-y-12">
                                {editalSections.map((section) => (
                                    <div key={section.id} className="bg-white rounded-lg shadow-lg p-8 border-l-4" style={{ borderColor: colors.primary }}>
                                        <h3 className="text-3xl font-bold mb-4" style={{ color: colors.secondary }}>{section.title}</h3>
                                        <div className="tiptap-container prose max-w-none text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: section.content.replace(/\n/g, '<br />') }}></div>
                                    </div>
                                ))}
                            </div>

                            {/* --- New Submission Button --- */}
                            {submissionUrl && (
                                <div className="text-center mt-16">
                                    <a
                                        href={submissionUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center gap-3 text-white font-bold text-xl px-12 py-5 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300"
                                        style={{ backgroundColor: colors.accent, color: getContrastingTextColor(colors.accent) }}
                                    >
                                        <Send className="w-6 h-6" />
                                        <span>Submeter Trabalho Agora</span>
                                    </a>
                                </div>
                            )}
                        </div>
                    </Section>
                )}

                {/* Template Download Section */}
                <Section className="py-20 md:py-32 px-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-8 relative group">
                                <div 
                                    className="absolute inset-0 rounded-2xl opacity-10 group-hover:opacity-20 transition-opacity duration-300"
                                    style={{ backgroundColor: colors.primary }}
                                ></div>
                                <Download className="w-10 h-10 relative z-10" style={{ color: colors.primary }} />
                            </div>
                            <h2 className="text-4xl md:text-6xl font-bold mb-8" style={{ color: colors.text }}>
                                Modelos para Submissão
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                                Baixe os modelos oficiais para a submissão de seus trabalhos.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
                            {templates.map(({ key, label }) => {
                                const url = templateUrls?.[key];
                                if (!url) return null;

                                return (
                                    <a 
                                        key={key}
                                        href={url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="group flex flex-col items-center justify-center p-8 rounded-2xl text-center transition-all duration-300 transform hover:scale-105 shadow-lg"
                                        style={{ backgroundColor: colors.accent, color: getContrastingTextColor(colors.accent) }}
                                    >
                                        <Download className="w-16 h-16 mb-4 group-hover:animate-bounce" />
                                        <span className="text-xl font-semibold">{label}</span>
                                        <span className="text-sm opacity-80 mt-2">Clique para baixar</span>
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                </Section>

                {/* FAQ Section */}
                {faq && faq.length > 0 && (
                    <Section className="py-20 md:py-32 px-4 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
                        {/* Background decoration */}
                        <div className="absolute inset-0 opacity-[0.02]">
                            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <pattern id="faq-pattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
                                <circle cx="60" cy="60" r="2" fill={colors.primary}/>
                                <circle cx="20" cy="20" r="1" fill={colors.accent}/>
                                <circle cx="100" cy="40" r="1.5" fill={colors.secondary}/>
                                </pattern>
                            </defs>
                            <rect x="0" y="0" width="100%" height="100%" fill="url(#faq-pattern)"/>
                            </svg>
                        </div>

                        <div className="max-w-5xl mx-auto relative z-10">
                            {/* Header */}
                            <div className="text-center mb-20">
                                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-8 relative group">
                                    <div 
                                    className="absolute inset-0 rounded-2xl opacity-10 group-hover:opacity-20 transition-opacity duration-300"
                                    style={{ backgroundColor: colors.primary }}
                                    ></div>
                                    <HelpCircle className="w-10 h-10 relative z-10" style={{ color: colors.primary }} />
                                </div>
                                
                                <h2 className="text-4xl md:text-6xl font-bold mb-6" style={{ color: colors.text }}>
                                    Perguntas Frequentes
                                </h2>
                                <p className="text-gray-600 text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed">
                                    Tire todas as suas dúvidas sobre o edital de submissão.
                                </p>
                            </div>
                            
                            {/* FAQ Items */}
                            <div className="space-y-6 mb-20">
                            {faq.map((item, index) => (
                                <div 
                                key={index}
                                className={`group relative bg-white rounded-3xl shadow-sm overflow-hidden transition-all duration-500 border-2 hover:shadow-xl ${
                                    openIndex === index ? 'shadow-2xl scale-[1.02]' : 'hover:scale-[1.01]'
                                }`}
                                style={{
                                    borderColor: openIndex === index ? colors.accent : '#f1f5f9',
                                }}
                                >
                                {/* Gradient overlay for active item */}
                                {openIndex === index && (
                                    <div 
                                    className="absolute top-0 left-0 right-0 h-1 opacity-80"
                                    style={{ 
                                        background: `linear-gradient(90deg, ${colors.accent}, ${colors.primary}, ${colors.secondary})`
                                    }}
                                    />
                                )}

                                <button
                                    onClick={() => toggleFaq(index)}
                                    className="w-full p-6 md:p-8 text-left flex justify-between items-start gap-4 hover:bg-gray-50/50 focus:outline-none focus:bg-gray-50 transition-all duration-300"
                                    aria-expanded={openIndex === index}
                                    aria-controls={`faq-answer-${index}`}
                                >
                                    <div className="flex-1">
                                    <span className="font-bold text-lg md:text-xl leading-relaxed block" style={{ color: colors.text }}>
                                        {item.question}
                                    </span>
                                    </div>
                                    
                                    <div className="flex-shrink-0 ml-4">
                                    <div 
                                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 ${
                                        openIndex === index ? 'rotate-180 shadow-lg' : 'hover:shadow-md group-hover:scale-110'
                                        }`}
                                        style={{ 
                                        backgroundColor: openIndex === index ? colors.accent : `${colors.primary}15`,
                                        }}
                                    >
                                        <ChevronDown
                                        className="w-6 h-6 transition-all duration-500"
                                        style={{ 
                                            color: openIndex === index ? 'white' : colors.primary 
                                        }}
                                        />
                                    </div>
                                    </div>
                                </button>
                                
                                {/* Answer section with smooth animation */}
                                <div
                                    id={`faq-answer-${index}`}
                                    className="grid transition-all duration-700 ease-out"
                                    style={{
                                    gridTemplateRows: openIndex === index ? '1fr' : '0fr',
                                    }}
                                >
                                    <div className="overflow-hidden">
                                    <div className="px-6 md:px-8 pb-6 md:pb-8 pt-0">
                                        <div 
                                        className="w-full h-px mb-6 opacity-20"
                                        style={{ backgroundColor: colors.primary }}
                                        />
                                        <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                                        {item.answer}
                                        </p>
                                    </div>
                                    </div>
                                </div>
                                </div>
                            ))}
                            </div>
                        </div>
                    </Section>
                )}

                {/* Contact Section */}
                <Section id="contact" className="py-20 md:py-32 px-4 relative overflow-hidden" style={{ backgroundColor: colors.primary }}>
                    {/* Background decoration */}
                    <div className="absolute inset-0 opacity-10">
                        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <pattern id="contact-pattern" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
                                    <circle cx="100" cy="100" r="3" fill="white" opacity="0.4"/>
                                    <circle cx="50" cy="50" r="2" fill="white" opacity="0.3"/>
                                    <circle cx="150" cy="150" r="2" fill="white" opacity="0.3"/>
                                    <path d="M0,100 Q50,50 100,100 Q150,150 200,100" stroke="white" strokeWidth="1" fill="none" opacity="0.2"/>
                                </pattern>
                            </defs>
                            <rect x="0" y="0" width="100%" height="100%" fill="url(#contact-pattern)"/>
                        </svg>
                    </div>

                    <div className="max-w-4xl mx-auto text-center relative z-10">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl mb-8">
                            <Mail className="w-10 h-10 text-white" />
                        </div>

                        <h2 className='text-2xl md:text-3xl text-white/90 mb-4 font-light'>Não encontrou o que procurava?</h2>
                        <h2 className="text-4xl md:text-6xl font-bold text-white mb-12">
                            Entre em Contato
                        </h2>
                        
                        <div className="flex flex-wrap justify-center gap-6 md:gap-8">
                            <a 
                                href={`mailto:${congress.contact?.email || ''}`}
                                className="group flex items-center gap-4 text-white/90 hover:text-white transition-all duration-300 text-lg md:text-xl bg-white/10 backdrop-blur-sm px-6 py-4 rounded-2xl hover:bg-white/15 hover:scale-105"
                            >
                                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-colors">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div className="text-left">
                                    <div className="font-semibold">Email</div>
                                    <div className="text-sm opacity-75">{congress.contact?.email}</div>
                                </div>
                            </a>

                            {congress.contact?.whatsapp && (
                                <a 
                                    href={`https://wa.me/${congress.contact?.whatsapp}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-center gap-4 text-white/90 hover:text-white transition-all duration-300 text-lg md:text-xl bg-white/10 backdrop-blur-sm px-6 py-4 rounded-2xl hover:bg-white/15 hover:scale-105"
                                >
                                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-colors">
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.451-4.433-9.884-9.889-9.884-5.452 0-9.885 4.434-9.889 9.884-.001 2.225.651 4.315 1.919 6.066l-1.425 5.202 5.025-1.318z" />
                                        </svg>
                                    </div>
                                    <div className="text-left">
                                        <div className="font-semibold">WhatsApp</div>
                                        <div className="text-sm opacity-75">Conversar agora</div>
                                    </div>
                                </a>
                            )}

                            {congress.contact?.instagram && (
                                <a
                                    href={`https://instagram.com/${congress.contact?.instagram?.replace('@', '') || ''}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-center gap-4 text-white/90 hover:text-white transition-all duration-300 text-lg md:text-xl bg-white/10 backdrop-blur-sm px-6 py-4 rounded-2xl hover:bg-white/15 hover:scale-105"
                                >
                                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-colors">
                                        <Instagram className="w-6 h-6" />
                                    </div>
                                    <div className="text-left">
                                        <div className="font-semibold">Instagram</div>
                                        <div className="text-sm opacity-75">{congress.contact?.instagram}</div>
                                    </div>
                                </a>
                            )}
                        </div>
                    </div>
                </Section>
            </main>

            <FloatingDownloads templateUrls={templateUrls} colors={colors} />
            
            
            <footer className="relative bg-gray-900 text-white overflow-hidden">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-5">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="footer-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                      <circle cx="50" cy="50" r="2" fill="white" opacity="0.3"/>
                      <circle cx="0" cy="0" r="1" fill="white" opacity="0.2"/>
                      <circle cx="100" cy="100" r="1" fill="white" opacity="0.2"/>
                      <path d="M0,50 Q25,25 50,50 Q75,75 100,50" stroke="white" strokeWidth="0.5" fill="none" opacity="0.1"/>
                    </pattern>
                  </defs>
                  <rect x="0" y="0" width="100%" height="100%" fill="url(#footer-pattern)"/>
                </svg>
              </div>

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-800/50 to-transparent"></div>

              <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
                <div className="flex flex-col items-center md:flex-row md:justify-between md:items-center gap-6 md:gap-8">
                  
                  <div className="flex flex-col items-center md:items-start text-center md:text-left">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 flex items-center justify-center flex-shrink-0">
                        <Image 
                          src="/logo-sobrec.png" 
                          alt="SOBREC Logo" 
                          width={48} 
                          height={48} 
                          className="object-contain"
                        />
                      </div>
                      
                      <div className="hidden md:block">
                        <h3 className="text-xl font-bold text-white leading-tight">
                          SOBREC - Sociedade Brasileira de Eventos Científicos
                        </h3>
                        <p className="text-gray-400 text-sm">
                          Conectando conhecimento
                        </p>
                      </div>
                    </div>
                    
                    <div className="md:hidden text-center">
                      <h3 className="text-lg font-bold text-white leading-tight mb-1">
                        SOBREC
                      </h3>
                      <h4 className="text-sm font-medium text-white/90 mb-1">
                        Sociedade Brasileira de Eventos Científicos
                      </h4>
                      <p className="text-gray-400 text-sm">
                        Conectando conhecimento
                      </p>
                    </div>
                  </div>

                  <div className="text-center md:text-right flex-shrink-0">
                    <p className="text-gray-400 text-sm mb-2 font-medium">
                      © {new Date().getFullYear()} - SOBREC
                    </p>
                    <p className="text-gray-500 text-xs">
                      Todos os direitos reservados
                    </p>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-gray-700/50">
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent"></div>
                </div>
              </div>
            </footer>

            {/* CSS Animations */}
            <style jsx>{`
                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-fade-in-up {
                    animation: fade-in-up 0.8s ease-out forwards;
                    opacity: 0;
                }
            `}</style>
        </div>
    );
}