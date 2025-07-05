'use client'

import { useState } from 'react'
import { BookOpen, FileText, Users, CheckCircle, AlertCircle, Info } from 'lucide-react'
import Header from '@/components/Header'
import Navigation from '@/components/Navigation'
import ResumoSimples from '@/components/ResumoSimples'
import ResumoExpandido from '@/components/ResumoExpandido'
import Apresentacao from '@/components/Apresentacao'
import Quiz from '@/components/Quiz'
import Footer from '@/components/Footer'
import MaterialComplementar from '@/components/MaterialComplementar'
import './globals.css'

export default function Home() {
  const [activeSection, setActiveSection] = useState('inicio')

  const renderContent = () => {
    switch (activeSection) {
      case 'resumo-simples':
        return <ResumoSimples />
      case 'resumo-expandido':
        return <ResumoExpandido />
      case 'apresentacao':
        return <Apresentacao />
      case 'quiz':
        return <Quiz />
      case 'material-complementar':
        return <MaterialComplementar />
      default:
        return <InicioSection />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <Navigation activeSection={activeSection} setActiveSection={setActiveSection} />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {renderContent()}
      </main>
      
      <Footer />
    </div>
  )
}

function InicioSection() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Guia prático para organização e estruturação de resumos científicos 
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Aprenda a estruturar resumos simples e expandidos seguindo as diretrizes de eventos organizados pela SOBREC
        </p>
      </div>

      {/* Cards de Tipos de Resumo */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center mb-4">
            <FileText className="h-8 w-8 text-blue-500 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Resumo Simples</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Formato conciso com 250-350 palavras, ideal para apresentações diretas dos principais achados.
          </p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              Estrutura obrigatória definida
            </li>
            <li className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              Sem citações e referências bibliográficas 
            </li>
            <li className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              Submissão via formulário online
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center mb-4">
            <BookOpen className="h-8 w-8 text-green-500 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Resumo Expandido</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Formato mais detalhado com 4-7 páginas, permitindo maior profundidade na discussão.
          </p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              Inclui referências bibliográficas
            </li>
            <li className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              Permite tabelas e figuras
            </li>
            <li className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              Formato PDF obrigatório
            </li>
          </ul>
        </div>
      </div>

      {/* Regras Gerais */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Info className="h-6 w-6 text-blue-500 mr-2" />
          Regras Gerais de Submissão
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Templates Obrigatórios</h3>
            <p className="text-sm text-gray-600">Utilize os modelos fornecidos para cada categoria</p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Users className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Duas Versões</h3>
            <p className="text-sm text-gray-600">Com e sem identificação dos autores (resumo expandido)</p>
          </div>
          <div className="text-center">
            <div className="bg-yellow-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-yellow-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Acompanhamento</h3>
            <p className="text-sm text-gray-600">Monitore o status na aba &quot;Meus Trabalhos&quot;</p>
          </div>
        </div>
      </div>
    </div>
  )
}