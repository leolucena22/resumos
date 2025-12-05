'use client';

import { Editor } from '@tiptap/react';
import { useState } from 'react';
import { Table, Trash2 } from 'lucide-react';

interface TableMenuProps {
  editor: Editor;
}

const TableMenu = ({ editor }: TableMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [grid, setGrid] = useState({ rows: 0, cols: 0 });

  const handleInsertTable = () => {
    if (grid.rows > 0 && grid.cols > 0) {
      editor.chain().focus().insertTable({ rows: grid.rows, cols: grid.cols, withHeaderRow: true }).run();
    }
    setIsOpen(false);
    setGrid({ rows: 0, cols: 0 });
  };

  const handleGridHover = (row: number, col: number) => {
    setGrid({ rows: row, cols: col });
  };

  return (
    <div className="flex items-center gap-1">
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`p-2 rounded-md transition-colors ${
            isOpen ? 'bg-gray-200 text-gray-900' : 'hover:bg-gray-100 text-gray-600'
          }`}
          aria-label="Criar tabela"
        >
          <Table className="w-5 h-5" />
        </button>
        {isOpen && (
          <div
            className="absolute z-10 top-full mt-2 w-48 bg-white shadow-xl rounded-lg border border-gray-200 p-2"
            onMouseLeave={() => {
              setIsOpen(false);
              setGrid({ rows: 0, cols: 0 });
            }}
          >
            <div className="grid grid-cols-10 gap-1">
              {Array.from({ length: 100 }).map((_, index) => {
                const row = Math.floor(index / 10) + 1;
                const col = (index % 10) + 1;
                return (
                  <div
                    key={index}
                    onMouseOver={() => handleGridHover(row, col)}
                    onClick={handleInsertTable}
                    className={`w-3.5 h-3.5 rounded-sm cursor-pointer transition-all duration-75 ${
                      row <= grid.rows && col <= grid.cols
                        ? 'bg-blue-500 scale-110'
                        : 'bg-gray-200 hover:bg-blue-200'
                    }`}
                  />
                );
              })}
            </div>
            <div className="text-center mt-2 text-sm text-gray-600 select-none">
              {grid.rows > 0 && grid.cols > 0 ? (
                <span>
                  <span className="font-semibold">{grid.rows}</span> x <span className="font-semibold">{grid.cols}</span>
                </span>
              ) : (
                'Criar tabela'
              )}
            </div>
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={() => editor.chain().focus().deleteTable().run()}
        disabled={!editor.can().deleteTable()}
        className="p-2 rounded-md transition-colors text-red-500 hover:bg-red-100 disabled:text-gray-400 disabled:bg-transparent"
        aria-label="Deletar tabela"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
};

export default TableMenu;
