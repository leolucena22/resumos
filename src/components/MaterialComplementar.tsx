import { BookOpen } from "lucide-react";

export default function MaterialComplementar() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Material Complementar</h1>
        <p className="text-lg text-gray-600">
          Explore os recursos adicionais para aprimorar sua experiência no congresso.
        </p>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          <BookOpen className="h-6 w-6 text-blue-500 mr-2" /> Material de Apoio
        </h2>
        <p className="text-gray-600">
          Acesse o material de apoio para obter informações detalhadas sobre os temas abordados.
        </p>
        <div className="mt-6 space-y-4">
          {/* Incorporação do vídeo do Vimeo */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Minicurso - Como produzir um resumo científico</h3>
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                src="https://player.vimeo.com/video/798450790?h=6b7db2b8e8"
                width="100%"
                height="360"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title="Vídeo Explicativo"
                className="w-full rounded"
              ></iframe>
            </div>
          </div>
          {/* Link para PDF */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Material em PDF</h3>
            <a
              href="https://drive.google.com/file/d/1ao8NDyKLu6Ji5lSZIBH27TGgOHvVyyvS/view?usp=drive_link"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Acesse o PDF do material complementar
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}