"use client";

import {
  Eye,
  CalendarDays,
  Pencil,
  Send,
  Trash2,
  ExternalLink,
} from "lucide-react";

import StatusBadge from "@/components/StatusBadge";
import Button from "@/components/ui/Button";
import type { Article } from "@/types/article";

type Props = {
  article: Article;
  submittingId: string | null;
  activeReviewArticleId: string | null;
  reviewMessage: string;
  setReviewMessage: React.Dispatch<
    React.SetStateAction<string>
  >;
  setActiveReviewArticleId: React.Dispatch<
    React.SetStateAction<string | null>
  >;
  handleSubmit: (id: string) => void;
  handleDelete: (id: string) => void;
  editArticle: (id: string) => void;
  viewArticle: (slug: string) => void;
  closeReview: () => void;
};

export default function ArticleCard({
  article,
  submittingId,
  activeReviewArticleId,
  reviewMessage,
  setReviewMessage,
  setActiveReviewArticleId,
  handleSubmit,
  handleDelete,
  editArticle,
  viewArticle,
  closeReview,
}: Props) {
  const canSubmit =
    article.status === "DRAFT" ||
    article.status === "REJECTED";

  const canDelete =
    article.status === "DRAFT" ||
    article.status === "REJECTED";

  const submitLabel =
    article.status === "REJECTED"
      ? "Submit Again"
      : "Submit";

  const formattedCreated = new Date(
    article.createdAt
  ).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const formattedUpdated = new Date(
    article.updatedAt
  ).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const isSubmitting =
    submittingId === article._id;

  const isBusy =
    submittingId !== null;

  const reviewFieldId =
    `review-message-${article._id}`;

  return (
    <article
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
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            {article.title}
          </h2>

          <div
            className="
              mt-4
              flex
              flex-wrap
              items-center
              gap-5
              text-sm
              text-[var(--muted)]
            "
          >
            <span className="flex items-center gap-2">
              <Eye size={16} />
              {article.views} Views
            </span>

            <span className="flex items-center gap-2">
              <CalendarDays size={16} />
              Created {formattedCreated}
            </span>

            <span className="flex items-center gap-2">
              <Pencil size={16} />
              Updated {formattedUpdated}
            </span>
          </div>
        </div>

        <StatusBadge status={article.status} />
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button
          variant="primary"
          disabled={!canSubmit || isSubmitting}
          onClick={() => editArticle(article._id)}
        >
          <span className="flex items-center gap-2">
            <Pencil size={16} />
            Edit
          </span>
        </Button>

        <Button
          variant="success"
          disabled={!canSubmit || isBusy}
          onClick={() => {
            if (!canSubmit) return;

            setActiveReviewArticleId(article._id);
            setReviewMessage("");
          }}
        >
          <span className="flex items-center gap-2">
            <Send size={16} />
            {submitLabel}
          </span>
        </Button>

        <Button
          variant="danger"
          disabled={!canDelete}
          onClick={() => handleDelete(article._id)}
        >
          <span className="flex items-center gap-2">
            <Trash2 size={16} />
            Delete
          </span>
        </Button>

        <Button
          variant="indigo"
          disabled={article.status !== "PUBLISHED"}
          onClick={() =>
            viewArticle(article.slug)
          }
        >
          <span className="flex items-center gap-2">
            <ExternalLink size={16} />
            View
          </span>
        </Button>
      </div>

      {article.status === "PENDING" && (
        <p
          className="
            mt-5
            text-sm
            font-medium
            text-[var(--muted)]
          "
        >
          Waiting for admin review.
        </p>
      )}

      {canSubmit &&
        activeReviewArticleId === article._id && (
          <div
            className="
              mt-8
              rounded-[var(--radius)]
              border
              border-[var(--border)]
              bg-[var(--surface-secondary)]
              p-5
            "
          >
            <label
              htmlFor={reviewFieldId}
              className="font-semibold"
            >
              Message to Admin
            </label>

            <p
              className="
                mt-2
                text-sm
                text-[var(--muted)]
              "
            >
              Optional. Include anything the reviewer
              should know before reviewing your article.
            </p>

            <textarea
              id={reviewFieldId}
              value={reviewMessage}
              onChange={(e) =>
                setReviewMessage(e.target.value)
              }
              rows={4}
              placeholder="Write your message..."
              className="
                mt-4
                w-full
                rounded-[var(--radius)]
                border
                border-[var(--border)]
                bg-[var(--surface)]
                p-3
                outline-none
                transition
                focus:border-blue-500
                focus:ring-4
                focus:ring-blue-100
              "
            />

            <div className="mt-5 flex gap-3">
              <Button
                variant="secondary"
                disabled={isBusy}
                onClick={closeReview}
              >
                Cancel
              </Button>

              <Button
                variant="success"
                disabled={isBusy}
                onClick={() =>
                  handleSubmit(article._id)
                }
              >
                {submitLabel}
              </Button>
            </div>
          </div>
        )}
    </article>
  );
}