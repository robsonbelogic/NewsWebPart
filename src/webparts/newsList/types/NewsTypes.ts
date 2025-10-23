export type Img = { url: string; alt?: string };

export type NewsItem = {
  id: string;
  title: string;
  excerpt: string;
  date: string; // ISO
  image?: Img;
  author?: string;
};

export type TransparencyLink = { id: string; label: string; url: string };
