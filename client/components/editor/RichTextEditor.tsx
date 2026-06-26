"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import EditorToolbar from "./EditorToolbar";

type Props = {
    value: string;
    onChange: (
        value: string
    ) => void;
};

export default function RichTextEditor({
    value, onChange,
}: Props) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Image,
        ],
        content: value,
        onUpdate({ editor, }) {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class:
                    "max-w-none min-h-[300px] p-4 focus:outline-none",
            },
        },
        immediatelyRender: false,
    });

    if (!editor) return null;

    return (
        <div className="border rounded overflow-hidden">
            <EditorToolbar
                editor={editor}
            />

            <EditorContent
                editor={editor}
            />
        </div>
    );
}