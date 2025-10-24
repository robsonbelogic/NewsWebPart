export type WpTitle = { rendered?: string };
export type WpContent = { rendered?: string; protected?: boolean };
export type WpExcerpt = { rendered?: string; protected?: boolean };
export type WpGuid = { rendered?: string };

export type WpLinkItem = {
  embeddable?: boolean;
  href: string;
  id?: number;
  count?: number;
  targetHints?: {
    allow?: string[];
  };
};

export type WpLinks = {
  self?: WpLinkItem[];
  collection?: WpLinkItem[];
  about?: WpLinkItem[];
  author?: WpLinkItem[];
  replies?: WpLinkItem[];
  "version-history"?: WpLinkItem[];
  "predecessor-version"?: WpLinkItem[];
  "wp:featuredmedia"?: WpLinkItem[];
  "wp:attachment"?: WpLinkItem[];
  [key: string]: WpLinkItem[] | undefined; // fallback pra outros links futuros
};

export type WpPost = {
  id: number;
  date: string;
  date_gmt: string;
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: WpTitle;
  content: WpContent;
  excerpt: WpExcerpt;
  author: number;
  featured_media: number | null;
  comment_status: string;
  ping_status: string;
  sticky: boolean;
  template: string;
  format: string;
  meta?: Record<string, any>;
  categories: number[];
  tags: number[];
  class_list?: string[];
  acf?: Record<string, any>;
  guid?: WpGuid;
  _links?: WpLinks;
};

export type WpCategory = {
  id: number;
  name: string;
  slug: string;
};

export type WpPostWithCategories = WpPost & {
  categories_info: WpCategory[];
};
