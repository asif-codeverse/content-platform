"use client";

import {
  use,
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import RichTextEditor from "@/components/editor/RichTextEditor";

import {
  getMyArticleById,
  updateMyArticle,
} from "@/services/article.service";

import Button from "@/components/ui/Button";
import Toast from "@/components/ui/Toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import PageHeader from "@/components/ui/PageHeader";

export default function EditPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const router = useRouter();

  const { id } = use(params);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [pageLoading, setPageLoading] =
    useState(true);

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadArticle = async () => {
      try {
        const result =
          await getMyArticleById(id);

        setTitle(result.data.title);
        setContent(result.data.content);
      } catch {
        setError(
          "Failed to load article."
        );
      } finally {
        setPageLoading(false);
      }
    };

    loadArticle();
  }, [id]);

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      await updateMyArticle(
        id,
        title,
        content
      );

      setMessage(
        "Article updated successfully."
      );

      setTimeout(() => {
        router.push("/dashboard/my");
      }, 1200);
    } catch {
      setError(
        "Failed to update article."
      );
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <LoadingSpinner text="Loading article..." />
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Edit Article"
        description="Update your article before publishing."
      />

      <Toast
        message={message}
        type="success"
        onClose={() =>
          setMessage("")
        }
      />

      <Toast
        message={error}
        type="error"
        onClose={() =>
          setError("")
        }
      />

      <form
        onSubmit={handleSubmit}
        className="
          space-y-6
          rounded-[var(--radius-lg)]
          border
          border-[var(--border)]
          bg-[var(--surface)]
          p-8
          shadow-[var(--shadow-sm)]
        "
      >
        <div className="space-y-2">
          <label
            htmlFor="title"
            className="
              text-sm
              font-medium
            "
          >
            Article Title
          </label>

          <input
            id="title"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            placeholder="Article title..."
            className="
              w-full
              rounded-[var(--radius)]
              border
              border-[var(--border)]
              bg-[var(--surface)]
              px-4
              py-3
              outline-none
              transition
              focus:border-blue-500
              focus:ring-4
              focus:ring-blue-100
            "
          />
        </div>

        <div className="space-y-2">
          <label
            className="
              text-sm
              font-medium
            "
          >
            Content
          </label>

          <div
            className="
              overflow-hidden
              rounded-[var(--radius)]
              border
              border-[var(--border)]
            "
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
            Update Article
          </Button>
        </div>
      </form>
    </div>
  );
}