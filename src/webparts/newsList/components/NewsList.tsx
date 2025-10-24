import * as React from "react";
import { useWpPosts } from "../hooks/useWpPosts";
import { WpCategory, WpPost } from "../types/wpTypes";
import { WpMedia, getBestMediaUrl } from "../../helpers/imageHelper";
import styles from "./NewsList.module.scss";

/** decodifica entidades HTML comuns e limpa tags */
function decodeEntities(str: string): string {
  if (!str) return "";
  const named: Record<string, string> = {
    nbsp: " ",
    amp: "&",
    quot: '"',
    apos: "'",
    lt: "<",
    gt: ">",
    ndash: "–",
    mdash: "—",
  };
  return str
    .replace(/&#(\d+);?/g, (_, d) => String.fromCharCode(parseInt(d, 10)))
    .replace(/&#x([0-9a-fA-F]+);?/g, (_, h) =>
      String.fromCharCode(parseInt(h, 16))
    )
    .replace(/&([a-zA-Z]+);/g, (m, name) => named[name] ?? m);
}

export function cleanHtml(html?: string): string {
  const decoded = decodeEntities(html || "");
  return decoded
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Busca a mídia destacada do post (helper assíncrono) */
async function getFeaturedImage(post: WpPost) {
  const mediaUrl = post._links?.["wp:featuredmedia"]?.[0]?.href;
  if (!mediaUrl) return null;
  const res = await fetch(mediaUrl);
  if (!res.ok) return null;
  const media = (await res.json()) as WpMedia;
  return getBestMediaUrl(media); // { url, width, height, alt }
}

/** Componente que resolve o async via state/useEffect */
const FeaturedImage: React.FC<{
  post: WpPost;
  alt: string;
  className?: string;
}> = ({ post, alt, className }) => {
  const [img, setImg] = React.useState<{
    url: string | null;
    width?: number;
    height?: number;
    alt?: string;
  } | null>(null);

  React.useEffect(() => {
    let alive = true;
    void (async () => {
      try {
        const data = await getFeaturedImage(post);
        if (alive) setImg(data);
      } catch (e) {
        // Ignore or log fetch errors for the featured image
        // console.error(e);
      }
    })();
    return () => {
      alive = false;
    };
  }, [post.id]);

  if (!img?.url) return null;
  return (
    <img
      src={img.url}
      alt={alt || img.alt || ""}
      className={className}
      loading="lazy"
    />
  );
};

export const NewsList: React.FC = () => {
  const { items, loading, error, refresh } = useWpPosts(5);

  if (loading) return <p>Carregando notícias...</p>;
  if (error) return <p>Erro: {error}</p>;
  if (!items.length) return <p>Sem notícias encontradas.</p>;

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h2>Notícias</h2>
        <button onClick={refresh}>Atualizar</button>
      </div>

      <ul className={styles.list}>
        {items.map((post) => {
          const title = cleanHtml(post.title?.rendered) || "(Sem título)";
          const preview =
            cleanHtml(post.excerpt?.rendered || post.content?.rendered) ||
            "(Sem resumo)";
          return (
            <li key={post.id} className={styles.card}>
              <FeaturedImage post={post} alt={title} className={styles.image} />

              {post.categories_info?.length ? (
                <p className={styles.cats}>
                  {post.categories_info
                    .map((c: WpCategory) => c.name)
                    .join(", ")}
                </p>
              ) : (
                <p className={styles.noCat}>Sem categoria</p>
              )}

              <strong className={styles.title}>{title}</strong>
              <p className={styles.preview}>{preview}</p>

              <a
                className={styles.readmore}
                href={post.link}
                target="_blank"
                rel="noreferrer"
              >
                Ler mais
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
