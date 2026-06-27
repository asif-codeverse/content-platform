"use client";

import { Editor } from "@tiptap/react";
import { uploadImage } from "@/services/upload.service";

type Props = { editor: Editor; };

export default function ImageButton({ editor, }: Props) {

    const handleImage =
        async (e: React.ChangeEvent<HTMLInputElement>) => {

            const file = e.target.files?.[0];

            if (!file) return;

            const image = await uploadImage(file);

            editor
                .chain()
                .focus()
                .setImage({
                    src: image.url,
                })
                .run();
        };

    return (
        <label
            className="
            px-3
            py-1
            border
            rounded
            cursor-pointer
            hover:bg-gray-100
        "
        >
            Image
            <input
                hidden
                type="file"
                accept="image/*"
                onChange={handleImage}
            />

        </label>
    );
}