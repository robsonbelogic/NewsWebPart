import * as React from "react";
import { spfi, SPFx } from "@pnp/sp";
import type { WebPartContext } from "@microsoft/sp-webpart-base";
import { useNoticias } from "../hooks/useNoticias";

type Props = { context: WebPartContext };

export const NewsList: React.FC<Props> = ({ context }) => {
  // crie o sp uma vez
  const sp = React.useMemo(() => {
    const s = spfi().using(SPFx(context));
    // DEBUG rápido: confirma web atual
    // (async () => console.log("Web URL:", await s.web.toUrl()))();
    return s;
  }, [context]);

  // >>> AJUSTE AQUI para o caminho real da sua lista <<<
  const listUrl = "/sites/dev/Lists/Events"; // ou "/sites/dev/SitePages"

  const { items, loading, error, refresh } = useNoticias(sp, listUrl, 5);

  if (loading) return <div>Carregando…</div>;
  if (error) return <div>Erro: {error}</div>;
  if (!items.length)
    return (
      <div>
        <div>Sem notícias.</div>
        <button onClick={refresh}>Tentar novamente</button>
      </div>
    );

  return (
    <div>
      <button onClick={refresh}>Atualizar</button>
      <ul>
        {items.map((n: any) => (
          <li key={n.Id}>
            <strong>{n.Title ?? "(Sem título)"}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
};
