import * as React from "react";
import styles from "./NewsList.module.scss";

export type Img = { url: string; alt?: string };
export type NewsItem = {
  id: string;
  title?: string;
  excerpt?: string;
  date?: string; // ISO
  author?: string;
  image?: Img;
};

type Props = { items?: NewsItem[]; title?: string };

const NewsList: React.FC<Props> = ({ items = [], title = "Notícias" }) => {
  const safe = Array.isArray(items) ? items : [];

  return (
    <div className={styles.newsList}>
      <h3 className={styles.sectionTitle}>{title}</h3>

      {safe.length === 0 ? (
        <div className={styles.emptyState}>
          <p>📰 Nenhuma notícia disponível no momento!</p>
          <p className={styles.hint}>Verifique novamente mais tarde.</p>
        </div>
      ) : (
        <div className={styles.list}>
          {safe.map((n) => (
            <a
              key={n.id || Math.random().toString(36)}
              href={"#"}
              className={styles.item}
            >
              {n.image?.url ? (
                <img
                  src={n.image.url}
                  alt={n.image.alt || n.title || "Notícia"}
                  className={styles.image}
                />
              ) : (
                <div className={styles.imagePlaceholder}>🗞️</div>
              )}

              <div className={styles.content}>
                <h4 className={styles.title}>
                  {n.title || "Título não informado"}
                </h4>

                <p className={styles.excerpt}>
                  {n.excerpt || "Descrição indisponível."}
                </p>

                <div className={styles.meta}>
                  <span className={styles.author}>
                    {n.author || "Autor desconhecido"}
                  </span>
                  <span className={styles.separator}>•</span>
                  <span className={styles.time}>
                    {n.date
                      ? new Date(n.date).toLocaleDateString()
                      : "Data não informada"}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsList;
