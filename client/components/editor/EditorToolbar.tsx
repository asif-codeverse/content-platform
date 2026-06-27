"use client";

import { Editor } from "@tiptap/react";
import ImageButton from "./ImageButton";

type Props = { editor: Editor; };

export default function EditorToolbar({
    editor,
}: Props) {
    if (!editor) return null;

    return (
        <div className="border-b p-2 flex flex-wrap gap-2">
            <button
                className="px-3 py-1 border rounded hover:bg-gray-100"
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
            >
                <strong>B</strong>
            </button>

            <button
                className="px-3 py-1 border rounded hover:bg-gray-100"
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
            >
                <em>I</em>
            </button>

            <button
                className="px-3 py-1 border rounded hover:bg-gray-100"
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({
                    level: 1,
                }).run()}
            >
                H1
            </button>

            <button
                className="px-3 py-1 border rounded hover:bg-gray-100"
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({
                    level: 2,
                }).run()}
            >
                H2
            </button>

            <button
                className="px-3 py-1 border rounded hover:bg-gray-100"
                type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
                • List
            </button>

            <button
                className="px-3 py-1 border rounded hover:bg-gray-100"
                type="button"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
            >
                1. List
            </button>

            <button
                className="px-3 py-1 border rounded hover:bg-gray-100"
                type="button"
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            >
                {"</>"}
            </button>

            <button
                className="px-3 py-1 border rounded hover:bg-gray-100"
                type="button"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
            >
                Quote
            </button>

            <ImageButton
                editor={editor}
            />

        </div>
    );
}