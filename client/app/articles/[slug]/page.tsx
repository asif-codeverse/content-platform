import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

async function getArticle(
  slug: string
) {

  const response =
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/articles/${slug}`,
      {
        cache: "no-store",
      }
    )

  if (!response.ok) {
    return null;
  }

  const data =
    await response.json();

  return data.data;
}

export async function generateMetadata(
  { params }: Props
) {

  const { slug } =
    await params;

  const article =
    await getArticle(slug);

  if (!article) {

    return {
      title:
        "Article Not Found",
    };

  }

  return {

    title:
      article.title,

    description:
      article.content.slice(
        0,
        150
      ),

    openGraph: {

      title:
        article.title,

      description:
        article.content.slice(
          0,
          150
        ),

      type:
        "article",

    },

  };
}

export default async function ArticlePage(
  { params }: Props
) {

  const { slug } =
    await params;

  const article =
    await getArticle(slug);

  if (!article) {
    notFound();
  }

  return (
    <>
      <main className="p-8">

        <h1 className="text-4xl font-bold">
          {article.title}
        </h1>

        <div className="mt-3 flex flex-wrap gap-6 text-sm text-gray-500">

          <span>
            👤 {article.author?.name}
          </span>

          <span>
            📅{" "}
            {new Date(
              article.createdAt
            ).toLocaleDateString()}
          </span>

          <span>
            👁️ {article.views} Views
          </span>

        </div>

        <div
          className="prose max-w-none mt-6"
          dangerouslySetInnerHTML={{
            __html: article.content,
          }}
        />

      </main>
    </>
  );
}