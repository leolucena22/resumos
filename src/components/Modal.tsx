'use client';

import { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title: string;
}

const Modal = ({ isOpen, onClose, children, title }: ModalProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ease-in-out"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-fade-in-scale">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
            <button
                className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors"
                onClick={onClose}
                aria-label="Close modal"
            >
                <X className="w-6 h-6" />
            </button>
        </div>
        <div>
            {children}
        </div>
      </div>
       <style jsx>{`
        @keyframes fade-in-scale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in-scale {
          animation: fade-in-scale 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Modal;
