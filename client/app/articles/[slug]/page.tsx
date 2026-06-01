import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/articles/${slug}`,
    { next: { revalidate: 60 } },
  );

  if (!res.ok) {
    return {
      title: "Article Not Found",
    };
  }

  const data = await res.json();
  const article = data.data;

  return {
    title: article.title,
    description: article.content.slice(0, 150),
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/articles/${slug}`,
    { next: { revalidate: 60 } },
  );

  if (!res.ok) {
    notFound();
  }

  const data = await res.json();
  const article = data.data;

  return (
    <main style={{ padding: "2rem" }}>
      <article>
        <h1>{article.title}</h1>
        <p>{article.content}</p>
      </article>
    </main>
  );
}
