import Link from "next/link";
import { fetchPublishArticles } from "@/lib/api";

export const metadata = {
  title : "Content Platform",
  description : "Read production-level articles built with MERN"
}

export default async function Home() {
  const response = await fetchPublishArticles();
  const articles = response.data;

  return(
    <main style={{padding:"2rem"}}>
      <h1>Published Articles</h1>
  
    {articles.length === 0 && <p>No Articles Found</p>}


    <ul>
      {articles.map((article)=>(
        <li key={article._id}>
          <Link href={`/articles/${article.slug}`}>
          {article.title}
          </Link>
        </li>
      ))}
    </ul>
    </main>
  );
}