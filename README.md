# Shopping Web Part – SPFx 1.21.1 (Node 22 LTS)

Guia rápido para **instalar dependências**, **executar o ambiente de desenvolvimento** e **empacotar** uma WebPart moderna do SharePoint Framework (SPFx).

> **Compatibilidade**
>
> - Node: `>=22.14.0 <23.0.0` (LTS)
> - SPFx: `1.21.1`
> - React: `17.0.x`
> - TypeScript: `5.3.x`
> - Gulp: `4.x`

---

## 1) Pré-requisitos

### Windows (PowerShell/Admin)

1. **Instalar Node.js 22 LTS**

   - Baixe do site oficial: [https://nodejs.org](https://nodejs.org)
   - Durante a instalação, marque **“Automatically install the necessary tools”**.
   - Verifique a instalação:
     ```powershell
     node -v
     npm -v
     ```

2. **Instalar Gulp CLI e Yeoman**

   ```powershell
   npm install --global gulp yo
   npm install --global @microsoft/generator-sharepoint@1.21.1
   ```

3. **Confiar certificado de desenvolvimento**
   ```powershell
   gulp trust-dev-cert
   ```

---

### Linux (Ubuntu/Debian)

1. **Instalar dependências do sistema**

   ```bash
   sudo apt update
   sudo apt install -y build-essential python3 make g++ libssl-dev ca-certificates curl
   ```

2. **Instalar Node.js 22 LTS**

   ```bash
   curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
   sudo apt-get install -y nodejs
   node -v
   npm -v
   ```

3. **Instalar Gulp CLI e Yeoman**

   ```bash
   sudo npm install -g gulp yo @microsoft/generator-sharepoint@1.21.1
   ```

4. **Confiar certificado de desenvolvimento**
   ```bash
   gulp trust-dev-cert
   ```

---

## 2) Criar novo projeto (opcional)

Se você ainda **não possui o projeto**:

```bash
yo @microsoft/sharepoint
# Responda:
# - WebPart
# - Nome: Shopping Web Part (ou outro)
# - Framework: React
# - Use CSS/SASS modules
# - Ambiente: SharePoint Online

```

## 2.1) ⚠️ **Importante!**

Se estiver em ambiente **Linux**, após executar o comando:

```bash
yo @microsoft/sharepoint
```

rode o seguinte comando para garantir que todas as dependências foram instaladas corretamente:

```bash
sudo npm install
```

> O gerador `yo @microsoft/sharepoint` pode falhar silenciosamente sem exibir erros,
> o que pode resultar em problemas de dependências durante o build ou o serve.

## ⚠️ **Importante! Não existe mais desenvolvimento local, apenas hospedado**

## 3) Desenvolvimento (Workbench hospedado)

### Configurar `serve.json`

O SPFx 1.21.x utiliza **somente o Workbench hospedado**.  
Crie/edite o arquivo `config/serve.json` com:

```json
{
  "$schema": "https://developer.microsoft.com/json-schemas/spfx-build/spfx-serve.schema.json",
  "port": 4321,
  "https": true,
  "initialPage": "https://fcopel.sharepoint.com/sites/dev/_layouts/15/workbench.aspx"
}
```

### Iniciar servidor de desenvolvimento

```bash
gulp serve
```

- O comando abrirá automaticamente o **Workbench do tenant** configurado em `initialPage`.
- O endereço `https://localhost:4321/temp/workbench.html` **não é mais suportado**.

---

## 4) Build e Pacote para Deploy

Gerar build de produção e empacotar a solução:

```bash
gulp bundle --ship
gulp package-solution --ship
```

**Saída esperada:**

```
sharepoint/solution/exemple.sppkg
```

### Deploy no App Catalog

1. Acesse: `https://<tenant>.sharepoint.com/sites/apps/AppCatalog/Forms/AllItems.aspx`
2. Faça **Upload** do `.sppkg`
3. Marque **“Make this solution available to all sites in the organization”**
4. Aprove permissões (se solicitado)
5. Mais informações sobre o deploy estão disponíveis no arquivo Deploy_readme

---

## 5) Troubleshooting

### Node/Gulp não encontrados

- Verifique `node -v`, `npm -v`, `gulp -v`
- No Windows: `npm config set scripts-prepend-node-path true`

### Erros de certificado

- Rode `gulp trust-dev-cert` novamente
- Exclua `~/.rushstack` (ou `%USERPROFILE%\.rushstack`)
- Importe certificado manualmente no navegador

### Falha em dependências nativas

- Linux: `sudo apt install build-essential python3 g++ libssl-dev`
- Windows: instale **Build Tools**

### Mudanças não refletidas

- Atualize a versão em `config/package-solution.json`
- Rode novamente `bundle --ship` e `package-solution --ship`

### WebPart não aparece

- Instale a solução via **Site Contents → Add an App**
- Confirme se o **Title** no manifest é o nome exibido

---

## 6) Comandos principais

```bash
# Instalar dependências
npm ci

# Limpar artefatos
gulp clean

# Build dev
gulp build

# Servidor local (abre o Workbench hospedado)
gulp serve

# Build produção + pacote
gulp bundle --ship
gulp package-solution --ship
```

---

## 7) Versões utilizadas

- **SPFx** 1.21.1
- **React** 17.0.x
- **TypeScript** 5.3.x
- **Gulp** 4.x
- **Node** >=22.14.0 <23.0.0

---
