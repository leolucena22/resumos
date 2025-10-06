'use client';

import { useEffect, useState, useCallback, FormEvent, ReactNode } from 'react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Strike from '@tiptap/extension-strike';
import Highlight from '@tiptap/extension-highlight';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Link from '@tiptap/extension-link';
import EmojiPicker from 'emoji-picker-react';
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, 
  List, ListOrdered, Palette, Highlighter, Link2, Smile
} from 'lucide-react';
import Modal from './Modal';

const ToolbarButton = ({ onClick, children, isActive = false }: { onClick: () => void, children: ReactNode, isActive?: boolean }) => (
  <button
    type="button"
    onClick={onClick}
    className={`p-2 rounded-lg transition-colors ${isActive ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
  >
    {children}
  </button>
);

const ColorPicker = ({ onInput, value, children }: { onInput: (e: FormEvent<HTMLInputElement>) => void, value: string, children: ReactNode }) => (
  <div className="relative">
    <input
      type="color"
      onInput={onInput}
      value={value}
      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
    />
    {children}
  </div>
);

interface EditorToolbarProps {
  editor: Editor;
  openLinkModal: () => void;
  toggleEmojiPicker: () => void;
}

const EditorToolbar = ({ editor, openLinkModal, toggleEmojiPicker }: EditorToolbarProps) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="border border-gray-200 border-b-0 rounded-t-lg p-2 flex flex-wrap items-center gap-1 bg-white text-black">
      <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')}>
        <Bold className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')}>
        <Italic className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')}>
        <UnderlineIcon className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')}>
        <Strikethrough className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton onClick={openLinkModal} isActive={editor.isActive('link')}>
        <Link2 className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')}>
        <List className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')}>
        <ListOrdered className="w-4 h-4" />
      </ToolbarButton>
      <ColorPicker
        onInput={(e) => editor.chain().focus().setColor((e.target as HTMLInputElement).value).run()}
        value={editor.getAttributes('textStyle').color || '#000000'}
      >
        <ToolbarButton onClick={() => {}} isActive={!!editor.getAttributes('textStyle').color}>
          <Palette className="w-4 h-4" />
        </ToolbarButton>
      </ColorPicker>
      <ColorPicker
        onInput={(e) => editor.chain().focus().toggleHighlight({ color: (e.target as HTMLInputElement).value }).run()}
        value={editor.getAttributes('highlight').color || '#ffffff'}
      >
        <ToolbarButton onClick={() => {}} isActive={!!editor.getAttributes('highlight').color}>
          <Highlighter className="w-4 h-4" />
        </ToolbarButton>
      </ColorPicker>
      <ToolbarButton onClick={toggleEmojiPicker}>
        <Smile className="w-4 h-4" />
      </ToolbarButton>
    </div>
  );
};

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  isEditing: boolean;
}

const TiptapEditor = ({ content, onChange, isEditing }: TiptapEditorProps) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      Strike,
      Highlight.configure({ multicolor: true }),
      TextStyle,
      Color,
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editable: isEditing,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl m-5 focus:outline-none text-black prose-a:text-blue-600 prose-a:underline',
      },
    },
  });

  useEffect(() => {
    if (editor) {
      editor.setEditable(isEditing);
    }
  }, [isEditing, editor]);

  const openLinkModal = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href;
    setLinkUrl(previousUrl || '');
    setIsLinkModalOpen(true);
  }, [editor]);

  const closeLinkModal = () => {
    setIsLinkModalOpen(false);
    setLinkUrl('');
  };

  const handleSetLink = () => {
    if (!editor) return;

    if (linkUrl === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
    }
    closeLinkModal();
  };

  const handleEmojiClick = (emojiObject: { emoji: string }) => {
    if (editor) {
      editor.chain().focus().insertContent(emojiObject.emoji).run();
    }
    setShowEmojiPicker(false);
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="w-full relative">
      {isEditing && <EditorToolbar editor={editor} openLinkModal={openLinkModal} toggleEmojiPicker={() => setShowEmojiPicker(!showEmojiPicker)} />}
      <div className={`tiptap-container border border-gray-200 ${isEditing ? 'rounded-b-lg' : 'rounded-lg'} ${!isEditing ? 'bg-gray-50 p-4' : ''}`}>
        <EditorContent editor={editor} />
      </div>
      {showEmojiPicker && isEditing && (
        <div className="absolute z-10 top-12">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}
      <Modal isOpen={isLinkModalOpen} onClose={closeLinkModal} title="Adicionar / Editar Hiperlink">
        <div className="flex flex-col gap-4">
            <input 
                type="url" 
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://exemplo.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            />
            <div className="flex justify-end gap-3">
                <button onClick={closeLinkModal} className="px-6 py-2 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors">
                    Cancelar
                </button>
                <button onClick={handleSetLink} className="px-6 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                    Salvar
                </button>
            </div>
        </div>
      </Modal>
    </div>
  );
};

export default TiptapEditor;