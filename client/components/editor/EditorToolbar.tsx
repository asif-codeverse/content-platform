"use client";

import { Editor } from "@tiptap/react";
import ImageButton from "./ImageButton";

type Props = {
    editor: Editor;
};

export default function EditorToolbar({
    editor,
}: Props) {

    if (!editor) return null;

    const buttonClass = (
        active: boolean
    ) =>
        active
            ? "px-3 py-1 border rounded bg-blue-600 text-white transition-colors duration-150"
            : "px-3 py-1 border rounded transition-colors duration-150 hover:bg-gray-100";

    return (

        <div
            className="
                sticky
                top-0
                z-10
                border-b
                bg-gray-50
                p-3
                flex
                flex-wrap
                gap-2
            "
        >

            <button
                type="button"
                className={buttonClass(
                    editor.isActive("bold")
                )}
                onClick={() =>
                    editor
                        .chain()
                        .focus()
                        .toggleBold()
                        .run()
                }
            >
                <strong>B</strong>
            </button>

            <button
                type="button"
                className={buttonClass(
                    editor.isActive("italic")
                )}
                onClick={() =>
                    editor
                        .chain()
                        .focus()
                        .toggleItalic()
                        .run()
                }
            >
                <em>I</em>
            </button>

            <button
                type="button"
                className={buttonClass(
                    editor.isActive("underline")
                )}
                onClick={() =>
                    editor
                        .chain()
                        .focus()
                        .toggleUnderline()
                        .run()
                }
            >
                <u>U</u>
            </button>

            <button
                type="button"
                className={buttonClass(
                    editor.isActive(
                        "heading",
                        {
                            level: 1,
                        }
                    )
                )}
                onClick={() =>
                    editor
                        .chain()
                        .focus()
                        .toggleHeading({
                            level: 1,
                        })
                        .run()
                }
            >
                H1
            </button>

            <button
                type="button"
                className={buttonClass(
                    editor.isActive(
                        "heading",
                        {
                            level: 2,
                        }
                    )
                )}
                onClick={() =>
                    editor
                        .chain()
                        .focus()
                        .toggleHeading({
                            level: 2,
                        })
                        .run()
                }
            >
                H2
            </button>

            <button
                type="button"
                className={buttonClass(
                    editor.isActive("bulletList")
                )}
                onClick={() =>
                    editor
                        .chain()
                        .focus()
                        .toggleBulletList()
                        .run()
                }
            >
                • List
            </button>

            <button
                type="button"
                className={buttonClass(
                    editor.isActive("orderedList")
                )}
                onClick={() =>
                    editor
                        .chain()
                        .focus()
                        .toggleOrderedList()
                        .run()
                }
            >
                1. List
            </button>

            <button
                type="button"
                className={buttonClass(
                    editor.isActive("codeBlock")
                )}
                onClick={() =>
                    editor
                        .chain()
                        .focus()
                        .toggleCodeBlock()
                        .run()
                }
            >
                {"</>"}
            </button>

            <button
                type="button"
                className={buttonClass(
                    editor.isActive("blockquote")
                )}
                onClick={() =>
                    editor
                        .chain()
                        .focus()
                        .toggleBlockquote()
                        .run()
                }
            >
                Quote
            </button>

            <button
                type="button"
                className="
                    px-3
                    py-1
                    border
                    rounded
                    hover:bg-gray-100
                "
                onClick={() =>
                    editor
                        .chain()
                        .focus()
                        .setHorizontalRule()
                        .run()
                }
            >
                HR
            </button>

            <button
                type="button"
                className={buttonClass(
                    editor.isActive("link")
                )}
                onClick={() => {

                    let url = prompt("Enter URL");

                    if (!url) return;

                    url = url.trim();

                    if (
                        !url.startsWith("http://") &&
                        !url.startsWith("https://")
                    ) {
                        url = `https://${url}`;
                    }

                    editor
                        .chain()
                        .focus()
                        .setLink({
                            href: url,
                        })
                        .run();

                }}
            >
                Link
            </button>

            <button
                type="button"
                className="
                    px-3
                    py-1
                    border
                    rounded
                    hover:bg-gray-100
                "
                onClick={() =>
                    editor
                        .chain()
                        .focus()
                        .unsetLink()
                        .run()
                }
            >
                Remove Link
            </button>

            <ImageButton
                editor={editor}
            />

        </div>

    );

}