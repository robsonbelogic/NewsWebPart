import * as React from "react";
import { useWpPosts } from "../hooks/useWpPosts";
import { WpCategory, WpPost } from "../types/wpTypes";
import { WpMedia, getBestMediaUrl } from "../../helpers/imageHelper";
import styles from "./NewsList.module.scss";

/** decode entidades + strip HTML */
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

/** “há X horas/dias” simples (pt-BR) */
function relativeTimeFrom(dateStr?: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr).getTime();
  const diff = Date.now() - d;
  const sec = Math.max(1, Math.floor(diff / 1000));
  const min = Math.floor(sec / 60);
  const hr = Math.floor(min / 60);
  const day = Math.floor(hr / 24);
  if (day > 0) return `há ${day} ${day === 1 ? "dia" : "dias"}`;
  if (hr > 0) return `há ${hr} ${hr === 1 ? "hora" : "horas"}`;
  if (min > 0) return `há ${min} ${min === 1 ? "minuto" : "minutos"}`;
  return "agora";
}

/** Busca mídia destacada */
async function getFeaturedImage(post: WpPost) {
  const mediaUrl = post._links?.["wp:featuredmedia"]?.[0]?.href;
  if (!mediaUrl) return null;
  const res = await fetch(mediaUrl);
  if (!res.ok) return null;
  const media = (await res.json()) as WpMedia;
  return getBestMediaUrl(media); // { url, width, height, alt }
}

/** Img async */
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
    (async () => {
      const data = await getFeaturedImage(post);
      if (alive) setImg(data);
    })().catch((err) => {
      console.error(err);
    });
    return () => {
      alive = false;
    };
  }, [post.id]);

  if (!img?.url) return null;
  return (
    <figure className={styles.figure}>
      <img
        src={img.url}
        alt={alt || img.alt || ""}
        className={className}
        loading="lazy"
      />
    </figure>
  );
};

export const NewsList: React.FC = () => {
  const { items, loading, error } = useWpPosts(5); // sem botão de refresh

  if (loading) return <p>Carregando notícias...</p>;
  if (error) return <p>Erro: {error}</p>;
  if (!items.length) return <p>Sem notícias encontradas.</p>;

  return (
    <section className={styles.wrapper} aria-labelledby="news-heading">
      <header className={styles.header}>
        <span id="news-heading">
          <strong>Notícias</strong>
        </span>
      </header>

      <ul className={styles.list}>
        {items.map((post) => {
          const title = cleanHtml(post.title?.rendered) || "(Sem título)";
          const preview =
            cleanHtml(post.excerpt?.rendered || post.content?.rendered) ||
            "(Sem resumo)";
          const catText = post.categories_info?.length
            ? post.categories_info.map((c: WpCategory) => c.name).join(", ")
            : "Sem categoria";
          const when = relativeTimeFrom(post.date);

          return (
            <li key={post.id}>
              {/* TUDO CLICÁVEL */}
              <a
                href={post.link}
                target="_blank"
                rel="noreferrer"
                className={styles.card}
                aria-label={`Abrir notícia: ${title}`}
              >
                <FeaturedImage
                  post={post}
                  alt={title}
                  className={styles.image}
                />

                <div className={styles.content}>
                  <h3 className={styles.title}>{title}</h3>

                  <p className={styles.preview}>{preview}</p>

                  <div className={styles.meta}>
                    <span className={styles.metaItem}>{catText}</span>
                    <span className={styles.dot} aria-hidden>
                      •
                    </span>
                    <time className={styles.metaItem} dateTime={post.date}>
                      {when}
                    </time>
                  </div>
                </div>
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
};
