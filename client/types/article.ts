export interface Article {
  _id: string;
  title: string;
  slug: string;
  status: "DRAFT" | "PENDING" | "REJECTED" | "PUBLISHED";
  content: string;
  views: number;
  updatedAt: string;
  createdAt: string;
}
