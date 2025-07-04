export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} SOBREC - Sociedade Brasileira de Eventos Científicos. Todos os direitos reservados.
        </p>
        <p className="text-xs text-gray-400 mt-2">
          Desenvolvido como parte do guia de submissão de resumos acadêmicos.
        </p>
      </div>
    </footer>
  )
}