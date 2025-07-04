import { BookOpen } from 'lucide-react'

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h1 className="text-lg font-bold text-gray-900">Guia de Resumos Científicos</h1>
              <p className="text-sm text-gray-500">SOBREC - Congressos</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}