import { FileText, BookOpen, Presentation, HelpCircle } from 'lucide-react'

type NavigationProps = {
  activeSection: string;
  setActiveSection: (section: string) => void;
};

export default function Navigation({ activeSection, setActiveSection }: NavigationProps) {
  const menuItems = [
    { id: 'inicio', label: 'Início', icon: FileText },
    { id: 'resumo-simples', label: 'Resumo Simples', icon: FileText },
    { id: 'resumo-expandido', label: 'Resumo Expandido', icon: BookOpen },
    { id: 'apresentacao', label: 'Apresentação', icon: Presentation },
    { id: 'quiz', label: 'Quiz', icon: HelpCircle },
  ]

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8 overflow-x-auto">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`flex items-center px-3 py-4 text-sm font-medium whitespace-nowrap border-b-2 ${
                  activeSection === item.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {item.label}
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}