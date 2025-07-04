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
            Impacto da Telemedicina no Atendimento Primário Durante a Pandemia - <span className='text-blue-500'>(Inserir no local Correto)</span>
          </h3>
          
          <div className="space-y-4 text-sm text-justify text-gray-700">
            <div>
    <strong>Introdução:</strong> A pandemia de COVID-19 rapidamente transformou a prestação de serviços de saúde, acelerando a adoção da telemedicina como uma alternativa segura e eficaz para manter a continuidade do atendimento primário. Essa mudança radical no modelo de assistência levanta questões importantes sobre a qualidade do cuidado oferecido e a satisfação dos pacientes em um ambiente virtual. Este estudo, portanto, se propõe a investigar profundamente os impactos dessa modalidade inovadora na qualidade geral do atendimento e na percepção de satisfação dos indivíduos que a utilizaram. A compreensão desses fatores é crucial para aprimorar e expandir a telemedicina no cenário pós-pandemia.
   
    <strong> Objetivos:</strong> Os objetivos primários deste trabalho foram duplos: primeiro, avaliar a real eficácia da telemedicina na oferta de serviços de atendimento primário ao longo do período crítico da pandemia; e, segundo, identificar e analisar os diversos fatores que influenciaram diretamente a satisfação dos pacientes com essa nova forma de consulta e acompanhamento remoto.

    <strong> Metodologia:</strong> Para atingir os objetivos propostos, foi conduzido um estudo observacional transversal. A pesquisa envolveu uma amostra de 200 pacientes que foram atendidos por meio da telemedicina. O período de coleta de dados abrangeu os meses de março a setembro de 2020, que marcam o auge da crise sanitária. Um questionário previamente validado foi aplicado a esses participantes, sendo a ferramenta principal para mensurar tanto os níveis de satisfação quanto a percepção de eficácia do atendimento remoto recebido.
 
    <strong> Resultados:</strong> Os achados do estudo são encorajadores: uma expressiva maioria de 85% dos pacientes relatou satisfação com a experiência do atendimento via telemedicina. Em termos de eficiência, observou-se uma notável redução de 60% no tempo de espera por consultas, um benefício direto para os usuários. Além disso, a telemedicina demonstrou alta capacidade de resolução, com 90% dos casos simples sendo solucionados remotamente. No entanto, o estudo também apontou desafios significativos: as principais limitações incluíram dificuldades de ordem tecnológica, que afetaram 15% dos pacientes, destacando a necessidade de infraestrutura e suporte aprimorados.

    <strong> Conclusão:</strong> Em suma, a telemedicina provou ser uma ferramenta altamente eficaz para a prestação de atendimento primário, revelando-se particularmente vantajosa para consultas de seguimento e manejo de casos de menor complexidade. Apesar das barreiras tecnológicas pontuais, os resultados reforçam seu potencial como uma alternativa viável e promissora para expandir o acesso aos serviços de saúde, otimizando recursos e proporcionando conveniência. A telemedicina, portanto, consolida-se como um pilar fundamental e duradouro no futuro da assistência médica.
</div>
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-gray-600">
              <strong>Palavras-chave:</strong> telesaúde; atenção primária; satisfação do paciente - <span className='text-blue-500'>(Inserir no local Correto)</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}