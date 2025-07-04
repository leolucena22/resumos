import { CheckCircle, AlertCircle, XCircle } from 'lucide-react'

export default function ResumoSimples() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Resumo Simples</h1>
        <p className="text-lg text-gray-600">Formato conciso para apresentação dos principais achados</p>
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
                <p className="text-gray-600">Entre 250 e 350 palavras</p>
              </div>
            </div>
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3" />
              <div>
                <h3 className="font-semibold text-gray-900">Submissão</h3>
                <p className="text-gray-600">Via formulário online na plataforma</p>
              </div>
            </div>
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3" />
              <div>
                <h3 className="font-semibold text-gray-900">Palavras-chave</h3>
                <p className="text-gray-600">Três palavras-chave relacionadas ao tema</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-start">
              <XCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3" />
              <div>
                <h3 className="font-semibold text-gray-900">Não permitido</h3>
                <p className="text-gray-600">Quadros, ilustrações ou tabelas</p>
              </div>
            </div>
            <div className="flex items-start">
              <XCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3" />
              <div>
                <h3 className="font-semibold text-gray-900">Referências</h3>
                <p className="text-gray-600">Não são permitidas referências bibliográficas</p>
              </div>
            </div>
            <div className="flex items-start">
              <XCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3" />
              <div>
                <h3 className="font-semibold text-gray-900">Palavras-chave</h3>
                <p className="text-gray-600">Sem repetição de palavras do título</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Estrutura Obrigatória */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Estrutura Obrigatória</h2>
        
        <div className="space-y-6">
          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Para Pesquisas Tradicionais:</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li><strong>Introdução:</strong> Contextualização e justificativa</li>
              <li><strong>Objetivos:</strong> Propósito claro do estudo</li>
              <li><strong>Metodologia:</strong> Procedimentos adotados</li>
              <li><strong>Resultados:</strong> Principais achados</li>
              <li><strong>Conclusão:</strong> Considerações finais</li>
            </ol>
          </div>

          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Para Relatos de Caso/Experiência:</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li><strong>Introdução:</strong> Contextualização</li>
              <li><strong>Objetivo:</strong> Propósito do relato</li>
              <li><strong>Relato de caso/experiência:</strong> Descrição detalhada</li>
              <li><strong>Conclusão:</strong> Considerações finais</li>
            </ol>
          </div>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3" />
            <div>
              <h4 className="font-semibold text-yellow-800">Importante!</h4>
              <p className="text-yellow-700">
                Cada tópico deve ser apresentado em <strong>negrito</strong>, seguido de dois-pontos 
                (ex.: &quot;<strong>Introdução:</strong>&quot;)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Exemplo Prático */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Exemplo Prático</h2>
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Impacto da Telemedicina no Atendimento Primário Durante a Pandemia
          </h3>
          
          <div className="space-y-4 text-sm text-justify text-gray-700">
            <div>
              <strong>Introdução:</strong> A pandemia de COVID-19 transformou rapidamente a prestação 
              de serviços de saúde, acelerando a adoção da telemedicina como alternativa segura para 
              manter o atendimento primário. Este estudo investiga os impactos dessa modalidade na 
              qualidade do cuidado e satisfação dos pacientes. 
            
            
          
              <strong> Objetivos:</strong> Avaliar a eficácia da telemedicina no atendimento primário 
              durante a pandemia e identificar fatores que influenciam a satisfação dos pacientes.
          
            
           
              <strong> Metodologia:</strong> Estudo observacional transversal com 200 pacientes atendidos 
              via telemedicina entre março e setembro de 2020. Aplicou-se questionário validado para 
              medir satisfação e eficácia do atendimento.
          
            
         
              <strong> Resultados:</strong> 85% dos pacientes relataram satisfação com o atendimento 
              remoto. Houve redução de 60% no tempo de espera e 90% de resolução de casos simples. 
              Principais limitações incluíram dificuldades tecnológicas em 15% dos casos.
           
            
         
              <strong> Conclusão:</strong> A telemedicina mostrou-se eficaz para o atendimento primário, 
              especialmente em consultas de seguimento e casos menos complexos, representando uma 
              alternativa viável para ampliar o acesso aos serviços de saúde.
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-gray-600">
              <strong>Palavras-chave:</strong> telemedicina; atenção primária; satisfação do paciente
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}