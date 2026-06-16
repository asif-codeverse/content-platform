import Navbar from "@/components/Navbar";
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
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/articles/${slug}`,
      {
        cache: "no-store",
      }
    );

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
      <Navbar />

      <main className="p-8">

        <h1 className="text-4xl font-bold">
          {article.title}
        </h1>

        <p className="mt-6">
          {article.content}
        </p>

      </main>
    </>
  );
}