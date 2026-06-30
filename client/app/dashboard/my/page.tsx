"use client";

import {
  getMyArticles,
  submitArticle,
  deleteMyArticle,
} from "@/services/article.service";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { FileText } from "lucide-react";

import type { Article } from "@/types/article";

import EmptyState from "@/components/ui/EmptyState";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Toast from "@/components/ui/Toast";
import PageHeader from "@/components/ui/PageHeader";
import ArticleCard from "@/components/articles/ArticleCard";

export default function MyArticlesPage() {
  const router = useRouter();

  const [articles, setArticles] = useState<Article[]>([]);

  const [loading, setLoading] = useState(true);

  const [submittingId, setSubmittingId] =
    useState<string | null>(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [activeReviewArticleId, setActiveReviewArticleId] =
    useState<string | null>(null);

  const [reviewMessage, setReviewMessage] =
    useState("");

  const messageTimeoutRef =
    useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const data = await getMyArticles();

        setArticles(data);
      } catch {
        setError("Failed to load your articles.");
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

  useEffect(() => {
    return () => {
      if (messageTimeoutRef.current) {
        clearTimeout(messageTimeoutRef.current);
      }
    };
  }, []);

  const closeReview = () => {
    setActiveReviewArticleId(null);
    setReviewMessage("");
  };

  const editArticle = (id: string) => {
    router.push(`/dashboard/edit/${id}`);
  };

  const viewArticle = (slug: string) => {
    router.push(`/articles/${slug}`);
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Delete this article?"
    );

    if (!confirmed) return;

    try {
      await deleteMyArticle(id);

      setArticles((prev) =>
        prev.filter(
          (article) => article._id !== id
        )
      );

      setMessage(
        "Article deleted successfully."
      );
    } catch (err) {
      const apiError = err as {
        response?: {
          data?: {
            message?: string;
          };
        };
      };

      setError(
        apiError.response?.data?.message ??
          "Failed to delete article."
      );
    }
  };

  const handleSubmit = async (id: string) => {
    setError("");
    setMessage("");
    setSubmittingId(id);

    try {
      await submitArticle(id, reviewMessage);

      setArticles((prev) =>
        prev.map((article) =>
          article._id === id
            ? {
                ...article,
                status: "PENDING",
              }
            : article
        )
      );

      setMessage(
        "Article submitted for review successfully."
      );

      closeReview();

      if (messageTimeoutRef.current) {
        clearTimeout(messageTimeoutRef.current);
      }

      messageTimeoutRef.current =
        setTimeout(() => {
          setMessage("");
        }, 3000);
    } catch (err) {
      const apiError = err as {
        response?: {
          data?: {
            message?: string;
          };
        };
      };

      setError(
        apiError.response?.data?.message ??
          "Failed to submit article."
      );

      if (
        process.env.NODE_ENV === "development"
      ) {
        console.error(err);
      }
    } finally {
      setSubmittingId(null);
    }
  };

  if (loading) {
    return (
      <LoadingSpinner text="Loading your articles..." />
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="My Articles"
        description="Manage your drafts, submissions and published articles."
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

      {articles.length === 0 ? (
        <EmptyState
          icon={<FileText size={38} />}
          title="No articles yet"
          description="Create your first article to start publishing."
        />
      ) : (
        <div className="space-y-6">
          {articles.map((article) => (
            <ArticleCard
              key={article._id}
              article={article}
              submittingId={submittingId}
              activeReviewArticleId={
                activeReviewArticleId
              }
              reviewMessage={reviewMessage}
              setReviewMessage={
                setReviewMessage
              }
              setActiveReviewArticleId={
                setActiveReviewArticleId
              }
              handleSubmit={handleSubmit}
              handleDelete={handleDelete}
              editArticle={editArticle}
              viewArticle={viewArticle}
              closeReview={closeReview}
            />
          ))}
        </div>
      )}
    </div>
  );
}