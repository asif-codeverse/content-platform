"use client";

import { useState } from "react";

import {
  createArticle
} from "@/services/admin.service";

export default function CreatePage() {

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

        await createArticle(
          title,
          content
        );

        alert(
          "Article Created"
        );

        setTitle("");
        setContent("");

      } catch (err) {

        console.error(err);

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

        <textarea
          value={content}
          onChange={(e) =>
            setContent(
              e.target.value
            )
          }
          placeholder="Content"
          className="border p-2 h-40"
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