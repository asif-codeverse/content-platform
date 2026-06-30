"use client";

import { EditorContent, useEditor } from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import HorizontalRule from "@tiptap/extension-horizontal-rule";

import EditorToolbar from "./EditorToolbar";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function RichTextEditor({
  value,
  onChange,
}: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
      HorizontalRule,
      Image,
    ],

    content: value,

    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },

    editorProps: {
      attributes: {
        class: "ProseMirror prose prose-lg max-w-none min-h-[500px] px-8 py-6 focus:outline-none",
      },
    },

    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)] transition-all duration-200 focus-within:border-blue-500 focus-within:shadow-[var(--shadow)]">
      <EditorToolbar editor={editor} />

      <div className="bg-[var(--surface)]">
        <EditorContent editor={editor} />
      </div>

      <div className="flex items-center justify-between border-t border-[var(--border)] bg-stone-50 px-6 py-3 text-xs text-[var(--muted)]">
        <span>
          Supports headings, lists, links, images and code blocks.
        </span>

        <span>
          TipTap Editor
        </span>
      </div>
    </div>
  );
}