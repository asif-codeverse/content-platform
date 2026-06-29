"use client";

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

    const canSubmit = article.status === "DRAFT" || article.status === "REJECTED";

    const submitLabel = article.status === "REJECTED" ? "Submit Again" : "Submit";

    const canDelete =
        article.status === "DRAFT" ||
        article.status === "REJECTED";

    const formattedDate = new Date(article.createdAt).toLocaleDateString(
        "en-IN",
        { day: "numeric", month: "short", year: "numeric" }
    );

    const formattedUpdatedDate = new Date(article.updatedAt).toLocaleDateString(
        "en-IN",
        {
            day: "numeric", month: "short", year: "numeric",
        }
    );

    const isSubmittingThisArticle = submittingId === article._id;

    const isAnySubmissionInProgress = submittingId !== null;

    const reviewMessageFieldId = `review-message-${article._id}`;


    return (


        <div
            className="
        rounded-xl
        border
        bg-white
        p-6
        shadow-sm
        transition
        hover:shadow-md
    "
        >
            <div
                className="
        flex
        items-start
        justify-between
        gap-4
    "
            >

                <h2
                    className="
            text-2xl
            font-semibold
            tracking-tight
        "
                >
                    {article.title}
                </h2>

                <StatusBadge
                    status={article.status}
                />

            </div>

            <div
                className="
        mt-4
        flex
        flex-wrap
        gap-5
        text-sm
        text-gray-500
    "
            >

                <span>
                    👁 {article.views} Views
                </span>

                <span>
                    📅 {formattedDate}
                </span>

                <span>
                    ✏ {formattedUpdatedDate}
                </span>

            </div>


            <div
                className="
        mt-6
        flex
        flex-wrap
        gap-3
    "
            >

                <Button
                    type="button"
                    variant="primary"
                    disabled={!canSubmit || isSubmittingThisArticle}
                    onClick={() => editArticle(article._id)}
                >
                    Edit
                </Button>

                <Button
                    type="button"
                    variant="success"
                    disabled={!canSubmit || isAnySubmissionInProgress}
                    onClick={() => {
                        if (!canSubmit) return;

                        setActiveReviewArticleId(article._id);
                        setReviewMessage("");
                    }}
                >
                    {submitLabel}
                </Button>

                <Button
                    type="button"
                    variant="danger"
                    disabled={!canDelete}
                    onClick={() => handleDelete(article._id)}
                >
                    Delete
                </Button>

                {article.status === "PUBLISHED" ? (
                    <Button
                        type="button"
                        variant="indigo"
                        onClick={() => viewArticle(article.slug)}
                    >
                        View
                    </Button>
                ) : (
                    <Button
                        type="button"
                        variant="indigo"
                        disabled
                    >
                        View
                    </Button>
                )}

                {article.status === "PENDING" && (
                    <span className="self-center text-sm text-gray-500">
                        Waiting for Admin Review
                    </span>
                )}

            </div>

            {canSubmit && activeReviewArticleId === article._id && (
                <div
                    className="
            mt-6
            rounded-xl
            border
            bg-gray-50
            p-5
        "
                >
                    <label
                        htmlFor={reviewMessageFieldId}
                        className="font-semibold"
                    >
                        Message to Admin
                    </label>
                    <p className="text-sm text-gray-500 mt-1">
                        Optional. Include anything you want the reviewer to know.
                    </p>

                    <textarea
                        id={reviewMessageFieldId}
                        value={reviewMessage}
                        onChange={(e) => setReviewMessage(e.target.value)}
                        rows={4}
                        placeholder="Write a message..."
                        className="w-full border rounded p-3 mt-3"
                    ></textarea>

                    <div className="flex gap-3 mt-4">
                        <Button
                            type="button"
                            variant="secondary"
                            disabled={isAnySubmissionInProgress}
                            onClick={closeReview}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="button"
                            variant="success"
                            disabled={isAnySubmissionInProgress}
                            onClick={() => handleSubmit(article._id)}
                        >
                            {submitLabel}
                        </Button>
                    </div>
                </div>
            )}
        </div>

    );

}