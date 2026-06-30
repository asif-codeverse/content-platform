"use client";

import { Editor } from "@tiptap/react";
import {
    Bold,
    Italic,
    UnderlineIcon,
    Heading1,
    Heading2,
    List,
    ListOrdered,
    Quote,
    Code2,
    Minus,
    Link2,
    Unlink,
} from "lucide-react";

import ImageButton from "./ImageButton";

type Props = {
    editor: Editor;
};

function Divider() {
    return (
        <div className="mx-1 h-6 w-px bg-[var(--border)]" />
    );
}

export default function EditorToolbar({ editor }: Props) {
    if (!editor) return null;

    const buttonClass = (active: boolean) =>
        `flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] transition-all duration-200 ${active
            ? "bg-[var(--foreground)] text-[var(--background)] shadow-sm"
            : "bg-transparent text-[var(--muted-foreground)] hover:bg-[var(--surface-secondary)] hover:text-[var(--foreground)]"
        }`;

    return (
        <div
            className="
                sticky
                top-0
                z-20
                flex
                flex-wrap
                items-center
                gap-1.5
                border-b
                border-[var(--border)]
                bg-[var(--background)]/80
                backdrop-blur-md
                p-3
                md:px-4
            "
        >
            {/* Text */}
            <div className="flex items-center gap-1">
                <button
                    type="button"
                    title="Bold"
                    className={buttonClass(editor.isActive("bold"))}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                >
                    <Bold size={16} strokeWidth={2.5} />
                </button>

                <button
                    type="button"
                    title="Italic"
                    className={buttonClass(editor.isActive("italic"))}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                >
                    <Italic size={16} strokeWidth={2.5} />
                </button>

                <button
                    type="button"
                    title="Underline"
                    className={buttonClass(editor.isActive("underline"))}
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                >
                    <UnderlineIcon size={16} strokeWidth={2.5} />
                </button>
            </div>

            <Divider />

            {/* Headings */}
            <div className="flex items-center gap-1">
                <button
                    type="button"
                    title="Heading 1"
                    className={buttonClass(editor.isActive("heading", { level: 1 }))}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                >
                    <Heading1 size={16} strokeWidth={2.5} />
                </button>

                <button
                    type="button"
                    title="Heading 2"
                    className={buttonClass(editor.isActive("heading", { level: 2 }))}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                >
                    <Heading2 size={16} strokeWidth={2.5} />
                </button>
            </div>

            <Divider />

            {/* Lists */}
            <div className="flex items-center gap-1">
                <button
                    type="button"
                    title="Bullet List"
                    className={buttonClass(editor.isActive("bulletList"))}
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                >
                    <List size={16} strokeWidth={2.5} />
                </button>

                <button
                    type="button"
                    title="Ordered List"
                    className={buttonClass(editor.isActive("orderedList"))}
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                >
                    <ListOrdered size={16} strokeWidth={2.5} />
                </button>
            </div>

            <Divider />

            {/* Content */}
            <div className="flex items-center gap-1">
                <button
                    type="button"
                    title="Quote"
                    className={buttonClass(editor.isActive("blockquote"))}
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                >
                    <Quote size={16} strokeWidth={2.5} />
                </button>

                <button
                    type="button"
                    title="Code Block"
                    className={buttonClass(editor.isActive("codeBlock"))}
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                >
                    <Code2 size={16} strokeWidth={2.5} />
                </button>

                <button
                    type="button"
                    title="Horizontal Rule"
                    className={buttonClass(false)}
                    onClick={() => editor.chain().focus().setHorizontalRule().run()}
                >
                    <Minus size={16} strokeWidth={2.5} />
                </button>
            </div>

            <Divider />

            {/* Links */}
            <div className="flex items-center gap-1">
                <button
                    type="button"
                    title="Insert Link"
                    className={buttonClass(editor.isActive("link"))}
                    onClick={() => {
                        let url = prompt("Enter URL");
                        if (!url) return;
                        url = url.trim();
                        if (!url.startsWith("http://") && !url.startsWith("https://")) {
                            url = `https://${url}`;
                        }
                        editor.chain().focus().setLink({ href: url }).run();
                    }}
                >
                    <Link2 size={16} strokeWidth={2.5} />
                </button>

                <button
                    type="button"
                    title="Remove Link"
                    className={buttonClass(false)}
                    onClick={() => editor.chain().focus().unsetLink().run()}
                >
                    <Unlink size={16} strokeWidth={2.5} />
                </button>
            </div>

            <Divider />

            <div className="flex items-center">
                <ImageButton editor={editor} />
            </div>
        </div>
    );
}