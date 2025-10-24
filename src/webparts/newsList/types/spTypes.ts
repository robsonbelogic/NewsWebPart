export type NewsItem = {
  Id: number;
  Title: string | null;
  Description?: string | null;
  Created: string; // ISO
  Modified: string; // ISO
  AuthorId?: number;
  EditorId?: number;
  BannerImageUrl?: {
    Description?: string;
    Url?: string;
  } | null;
  FirstPublishedDate?: string | null;
  PromotedState?: number | null;
  ServerRedirectedEmbedUrl?: string | null;
  GUID?: string;
};
