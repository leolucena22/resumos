'use client';

import { CalendarClock, Trash2 } from 'lucide-react';

interface Deadline {
  id: string;
  name: string;
  date: string;
  time?: string;
}

interface DeadlineSectionProps {
  title: string;
  deadlines: Deadline[];
  onAdd: () => void;
  onUpdate: (index: number, updatedField: Partial<Deadline>) => void;
  onRemove: (index: number) => void;
  isEditing: boolean;
}

const DeadlineSection = ({ title, deadlines, onAdd, onUpdate, onRemove, isEditing }: DeadlineSectionProps) => (
  <div className="border rounded-lg p-4 bg-white shadow-sm">
    <div className="flex justify-between items-center mb-4">
      <h4 className="font-semibold text-gray-900 flex items-center">
        <CalendarClock className="w-5 h-5 mr-2 text-gray-600" />
        {title}
      </h4>
      {isEditing && deadlines.length > 0 && (
        <button onClick={onAdd} className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm transition-colors">
          + Novo Prazo
        </button>
      )}
    </div>
    <div className="space-y-4">
      {deadlines.map((deadline, index) => (
        <div key={deadline.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-gray-50 p-3 rounded-lg md:bg-transparent md:p-0">
          <div className="md:col-span-5">
            <label className="block text-xs font-medium text-gray-500 mb-1 md:hidden">Descrição</label>
            <input
              type="text"
              value={deadline.name}
              onChange={(e) => onUpdate(index, { name: e.target.value })}
              disabled={!isEditing}
              placeholder="Descrição do Prazo (ex: Submissão Regular)"
              className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-lg disabled:bg-gray-100 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <div className="md:col-span-3">
             <label className="block text-xs font-medium text-gray-500 mb-1 md:hidden">Data</label>
            <input
              type="date"
              value={deadline.date}
              onChange={(e) => onUpdate(index, { date: e.target.value })}
              disabled={!isEditing}
              className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-lg disabled:bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <div className="md:col-span-3">
             <label className="block text-xs font-medium text-gray-500 mb-1 md:hidden">Hora</label>
            <input
              type="time"
              value={deadline.time || ''}
              onChange={(e) => onUpdate(index, { time: e.target.value })}
              disabled={!isEditing}
              className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-lg disabled:bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          {isEditing && (
            <div className="md:col-span-1 text-right flex justify-end">
              <button
                onClick={() => onRemove(index)}
                className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                title="Remover prazo"
                aria-label="Remover prazo"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      ))}
      {deadlines.length === 0 && (
        <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <p className="text-sm text-gray-500 mb-3">Nenhum prazo definido para esta seção.</p>
          {isEditing && (
            <button
              onClick={onAdd}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold shadow-sm"
            >
              + Adicionar Primeiro Prazo
            </button>
          )}
        </div>
      )}
    </div>
  </div>
);

export default DeadlineSection;
