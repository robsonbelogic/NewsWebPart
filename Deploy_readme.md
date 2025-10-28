# Guia de Deploy – WebPart SPFx (1.21.1)

## Pré-requisitos
- A solução já criada com `@microsoft/generator-sharepoint@1.21.1`
- Node 22 LTS + npm
- Permissão de **SharePoint Admin** (para publicar no App Catalog)
- URL do App Catalog:  
  `https://fcopel.sharepoint.com/sites/apps/AppCatalog/Forms/AllItems.aspx`

---

## 1) Gerar o pacote `.sppkg` (se ainda não gerou)
No diretório do projeto:

```bash
# (opcional) instalação limpa
npm ci

# build de produção
gulp bundle --ship

# empacota a solução para o catálogo
gulp package-solution --ship
```

**Saída esperada:** o arquivo `.sppkg` em  
`sharepoint/solution/<seu-pacote>.sppkg`  
(ex.: `sharepoint/solution/exemple.sppkg`)

---

## 2) Publicar no App Catalog (tenant)
1. Acesse: `https://fcopel.sharepoint.com/sites/apps/AppCatalog/Forms/AllItems.aspx`
2. Clique em **Upload** e selecione o arquivo `.sppkg` gerado em  
   `sharepoint/solution/exemple.sppkg`
3. Na caixa de diálogo que abrir:
   - **Marque**: **Make this solution available to all sites in the organization**  
     > Isso torna a solução disponível em todos os sites do tenant (tenant-scoped deployment).
4. Confirme/Finalize o upload.

> **Observação:** Se a solução pedir permissões de API, um admin precisará **aprovar** essas permissões no **API Management** do SharePoint Admin Center antes de a WebPart aparecer para os usuários.

---

## 3) Disponibilizar no site
- **Se marcou** “Make this solution available to all sites…”: já estará disponível para todos os sites (não precisa instalar app por site).
- **Se NÃO marcou** a opção:
  1. No site de destino, vá em **Site contents** (Conteúdos do Site)  
  2. **New → App** (ou **Add an app**)  
  3. Localize sua solução e clique em **Add** para instalar no site.

---

## 4) Adicionar a WebPart à página
1. Entre na página moderna do seu site e clique em **Edit** (Editar)
2. Clique no **+** para inserir um novo componente
3. Procure pela sua WebPart pelo **título definido no manifest**  
   > *Dica:* o nome exibido é o **Title** da WebPart (no `*.manifest.json`), **não necessariamente** o nome do arquivo `.sppkg`
4. Selecione e **Publish** (Publicar) a página

---

## Estrutura esperada do projeto (trecho relevante)
```
sharepoint/
  solution/
    exemple.sppkg   <-- pacote publicado no App Catalog
config/
src/
gulpfile.js
package.json
```

---

## Checklist rápido
- [ ] Executei `gulp bundle --ship`
- [ ] Executei `gulp package-solution --ship`
- [ ] Subi o `.sppkg` em **App Catalog → Upload**
- [ ] Marquei **Make this solution available to all sites...** (se desejar tenant-wide)
- [ ] (Se não tenant-wide) Instalei o app no **Site contents → Add an app**
- [ ] Adicionei a WebPart via **+** na página (buscando pelo **Title**)

---

## Problemas comuns & soluções
- **A WebPart não aparece na busca:**  
  - Verifique se o pacote foi **aprovado** (se pediu permissões).  
  - Confirme se o **Title** da WebPart está correto no manifest.  
  - Se não for tenant-wide, confira se o **app está instalado no site**.
- **Erro ao empacotar:**  
  - Rode `npm ci` e depois `gulp clean && gulp build && gulp bundle --ship && gulp package-solution --ship`.
- **Mudanças não refletem:**  
  - Incrementar versão em `config/package-solution.json` (campo `solution.version`) e republicar ajuda no cache/CDN.
