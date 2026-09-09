---
title: Hello, World
date: 2026-08-01
tags: [intro, markdown, demo]
excerpt: The first post — exercises the self-written markdown engine: headings, code, tables, quotes and co-located images.
cover: ./hello-world/cover.svg
---

Welcome to the blog. This post is written in **markdown** and rendered by the blog's *self-written* engine — no react-markdown, no remark. The image below lives in the sibling `hello-world/` folder and is resolved automatically.

## Features

- Headings, paragraphs and **strong** / *emphasis* / ~~strikethrough~~
- `inline code` and fenced code blocks
- Blockquotes, nested lists, tables
- Raw HTML passthrough

> Black & white, minimal, sharp — the whole site speaks one visual language.

## Code

```ts
function greet(name: string): string {
  return `Hello, ${name}!`;
}
```

## Table

| Feature       | Status |
| ------------- | ------ |
| Own parser    | ✅     |
| Sibling assets | ✅     |
| HTML passthrough | ✅   |

## Nested list

1. First
2. Second
   - nested item
   - another nested item
3. Third

## Image

![A black and white cover](./hello-world/cover.svg)

![A generated PNG image](./hello-world/generated.png)

<div class="note">
This block is raw HTML, passed straight through into the article and styled by the blog CSS.
</div>
