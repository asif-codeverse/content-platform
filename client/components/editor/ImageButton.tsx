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
      className={`
    flex
    h-9
    items-center
    justify-center
    gap-2
    rounded-[var(--radius-sm)]
    border
    border-[var(--border)]
    px-3
    text-sm
    font-medium
    transition-all
    duration-200
    ${uploading
          ? "cursor-not-allowed bg-[var(--surface-secondary)] text-[var(--muted-foreground)] opacity-70"
          : "cursor-pointer bg-transparent text-[var(--muted-foreground)] hover:bg-[var(--surface-secondary)] hover:text-[var(--foreground)]"
        }
  `}
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