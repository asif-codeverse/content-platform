"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import RichTextEditor from "@/components/editor/RichTextEditor";

import { createArticle } from "@/services/admin.service";

import Button from "@/components/ui/Button";
import Toast from "@/components/ui/Toast";
import PageHeader from "@/components/ui/PageHeader";

export default function CreatePage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      await createArticle(title, content);

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
    <div className="space-y-8">
      <PageHeader
        title="Create Article"
        description="Write and publish a new article for your audience."
      />

      <Toast
        message={message}
        type="success"
        onClose={() => setMessage("")}
      />

      <Toast
        message={error}
        type="error"
        onClose={() => setError("")}
      />

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-8 shadow-[var(--shadow-sm)]"
      >
        <div className="space-y-2">
          <label
            htmlFor="title"
            className="text-sm font-medium"
          >
            Article Title
          </label>

          <input
            id="title"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            placeholder="Enter article title..."
            className="w-full rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </div>

        <div className="space-y-2">
          <label
            className="text-sm font-medium"
          >
            Content
          </label>

          <div
            className="overflow-hidden rounded-[var(--radius)] border border-[var(--border)]"
          >
            <RichTextEditor
              value={content}
              onChange={setContent}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            loading={loading}
          >
            Create Article
          </Button>
        </div>
      </form>
    </div>
  );
}