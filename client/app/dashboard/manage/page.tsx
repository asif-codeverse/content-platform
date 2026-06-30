"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  Pencil,
  Trash2,
  Upload,
} from "lucide-react";

import type { Article } from "@/types/article";

import {
  deleteArticle,
  getAdminArticles,
  publishArticle,
} from "@/services/admin.service";

import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";
import PageHeader from "@/components/ui/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

export default function ManagePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const [deleteId, setDeleteId] =
    useState<string | null>(null);

  const loadArticles = async () => {
    try {
      setLoading(true);

      const data = await getAdminArticles();

      setArticles(data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const handlePublish = async (id: string) => {
    await publishArticle(id);

    loadArticles();
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    await deleteArticle(deleteId);

    setDeleteId(null);

    loadArticles();
  };

  if (loading) {
    return (
      <LoadingSpinner text="Loading articles..." />
    );
  }

  if (!articles.length) {
    return (
      <>
        <PageHeader
          title="Manage Articles"
          description="Review and manage all articles."
        />

        <EmptyState
          title="No Articles Found"
          description="There are no articles available."
        />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Manage Articles"
        description="Review, edit and publish platform content."
      />

      <div className="space-y-6">
        {articles.map((article) => (
          <div
            key={article._id}
            className="
              rounded-[var(--radius-lg)]
              border
              border-[var(--border)]
              bg-[var(--surface)]
              p-6
              shadow-[var(--shadow-sm)]
              transition-all
              duration-300
              hover:shadow-[var(--shadow)]
            "
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2
                  className="
                    text-xl
                    font-semibold
                    tracking-tight
                  "
                >
                  {article.title}
                </h2>

                <p className="mt-2 text-sm text-[var(--muted)]">
                  ID: {article._id}
                </p>
              </div>

              <StatusBadge
                status={article.status}
              />
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {article.status === "DRAFT" && (
                <Button
                  onClick={() =>
                    handlePublish(article._id)
                  }
                >
                  <span className="flex items-center gap-2">
                    <Upload size={16} />
                    Publish
                  </span>
                </Button>
              )}

              <Link
                href={`/dashboard/edit/${article._id}`}
              >
                <Button variant="secondary">
                  <span className="flex items-center gap-2">
                    <Pencil size={16} />
                    Edit
                  </span>
                </Button>
              </Link>

              <Button
                variant="danger"
                onClick={() =>
                  setDeleteId(article._id)
                }
              >
                <span className="flex items-center gap-2">
                  <Trash2 size={16} />
                  Delete
                </span>
              </Button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={deleteId !== null}
        title="Delete Article"
        description="This action cannot be undone."
        confirmText="Delete"
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </>
  );
}