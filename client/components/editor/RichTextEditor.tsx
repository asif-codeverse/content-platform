"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import EditorToolbar from "./EditorToolbar";
import Underline from "@tiptap/extension-underline";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Link from "@tiptap/extension-link";

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
            Underline,
            Link,
            HorizontalRule,
            Image,
        ],
        content: value,
        onUpdate({ editor, }) {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class:
                    "prose prose-lg max-w-none min-h-[400px] p-6 focus:outline-none",
            },
        },
        immediatelyRender: false,
    });

    if (!editor) return null;

    return (
        <div className=" border
                        rounded-lg
                        shadow-sm
                        overflow-hidden
                        bg-white"
        >
            <EditorToolbar
                editor={editor}
            />

            <EditorContent
                editor={editor}
            />
        </div>
    );
}