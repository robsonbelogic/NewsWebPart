type WpMediaSize = {
  file: string;
  width: number;
  height: number;
  filesize?: number;
  mime_type: string;
  source_url: string;
};

export type WpMedia = {
  id: number;
  alt_text?: string;
  source_url: string; // original
  media_details?: {
    width?: number;
    height?: number;
    sizes?: Record<string, WpMediaSize>;
  };
};

const DEFAULT_ORDER = [
  "medium_large", // comum em muitos temas WP
  "large",
  "medium",
  "thumbnail",
  "full", // WP sempre inclui "full" nas sizes
];

export function getBestMediaUrl(
  media?: WpMedia,
  preferredOrder: string[] = DEFAULT_ORDER
): { url: string | null; width?: number; height?: number; alt?: string } {
  if (!media) return { url: null };

  const sizes = media.media_details?.sizes || {};
  // tenta na ordem preferida
  for (const k of preferredOrder) {
    const s = sizes[k];
    if (s?.source_url)
      return {
        url: s.source_url,
        width: s.width,
        height: s.height,
        alt: media.alt_text || "",
      };
  }

  // fallback para "full" dentro de sizes
  const full = sizes["full"];
  if (full?.source_url)
    return {
      url: full.source_url,
      width: full.width,
      height: full.height,
      alt: media.alt_text || "",
    };

  // fallback final para o original
  return {
    url: media.source_url || null,
    width: media.media_details?.width,
    height: media.media_details?.height,
    alt: media.alt_text || "",
  };
}
