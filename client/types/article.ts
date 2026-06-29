export interface ArticleAuthor {
  _id: string;
  name: string;
  email: string;
}

export interface Article {
  _id: string;
  title: string;
  slug: string;
  status:
  | "DRAFT"
  | "PENDING"
  | "REJECTED"
  | "PUBLISHED";
  content: string;
  excerpt?: string;
  views: number;
  createdAt: string;
  updatedAt: string;
  author: ArticleAuthor;
}