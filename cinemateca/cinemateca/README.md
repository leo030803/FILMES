# Cinemateca

Sistema simples para gerenciar filmes: listar, cadastrar, editar e apagar.
HTML, CSS e JavaScript puro, sem build. Os dados ficam no `localStorage` do navegador.

## Páginas

| Arquivo | O que faz |
| --- | --- |
| `index.html` | Lista os filmes, tem busca e os botões **Editar** e **Apagar** (com confirmação) |
| `cadastrar.html` | Formulário de cadastro com validação e prévia do pôster |
| `editar.html?id=...` | Mesmo formulário, já preenchido com os dados do filme |

## Estrutura

```
index.html
cadastrar.html
editar.html
css/style.css
js/storage.js     CRUD no localStorage (listar, buscar, criar, atualizar, remover)
js/ui.js          pôster, aviso e formatação
js/form.js        formulário e validação (usado por cadastrar e editar)
js/index.js       lista, busca e apagar
js/cadastrar.js
js/editar.js
```

## Rodar localmente

Abra `index.html` no navegador, ou use qualquer servidor estático:

```
npx serve .
```

## Publicar

**GitHub**

```
git init
git add .
git commit -m "Sistema de filmes: cadastrar, editar e apagar"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/cinemateca.git
git push -u origin main
```

**Vercel**

1. Acesse vercel.com/new e importe o repositório.
2. Em *Framework Preset*, deixe **Other**. Não precisa de comando de build.
3. Clique em **Deploy**.

## Observação

Como os dados ficam no `localStorage`, cada navegador vê a sua própria lista.
Para dados compartilhados entre pessoas, seria preciso trocar `js/storage.js` por chamadas a uma API ou banco de dados.
