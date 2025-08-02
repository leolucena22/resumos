import { CheckCircle, AlertCircle, FileText, Upload } from 'lucide-react'

export default function ResumoExpandido() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Resumo Expandido</h1>
        <p className="text-lg text-gray-600">Formato detalhado para apresentação aprofundada da pesquisa</p>
      </div>

      {/* Características */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Características Principais</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3" />
              <div>
                <h3 className="font-semibold text-gray-900">Extensão</h3>
                <p className="text-gray-600">Mínimo 4 páginas, máximo 7 páginas</p>
              </div>
            </div>
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3" />
              <div>
                <h3 className="font-semibold text-gray-900">Formato</h3>
                <p className="text-gray-600">Documento PDF obrigatório</p>
              </div>
            </div>
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3" />
              <div>
                <h3 className="font-semibold text-gray-900">Referências</h3>
                <p className="text-gray-600">Bibliográficas obrigatórias (ABNT NBR 6023:2018)</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3" />
              <div>
                <h3 className="font-semibold text-gray-900">Elementos Visuais</h3>
                <p className="text-gray-600">Permite tabelas e figuras</p>
              </div>
            </div>
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3" />
              <div>
                <h3 className="font-semibold text-gray-900">Duas Versões</h3>
                <p className="text-gray-600">Com e sem identificação dos autores</p>
              </div>
            </div>
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3" />
              <div>
                <h3 className="font-semibold text-gray-900">Citações</h3>
                <p className="text-gray-600">Seguir padrão ABNT 10520 (2023)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Formatação */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Formatação Obrigatória</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Margens</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Superior: 3 cm</li>
              <li>• Inferior: 2 cm</li>
              <li>• Esquerda: 3 cm</li>
              <li>• Direita: 2 cm</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Espaçamento</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Entre linhas: 1,0</li>
              <li>• Fonte: Times New Roman</li>
              <li>• Tamanho: 12 pt</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Estrutura */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Estrutura do Documento</h2>
        
        <div className="space-y-6">
          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Para Pesquisas Tradicionais:</h3>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-gray-900">1. Introdução</h4>
                <p className="text-gray-600">Contextualização, justificativa e objetivo geral</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">2. Material e Métodos</h4>
                <p className="text-gray-600">Procedimentos detalhados da pesquisa</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">3. Resultados e Discussão</h4>
                <p className="text-gray-600">Apresentação, interpretação e comparação com literatura</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">4. Conclusão</h4>
                <p className="text-gray-600">Síntese dos achados e perspectivas futuras</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">5. Referências</h4>
                <p className="text-gray-600">Bibliografia em ordem alfabética (ABNT NBR 6023:2018)</p>
              </div>
            </div>
          </div>

          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Para Relatos de Caso/Experiência:</h3>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-gray-900">1. Introdução</h4>
                <p className="text-gray-600">Contextualização do caso/experiência</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">2. Relato de Caso/Experiência</h4>
                <p className="text-gray-600">Descrição detalhada do caso ou experiência</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">3. Discussão</h4>
                <p className="text-gray-600">Análise crítica e comparação com literatura</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">4. Conclusão</h4>
                <p className="text-gray-600">Considerações finais e implicações</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">5. Referências</h4>
                <p className="text-gray-600">Bibliografia em ordem alfabética</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*Referências */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">REFERÊNCIAS</h2>
        <p className="text-gray-600 mb-4">
          Aqui neste espaço devem ser listadas todos os trabalhos mencionados no texto. Em ordem alfabética seguindo as diretrizes <strong>ABNT NBR 10520:2023</strong> para elaboração de referências bibliográficas. <span className="block">Alinhadas à esquerda.</span>
        </p>
        <div className="space-y-4">
          <div>
            <span className="font-semibold text-gray-800">Anais de eventos:</span>
            <p className="text-gray-700 text-sm mt-1">
              BRAYNER, A. R. A.; MEDEIROS, C. B. Incorporação do tempo em SGBD orientado a objetos. In: Simpósio Brasileiro De Banco De Dados, 9., 1994, São Paulo. Anais [...]. São Paulo: USP. p. 16-29, 1994
            </p>
          </div>
          <div>
            <span className="font-semibold text-gray-800">Artigo científico:</span>
            <p className="text-gray-700 text-sm mt-1">
              DOREA, R. D.; COSTA, J. N.; BATITA, J. M.; FERREIRA, M. M.; MENEZES, R. V.; SOUZA, T. S. Reticuloperitonite traumática associada à esplenite e hepatite em bovino: relato de caso. Veterinária e Zootecnia, São Paulo, v. 18, n. 4, p. 199-202, 2011.
            </p>
          </div>
          <div>
            <span className="font-semibold text-gray-800">Livro:</span>
            <p className="text-gray-700 text-sm mt-1">
              LIMA, N. T.; HOCHMAN, G. Condições de saúde e população. Rio de Janeiro: Editora Fiocruz, 1996.
            </p>
          </div>
          <div>
            <span className="font-semibold text-gray-800">Trabalho de conclusão de curso:</span>
            <p className="text-gray-700 text-sm mt-1">
              SILVA, J. C. A atuação da enfermagem na atenção primária à saúde. Trabalho de Conclusão de Curso (Bacharelado em Enfermagem) – Universidade Federal do Ceará, Fortaleza, 55 f. 2022.
            </p>
          </div>
        </div>
      </div>

      {/* Tabelas e Figuras */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Tabelas e Figuras</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Tabelas</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Título <strong>acima</strong> da tabela</li>
              <li>• Sem negrito no título</li>
              <li>• Numeração sequencial</li>
              <li>• Qualidade para reprodução</li>
            </ul>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Figuras</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Título <strong>abaixo</strong> da figura</li>
              <li>• Sem negrito no título</li>
              <li>• Numeração sequencial</li>
              <li>• Qualidade para reprodução (mínimo 300 dpi)</li>
              <li>• Imagens em preto e branco ou tons de cinza</li>
            </ul>
          </div>
        </div>
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
            <div>
              <h4 className="font-semibold text-blue-800">Dica Importante!</h4>
              <p className="text-blue-700">
                Garanta que todas as tabelas e figuras sejam claras e legíveis, mesmo em preto e branco.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Submissão */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Instruções de Submissão</h2>
        <div className="space-y-4">
          <div className="flex items-start">
            <FileText className="h-5 w-5 text-purple-500 mt-0.5 mr-3" />
            <div>
              <h3 className="font-semibold text-gray-900">Template Oficial</h3>
              <p className="text-gray-600">
                É obrigatório o uso do template oficial do evento, disponível para download na plataforma de submissão.
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <Upload className="h-5 w-5 text-purple-500 mt-0.5 mr-3" />
            <div>
              <h3 className="font-semibold text-gray-900">Duas Versões do Arquivo</h3>
              <p className="text-gray-600">
                Faça o upload de <strong>duas versões</strong> do seu resumo expandido: uma com a identificação dos autores e outra completamente sem identificação (para avaliação cega). Ambos devem estar em formato <strong>PDF</strong>.
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <CheckCircle className="h-5 w-5 text-purple-500 mt-0.5 mr-3" />
            <div>
              <h3 className="font-semibold text-gray-900">Revisão Cuidadosa</h3>
              <p className="text-gray-600">
                Antes da submissão final, revise atentamente o seu trabalho para garantir que todas as diretrizes de formatação e conteúdo foram seguidas.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-6 p-4 bg-red-50 rounded-lg">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3" />
            <div>
              <h4 className="font-semibold text-red-800">Atenção!</h4>
              <p className="text-red-700">
                A não conformidade com as diretrizes de submissão pode levar à desqualificação do trabalho.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}