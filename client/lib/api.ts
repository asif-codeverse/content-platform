export interface Article{
    _id : string;
    title :string;
    slug:string;
    content:string;
    status:string;
    createdAt:string;
    updatedAt:string;
}

interface ArticleResponse {
    success : boolean;
    data:Article[];
    meta?:{
        page:number;
        limit:number;
        total:number;
        totalPages: number;
    };
}

export async function fetchPublishArticles(): Promise<ArticleResponse>{
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/articles`,
        {
        cache : "no-store" , // backend handles caching
        }
    );

    if(!res.ok) throw new Error("Failed to fetch articles");

    return res.json();
}