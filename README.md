# Desafio Desbravador

Aplicação front-end para busca de usuários do GitHub, listagem de repositórios e visualização de detalhes, desenvolvida como solução para o desafio técnico da Desbravador.

- Repositório: https://github.com/caiomeirelles22/desafio-desbravador  
- Em produção: https://desafio-desbravador-six.vercel.app/
- Plano de execução completo: disponível no PDF anexado no email ou pelo link: https://drive.google.com/file/d/1cxJBxl5jaeRGH-CeQeIBLVzY3xYyZjaW/view?usp=sharing

---

## Sobre o projeto

A aplicação permite:

- Buscar usuários do GitHub
- Visualizar dados do perfil
- Listar repositórios com paginação e ordenação
- Ver detalhes de cada repositório
- Favoritar repositórios
- Alternar entre tema claro e escuro

O projeto foi desenvolvido priorizando simplicidade, organização e boa experiência de uso.

---

## Tecnologias

- Vite
- TypeScript
- Axios
- Bootstrap
- History API
- LocalStorage

---

## Rotas

```
/                       -> Home
/user/:username         -> Perfil + repositórios
/repo/:owner/:repo      -> Detalhe do repositório
```

---

## Como rodar o projeto

```bash
git clone https://github.com/caiomeirelles22/desafio-desbravador.git
cd desafio-desbravador
npm install
npm run dev
```

---

## API utilizada

- GET /users/{username}
- GET /users/{username}/repos
- GET /repos/{owner}/{repo}

A listagem de repositórios utiliza **apenas os parâmetros oficialmente suportados pelo endpoint exigido no desafio**.

---

## Estrutura

Organização baseada em features (ex: usuário, favoritos, tema), facilitando manutenção e escalabilidade.

---

## Observações

- Paginação baseada no header `Link` da API
- Tratamento de erros amigável para o usuário
- Projeto desenvolvido com foco em clareza e aderência ao desafio

---

## Documentação completa

Para mais detalhes sobre arquitetura, decisões técnicas e passo a passo de desenvolvimento, consulte o **plano de execução em PDF** incluído no email de entrega ou pelo link: 
https://docs.google.com/document/d/11fPP5AANVVbDWb6ufJ7CN_6ZavmkCQRuWSqC1Zw4VNw/edit?usp=sharing.

---

## Considerações finais

Projeto desenvolvido buscando equilíbrio entre simplicidade e boas práticas, com código organizado e fácil de entender.
