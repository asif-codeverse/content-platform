"use client";

import { useState } from "react";
import RichTextEditor from "@/components/editor/RichTextEditor";
import { createArticle } from "@/services/admin.service";
import { useRouter } from "next/navigation";

export default function CreatePage() {

  const router =
    useRouter();

  const [title, setTitle] =
    useState("");

  const [content, setContent] =
    useState("");

  const handleSubmit =
    async (
      e: React.FormEvent
    ) => {

      e.preventDefault();

      try {

        console.log(title);
        console.log(content);
        await createArticle(
          title,
          content
        );

        alert(
          "Article Created"
        );
        router.push(
          "/dashboard/my"
        );

        setTitle("");
        setContent("");

      } catch (err) {

        // console.error(err);

        alert(
          "Creation Failed"
        );
      }
    };

  return (
    <main className="p-8">

      <h1 className="text-3xl font-bold mb-6">
        Create Article
      </h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >

        <input
          value={title}
          onChange={(e) =>
            setTitle(
              e.target.value
            )
          }
          placeholder="Title"
          className="border p-2"
        />

        <RichTextEditor
          value={content}
          onChange={setContent}
        />

        <button
          className="border p-2"
        >
          Create
        </button>

      </form>

    </main>
  );
}