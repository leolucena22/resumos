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
import TextAlign from '@tiptap/extension-text-align';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';
import EmojiPicker from 'emoji-picker-react';
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, 
  List, ListOrdered, Palette, Highlighter, Link2, Smile,
  AlignCenter, AlignLeft, AlignRight, AlignJustify
} from 'lucide-react';
import Modal from './Modal';
import TableMenu from './TableMenu';

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
      <ToolbarButton onClick={() => editor.chain().focus().toggleTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })}>
        <AlignLeft className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })}>
        <AlignCenter className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })}>
        <AlignRight className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleTextAlign('justify').run()} isActive={editor.isActive({ textAlign: 'justify' })}>
        <AlignJustify className="w-4 h-4" />
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
      <TableMenu editor={editor} />
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
        bulletList: {
          keepMarks: true,
          keepAttributes: false, // TODO: Making this true would be better
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false, // TODO: Making this true would be better
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
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
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
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
        <div className="space-y-6 p-2">
          <div>
            <label htmlFor="link-url" className="block text-sm font-medium text-gray-700 mb-2">
              URL do Link
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Link2 className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="url"
                id="link-url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://exemplo.com"
                className="block w-full rounded-md text-gray-500 border-gray-300 pl-10 shadow-sm focus:outline-none sm:text-sm py-3"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={closeLinkModal}
              className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSetLink}
              className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Salvar
            </button>
          </div>
        </div>
      </Modal>
      <style jsx global>{`
        .ProseMirror a {
          color: #2563eb !important;
          text-decoration: underline !important;
        }
      `}</style>
    </div>
  );
};

export default TiptapEditor;