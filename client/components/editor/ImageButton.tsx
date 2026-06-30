"use client";

import { useState } from "react";
import { Editor } from "@tiptap/react";
import { ImagePlus, Loader2 } from "lucide-react";

import { uploadImage } from "@/services/upload.service";

type Props = {
  editor: Editor;
};

export default function ImageButton({
  editor,
}: Props) {
  const [uploading, setUploading] =
    useState(false);

  const handleImage = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      setUploading(true);

      const image =
        await uploadImage(file);

      editor
        .chain()
        .focus()
        .setImage({
          src: image.url,
        })
        .run();
    } catch (error) {
      console.error(
        "Image upload failed:",
        error
      );

      alert(
        "Failed to upload image."
      );
    } finally {
      setUploading(false);

      e.target.value = "";
    }
  };

  return (
    <label
      className={`flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-white px-4 text-sm font-medium text-stone-700 transition-all hover:bg-stone-100 ${uploading ? "cursor-not-allowed opacity-60" : ""}`}
    >
      {uploading ? (
        <>
          <Loader2
            size={16}
            className="animate-spin"
          />
          Uploading...
        </>
      ) : (
        <>
          <ImagePlus size={16} />
          Image
        </>
      )}

      <input
        hidden
        type="file"
        accept="image/*"
        disabled={uploading}
        onChange={handleImage}
      />
    </label>
  );
}