import { sendMail } from "./email.service.js";
import { Article } from "../modules/articles/article.model.js";

export const sendArticleSubmittedNotification =
    async ({
        admins,
        article,
        message,
    }) => {

        const html = `

        <h2>New Article Submitted</h2>

        <p>
            A new article has been submitted for review.
        </p>

        <hr/>

        <p>
            <strong>Title:</strong>
            ${article.title}
        </p>

        <p>
            <strong>Author:</strong>
            ${article.author.name}
        </p>

        <p>
            <strong>Email:</strong>
            ${article.author.email}
        </p>

        <p>
            <strong>Author Message:</strong>
        </p>

        <blockquote>
            ${message.trim()
            || "No additional message was provided."
            }
        </blockquote>

        <hr/>

        <p>
            Please review this article from the Admin Dashboard.
        </p>

    `;

        for (const admin of admins) {

            await sendMail({

                to: admin.email,

                subject:
                    "New Article Waiting For Review",

                html,

            });

        }

    };

export const notifyArticlePublished =
  async (
    articleId,
    message
  ) => {

    const article =
      await Article.findById(articleId)
        .populate("author");

    if (!article) {
      return;
    }

    const html = `

      <h2>
        Your article has been published 🎉
      </h2>

      <p>
        Your article
        <strong>${article.title}</strong>
        has been approved by an administrator.
      </p>

      <hr/>

      <p>
        <strong>Admin Message:</strong>
      </p>

      <blockquote>
        ${
          message?.trim()
          || "Congratulations! Your article met our publishing standards."
        }
      </blockquote>

      <hr/>

      <p>
        Your article is now publicly visible.
      </p>

    `;

    await sendMail({

      to: article.author.email,

      subject:
        "Article Published",

      html,

    });

  };

export const notifyArticleRejected =
  async (
    articleId,
    message
  ) => {

    const article =
      await Article.findById(articleId)
        .populate("author");

    if (!article) {
      return;
    }

    const html = `

      <h2>
        Your article needs revision
      </h2>

      <p>

        Your article

        <strong>${article.title}</strong>

        was reviewed by an administrator.

      </p>

      <hr/>

      <p>

        <strong>Reviewer's Message:</strong>

      </p>

      <blockquote>

        ${
          message?.trim()
          ||
          "Please revise your article and submit it again."
        }

      </blockquote>

      <hr/>

      <p>

        After making changes, you can submit the article for review again.

      </p>

    `;

    await sendMail({

      to: article.author.email,

      subject:
        "Article Requires Revision",

      html,

    });

  };