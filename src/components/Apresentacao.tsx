import { Megaphone, Lightbulb, CheckCircle, Video, Image } from 'lucide-react' // Adicione Video e Image aqui

export default function Apresentacao() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Dicas para sua Apresentação</h1>
        <p className="text-lg text-gray-600">
          Prepare-se para apresentar seu trabalho com confiança e clareza.
        </p>
      </div>

      {/* Seção: Estruturando sua Fala (Mantida com cores originais) */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          <Megaphone className="h-6 w-6 text-blue-500 mr-2" />
          Estruturando sua Fala
        </h2>
        <div className="space-y-4 text-gray-700">
          <p>
            Ao apresentar seu resumo, seja ele simples ou expandido, é crucial organizar suas ideias para transmitir a mensagem principal de forma eficaz. Pense na sua apresentação como uma versão verbal do seu resumo.
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Introdução:</strong> Comece apresentando o tema e o objetivo do seu trabalho. Cative a atenção do público.
            </li>
            <li>
              <strong>Metodologia (se aplicável):</strong> Descreva brevemente como a pesquisa foi conduzida.
            </li>
            <li>
              <strong>Resultados Principais:</strong> Foco nos achados mais relevantes e significativos. Use dados e exemplos claros.
            </li>
            <li>
              <strong>Conclusão e Implicações:</strong> Resuma suas descobertas e discuta a importância do seu trabalho, suas limitações e futuras direções.
            </li>
          </ul>
        </div>
      </div>

      {/* Seção: Dicas para uma Apresentação de Sucesso (Mantida com cores originais) */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          <Lightbulb className="h-6 w-6 text-yellow-500 mr-2" />
          Dicas para uma Apresentação de Sucesso
        </h2>
        <div className="space-y-4 text-gray-700">
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Pratique:</strong> Ensaiar a apresentação várias vezes ajuda a gerenciar o tempo e a fluidez da fala.
            </li>
            <li>
              <strong>Recursos Visuais:</strong> Utilize slides claros e concisos. Evite excesso de texto; use imagens, gráficos e tabelas para ilustrar seus pontos.
            </li>
            <li>
              <strong>Gerenciamento do Tempo:</strong> Respeite o tempo alocado para sua apresentação. Treine para não exceder ou ficar muito aquém.
            </li>
          </ul>
        </div>
      </div>

      {/* --- NOVAS SEÇÕES DE MODALIDADES DE APRESENTAÇÃO --- */}

      {/* Seção: 7.1. Modalidade Oral */}
      <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500"> {/* Cor da borda original: blue-500 */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          <Video className="h-6 w-6 text-blue-500 mr-2" /> {/* Cor do ícone original: blue-500 */}
          Modalidade Oral
        </h2>
        <div className="space-y-4 text-gray-700">
          <p>
            Os autores com trabalhos aprovados devem enviar sua apresentação oral através da plataforma do evento até a data estipulada pelo edital.
            <br />
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>
              A apresentação oral deve ser realizada no tempo de <strong>7 a 10 minutos</strong>, obrigatoriamente. A apresentação poderá ser realizada por qualquer um dos autores.
            </li>
            <li>
              O vídeo da gravação deve obrigatoriamente conter o <strong>compartilhamento de tela</strong> e a <strong>captura de sua webcam</strong> (lembre-se de ativar o seu microfone).
            </li>
            <li>
              Após recebermos sua gravação, o material será analisado e a aprovação ou reprovação poderá ser acompanhada na sua área de inscrito.
            </li>
          </ul>
        </div>
      </div>

      {/* Seção: 7.2. Modalidade E-banner */}
      <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500"> {/* Usando green-500 para a borda do e-banner */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          <Image className="h-6 w-6 text-green-500 mr-2" /> {/* Usando green-500 para o ícone do e-banner */}
          Modalidade E-banner
        </h2>
        <div className="space-y-4 text-gray-700">
          <p>
            Os autores que tiverem seus trabalhos aprovados deverão enviar sua apresentação por e-banner através da plataforma do evento até a data estipulada por esse edital.
            <br />
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>
              O banner deve ser <strong>autoexplicativo</strong>;
            </li>
            <li>
              Ao finalizar o preparo do banner vá até o menu &quot;Arquivo&quot; no PowerPoint, depois siga para a opção &quot;Salvar como&quot; e escolha o salvamento em tipo &quot;Formato JPEG(*.jpg), que é o formato de imagem&quot;, ou PDF.
            </li>
            <li>
              Após recebermos o e-banner, o material será analisado e a aprovação ou reprovação dele poderá ser acompanhada na sua área inscrito no site do evento.
            </li>
          </ul>
        </div>
      </div>

      {/* Lembrete Final (Mantido com cores originais) */}
      <div className="mt-6 p-4 bg-green-50 rounded-lg">
        <div className="flex items-start">
          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-3" />
          <div>
            <h4 className="font-semibold text-green-800">Lembre-se!</h4>
            <p className="text-green-700">
              Uma boa apresentação não é apenas sobre o que você diz, mas como você diz. Conecte-se com seu público!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}