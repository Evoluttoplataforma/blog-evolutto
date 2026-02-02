# Instrucoes para Configurar o CMS do Blog Evolutto

## IMPORTANTE: Admin Master

O email **rodrigo.souza@templum.com.br** é o Admin Master do sistema.
- Este usuario tem acesso TOTAL ao sistema
- Pode aprovar/rejeitar novos usuarios
- Pode alterar roles (Admin, Editor, Autor)
- Pode ver estatisticas de artigos por usuario

Quando outros usuarios se cadastram, eles ficam PENDENTES até serem aprovados pelo Admin Master.

## 1. Configurar o Firebase (OBRIGATORIO)

Antes de usar o CMS, voce precisa criar um projeto no Firebase e configurar as credenciais.

### Passo 1: Criar Projeto no Firebase

1. Acesse https://console.firebase.google.com/
2. Clique em "Adicionar projeto"
3. De um nome ao projeto (ex: "blog-evolutto")
4. Desative o Google Analytics (opcional) e clique em "Criar projeto"

### Passo 2: Configurar Autenticacao

1. No menu lateral, clique em "Authentication"
2. Clique em "Comecar"
3. Ative o provedor "E-mail/senha"

### Passo 3: Criar Banco de Dados (Firestore)

1. No menu lateral, clique em "Firestore Database"
2. Clique em "Criar banco de dados"
3. Escolha "Iniciar no modo de producao"
4. Selecione a regiao mais proxima (ex: southamerica-east1)

### Passo 4: Configurar Storage (para imagens)

1. No menu lateral, clique em "Storage"
2. Clique em "Comecar"
3. Aceite as regras padrao

### Passo 5: Obter Credenciais

1. Clique no icone de engrenagem > "Configuracoes do projeto"
2. Role ate "Seus apps" e clique no icone "</>" (Web)
3. De um nome ao app (ex: "blog-evolutto-web")
4. Copie o objeto `firebaseConfig`

### Passo 6: Atualizar as Credenciais no Codigo

Abra o arquivo `src/config/firebase.js` e substitua as credenciais:

```javascript
const firebaseConfig = {
    apiKey: "SUA_API_KEY_AQUI",
    authDomain: "SEU_PROJETO.firebaseapp.com",
    projectId: "SEU_PROJETO",
    storageBucket: "SEU_PROJETO.appspot.com",
    messagingSenderId: "SEU_MESSAGING_SENDER_ID",
    appId: "SEU_APP_ID"
};
```

### Passo 7: Configurar Regras de Seguranca

**Firestore Rules:**
Va em Firestore > Regras e adicione:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Artigos - leitura publica, escrita autenticada
    match /articles/{articleId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // Usuarios - apenas o proprio usuario pode ler/escrever
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

**Storage Rules:**
Va em Storage > Regras e adicione:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /articles/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

---

## 2. Como Acessar o CMS

Apos configurar o Firebase:

1. Acesse: `https://seudominio.com/registro` ou `https://seudominio.com/admin/login`
2. Crie uma conta clicando em "Criar conta"
3. Faca login com seu e-mail e senha
4. Voce sera redirecionado para o Dashboard

---

## 3. Usando o CMS

### Dashboard
- Visualize estatisticas de artigos (total, publicados, rascunhos, views)
- Veja a lista de todos os artigos
- Filtre por status (publicados/rascunhos)
- Busque artigos pelo titulo

### Criar Novo Artigo
1. Clique em "Novo Artigo" no menu lateral ou no botao do dashboard
2. Preencha os campos:
   - **Titulo**: Nome do artigo
   - **Resumo**: Descricao curta para os cards
   - **Conteudo**: Use o editor visual para formatar o texto
   - **Imagem de Capa**: Faca upload de uma imagem

### Configurar SEO
Na aba "SEO" do editor:
- **Meta Titulo**: Titulo que aparece no Google (max 60 caracteres)
- **Meta Descricao**: Descricao para os buscadores (max 160 caracteres)
- **Palavras-chave**: Termos separados por virgula
- **URL Canonica**: URL oficial do artigo (opcional)

### Configurar Artigo
Na aba "Configuracoes":
- **Nome do Autor**: Quem escreveu o artigo
- **Cargo do Autor**: Funcao/cargo do autor
- **Data de Publicacao**: Quando o artigo foi publicado
- **Categorias**: Selecione as categorias relevantes
- **Tags**: Adicione tags para melhor organizacao

### Publicar
- **Salvar como Rascunho**: Salva sem publicar
- **Publicar**: Publica o artigo no blog

---

## 4. URLs do Sistema

| URL | Funcao |
|-----|--------|
| `/` | Homepage do blog |
| `/article/{slug}` | Pagina do artigo |
| `/registro` | Pagina de login/registro |
| `/admin` | Dashboard administrativo |
| `/admin/login` | Login alternativo |
| `/admin/articles/new` | Criar novo artigo |
| `/admin/articles/{id}` | Editar artigo existente |

---

## 5. Fazendo Deploy no Hostgator

1. Acesse o cPanel do Hostgator
2. Va em "Gerenciador de Arquivos"
3. Navegue ate a pasta `public_html`
4. Faca upload do arquivo `site.zip`
5. Extraia o conteudo do zip
6. Pronto! O site estara no ar.

**IMPORTANTE:** Se voce usar um subdominio ou pasta diferente, configure o `base` no `vite.config.js` antes de fazer o build.

---

## 6. Suporte

Se tiver problemas:
1. Verifique se as credenciais do Firebase estao corretas
2. Verifique se as regras de seguranca foram configuradas
3. Abra o Console do navegador (F12) para ver erros
4. Verifique se o Firebase esta ativo e funcionando

---

**Desenvolvido com React + Vite + Firebase**
