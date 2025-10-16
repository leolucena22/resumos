
'use client'
import React from 'react';
import { Send } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

interface SubmissionButtonProps {
  submissionUrl: string;
  congressSlug: string;
  colors: {
    accent: string;
  };
  getContrastingTextColor: (hexColor: string) => string;
}

const SubmissionButton: React.FC<SubmissionButtonProps> = ({ submissionUrl, congressSlug, colors, getContrastingTextColor }) => {

  const handleClick = async () => {
    try {
      const { error } = await supabase.rpc('increment_click_count', { slug: congressSlug });
      if (error) {
        console.error('Error incrementing click count:', error);
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
    }
  };

  return (
    <a
      href={submissionUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="inline-flex items-center justify-center gap-3 text-white font-bold text-xl px-12 py-5 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300"
      style={{
        backgroundColor: colors.accent,
        color: getContrastingTextColor(colors.accent),
      }}
    >
      <Send className="w-6 h-6" />
      <span>Submeter Trabalho Agora</span>
    </a>
  );
};

export default SubmissionButton;
