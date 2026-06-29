"use client";

import { useState } from "react";
import RichTextEditor from "@/components/editor/RichTextEditor";
import { createArticle } from "@/services/admin.service";
import { useRouter } from "next/navigation";
import Toast from "@/components/ui/Toast";
import Button from "@/components/ui/Button";

export default function CreatePage() {

  const router =
    useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      await createArticle(
        title,
        content
      );

      setMessage("Article created successfully.");

      setTitle("");
      setContent("");

      setTimeout(() => {
        router.push("/dashboard/my");
      }, 1200);

    } catch {
      setError("Failed to create article.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-8">

      <h1 className="text-3xl font-bold mb-6">
        Create Article
      </h1>

      <Toast message={message}
        type="success"
        onClose={() => setMessage("")}
      />

      <Toast message={error}
        type="error"
        onClose={() => setError("")}
      />

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

        <RichTextEditor value={content} onChange={setContent} />

        <Button
          type="submit"
          loading={loading}
        >
          Create Article
        </Button>

      </form>

    </main>
  );
}