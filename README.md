# Minimal Blog Template

[![CI](https://github.com/TnTeQAQ/blog-template/actions/workflows/ci.yml/badge.svg)](https://github.com/TnTeQAQ/blog-template/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Built with Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white)](https://vite.dev)
[![React 19](https://img.shields.io/badge/React-19-149eca?logo=react&logoColor=white)](https://react.dev)

一个极简黑白风格的个人博客模板：**React 19 + Vite 8 + TypeScript**，自带 Markdown 引擎、Three.js 首屏与细腻动效，写文章只需丢一个 Markdown 文件。**零后端、零数据库，构建产物是纯静态文件，可免费部署到 GitHub Pages / Vercel / Cloudflare Pages。**

> A minimalist black-and-white personal blog template powered by **React 19 + Vite 8 + TypeScript**, with a self-written Markdown engine, a Three.js hero and carefully tuned motion design. Writing a post is just dropping in a Markdown file. **No backend, no database — the build emits static files you can host free on GitHub Pages / Vercel / Cloudflare Pages.**

- 在线示例 / Live demo: **https://tnteqaq.com**

---

[中文文档](#中文) · [English Docs](#english)

---

<a id="中文"></a>
# 中文

## 特性

- **自写 Markdown → React 渲染引擎**：无 react-markdown / remark 依赖，支持标题、列表、表格、引用、代码块、原生 HTML
- **内容即文件**：文章放 `content/posts/`，同名文件夹存放图片，相对路径自动解析并打包
- **Three.js 粒子首屏**：滚动驱动的穿梭动画（自动遵循系统「减少动态效果」设置）
- **黑白极简设计**：自定义指针、磁吸/倾斜/视差/翻转等一套统一交互层（anime.js）
- **暗色模式**：首屏无闪烁，跟随本地偏好
- **干净 URL 路由**：单根路由 + History 状态，支持浏览器前进/后退与滚动位置恢复
- **纯静态**：`npm run build` 产出 `dist/`，任何静态托管均可部署

## 30 秒快速开始

1. 点击右上角 **Use this template** → **Create a new repository**（或直接点下面按钮）

   [![Use this template](https://img.shields.io/badge/Use%20this%20template-2ea44f?style=for-the-badge&logo=github)](https://github.com/new?template_name=blog-template&template_owner=TnTeQAQ)

2. 克隆后安装依赖（需要 Node.js ≥ 20）：

   ```bash
   npm install
   npm run dev      # 本地开发 http://localhost:5173
   ```

3. 修改 `.env` 改成你的站名，删掉示例文章，推送即部署（见下文部署章节）。

## 日常写作（Hexo 式工作流）

```bash
npm install                       # 首次：安装依赖
npm run new -- "我的第一篇文章"     # 自动新建文章和同名图片文件夹
# 编辑 content/posts/我的第一篇文章.md，图片放进同名文件夹
npm run deploy                    # 一键 add/commit/pull/push，Actions 自动发布
```

- `npm run new -- "标题" --tags 随笔,前端`：新建时带标签；`--slug xxx` 指定英文文件名
- `npm run deploy -- "修复样式"`：自定义提交说明；不带参数则自动用时间生成
- 前提：仓库已配置好 GitHub Actions Pages（见下文部署章节）。本地不需要构建，1~2 分钟后线上更新

## 写文章（手动方式）

在 `content/posts/` 下手动新建 `我的第一篇.md`，或用上面的 `npm run new`：

```markdown
---
title: 我的第一篇文章
date: 2026-01-15
tags: [随笔, 前端]
excerpt: 显示在文章卡片上的摘要
cover: ./我的第一篇/cover.png   # 可选，封面图
---

正文内容，支持完整 Markdown 语法……

![截图](./我的第一篇/screenshot.png)
```

约定：

- **图片**：放在同名文件夹 `content/posts/我的第一篇/` 中，引用写 `./我的第一篇/xx.png` 或简写 `./xx.png`，两种写法都会被自动解析
- **文件名即 URL 标识（slug）**，支持中文文件名
- **标签**：Front matter 的 `tags` 数组会自动生成标签页
- **隐藏文章**：加上 `hidden` 标签后文章不出现在归档列表，但仍可通过标签页访问
- **关于页**：编辑 `content/about.md`（同样的 Markdown 渲染通道）
- 也支持 `.html` 文件（原生 HTML 直出）

文章按 `date` 倒序排列，首页自动展示最新两篇。

## 配置

所有品牌文案集中在 `.env`（Vite 环境变量，会被打进包，**不要放密钥**）：

| 变量 | 作用 | 默认 |
| --- | --- | --- |
| `VITE_SITE_NAME` | 首页大标题、浏览器标题后缀 | `My Blog` |
| `VITE_SITE_SUBTITLE` | 首页副标题 | `A minimalist blog template` |
| `VITE_SITE_ABOUT` | 首页 About 区块简介 | 内置英文简介 |
| `VITE_BASE` | 子路径部署时的 base，如 `/blog/`；独立域名留空/`/` | `/` |

本地临时覆盖可建 `.env.local`（已被 gitignore）。完整字段见 `.env.example`。

## 部署

### GitHub Pages（推荐，免费）

仓库已内置 `.github/workflows/deploy.yml`（模板仓库中默认休眠，不会误部署）。

1. 推送代码到 GitHub；
2. 仓库 **Settings → Secrets and variables → Actions → Variables** 新建变量：
   - `ENABLE_PAGES` = `true`
   - （仅当部署地址是 `https://用户名.github.io/仓库名/` 这种**子路径**时）再加 `VITE_BASE` = `/你的仓库名/`；
3. 仓库 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**；
4. 之后每次 push 到 `main` 自动构建发布，也可在 Actions 页手动触发。

> 两种 GitHub Pages 地址：
> - 仓库名恰好为 `<用户名>.github.io`，或绑定了自定义域名 → 站点在根路径，`VITE_BASE` 保持 `/`；
> - 其他仓库名 → 站点在 `/仓库名/` 子路径，**必须**设置 `VITE_BASE`，否则静态资源 404。

### 绑定自定义域名（GitHub Pages）

1. 在仓库 `public/CNAME` 文件中写入你的域名（如 `example.com`），推送；
2. DNS 处添加记录到 GitHub Pages：
   - 根域 `A` 记录指向 `185.199.108.153`、`185.199.109.153`、`185.199.110.153`、`185.199.111.153`；
   - `www` 添加 `CNAME` 指向 `<用户名>.github.io`；
3. Settings → Pages → Custom domain 填入域名，等待 HTTPS 证书签发后勾选 **Enforce HTTPS**。

### 其他平台

构建命令统一为 `npm run build`，输出目录统一为 `dist`：

| 平台 | 备注 |
| --- | --- |
| **Vercel** | Import 仓库即可，Framework 选 Vite，其余零配置；子路径无需考虑 |
| **Cloudflare Pages** | Build command `npm run build`，Output directory `dist` |
| **Netlify** | 同上；可加 `netlify.toml` 配置 SPA 行为（本站单根路由，基本不需要） |
| 任意静态服务器 / 对象存储 | 上传 `dist/` 内容即可 |

## 同步模板更新

你的仓库独立演进后，仍可合入模板以后的更新：

```bash
git remote add template https://github.com/TnTeQAQ/blog-template.git
git fetch template
git merge template/main --allow-unrelated-histories
# content/ 与 .env 不冲突；如配置文件有冲突，保留你的站点配置即可
```

## 目录结构

```
├── content/
│   ├── about.md              # 关于页
│   └── posts/                # 文章（.md/.html）+ 同名资源文件夹
├── public/                   # favicon、robots.txt、CNAME(自定义域名时)
├── src/
│   ├── components/           # UI 与交互组件（Fx/Reveal/ThreeHero…）
│   ├── lib/markdown/         # 自写 Markdown 分词器与渲染器
│   ├── pages/                # Home / Archive / Lab / Post 视图
│   ├── router/               # 单根 History 路由
│   └── config.ts             # 读取 VITE_SITE_* 配置
├── .github/workflows/        # ci.yml 与 deploy.yml
├── scripts/                  # new-post.mjs (新建文章) 与 deploy.mjs (一键发布)
└── .env                      # 站点配置
```

## 本地开发命令

```bash
npm run dev      # 开发服务器
npm run build    # 类型检查 + 生产构建到 dist/
npm run preview  # 预览构建产物
npm run lint     # ESLint
npm run new      # 新建文章脚手架（npm run new -- "标题"）
npm run deploy   # 一键提交并推送到 GitHub
```

## License

[MIT](LICENSE) © TnTeQAQ

---

<a id="english"></a>
# English

## Features

- **Self-written Markdown → React renderer** — no react-markdown / remark; headings, lists, tables, quotes, fenced code and raw HTML all supported
- **Content as files** — posts live in `content/posts/`; co-located sibling folders hold images and relative paths are resolved and bundled automatically
- **Three.js particle hero** with scroll-driven fly-through (respects the OS "reduce motion" setting)
- **Black-and-white minimal design** with a unified interaction layer: custom cursor, magnetic / tilt / parallax / flip effects (anime.js)
- **Dark mode** with no flash of unstyled content
- **Clean-URL router** built on History state, with back/forward and scroll restoration
- **Fully static** — `npm run build` emits a `dist/` folder deployable to any static host

## Quick Start

1. Click **Use this template** → **Create a new repository**:

   [![Use this template](https://img.shields.io/badge/Use%20this%20template-2ea44f?style=for-the-badge&logo=github)](https://github.com/new?template_name=blog-template&template_owner=TnTeQAQ)

2. Install and run (Node.js ≥ 20):

   ```bash
   npm install
   npm run dev      # http://localhost:5173
   ```

3. Edit `.env` with your site name, delete the demo posts, then deploy (see below).

## Daily writing workflow (Hexo-style)

```bash
npm install                        # once
npm run new -- "My first post"     # scaffolds the post + image folder
# edit content/posts/My-first-post.md, drop images into its sibling folder
npm run deploy                     # add/commit/pull/push — Actions publishes it
```

- `npm run new -- "Title" --tags notes,web` adds tags; `--slug my-post` overrides the file name
- `npm run deploy -- "fix css"` sets a custom commit message (a timestamped one is the default)
- No local build needed: GitHub Actions builds and publishes in 1–2 minutes (Pages setup required once, see Deployment)

## Writing Posts

Use `npm run new`, or manually create `content/posts/my-first-post.md`:

```markdown
---
title: My First Post
date: 2026-01-15
tags: [notes, frontend]
excerpt: A short summary shown on the post card
cover: ./my-first-post/cover.png   # optional
---

Markdown body…

![screenshot](./my-first-post/screenshot.png)
```

Conventions:

- **Images**: place them in the sibling folder `content/posts/my-first-post/`; both `./my-first-post/x.png` and the shorthand `./x.png` resolve automatically
- The **file name is the slug** (non-ASCII names are fine)
- `tags` generate tag pages automatically
- Tag a post with `hidden` to keep it out of the archive (still reachable via tag pages)
- The About page is `content/about.md`, rendered through the same engine
- Raw `.html` files are also passed through

## Configuration

Brand strings live in `.env` (Vite env vars, baked into the bundle — **never put secrets here**):

| Var | Purpose | Default |
| --- | --- | --- |
| `VITE_SITE_NAME` | Hero title and document-title suffix | `My Blog` |
| `VITE_SITE_SUBTITLE` | Hero tagline | `A minimalist blog template` |
| `VITE_SITE_ABOUT` | Home-page About teaser | built-in English text |
| `VITE_BASE` | Sub-path hosting, e.g. `/blog/`; `/` for root or custom domain | `/` |

Use `.env.local` (gitignored) for local overrides. See `.env.example`.

## Deployment

### GitHub Pages (recommended, free)

The repo ships with `.github/workflows/deploy.yml` (dormant in the template repo itself):

1. Push to GitHub;
2. **Settings → Secrets and variables → Actions → Variables**, add:
   - `ENABLE_PAGES` = `true`
   - (only when serving from `https://USER.github.io/REPO/`) also set `VITE_BASE` = `/REPO/`;
3. **Settings → Pages → Build and deployment → Source** → **GitHub Actions**;
4. Every push to `main` now deploys.

### Custom domain (GitHub Pages)

1. Put your domain in `public/CNAME` and push;
2. Point DNS at GitHub Pages: root `A` records to `185.199.108.153` / `.109.` / `.110.` / `.111.153`, and a `www` `CNAME` to `<user>.github.io`;
3. Add the domain under Settings → Pages and enable **Enforce HTTPS** once the certificate is ready.

### Other platforms

Every platform uses build command `npm run build` and output dir `dist`:

- **Vercel** — import the repo, pick the Vite preset, zero other config.
- **Cloudflare Pages** — command `npm run build`, output `dist`.
- **Netlify** — same settings.
- **Any static server / object storage** — upload the contents of `dist/`.

### Pulling template updates later

```bash
git remote add template https://github.com/TnTeQAQ/blog-template.git
git fetch template
git merge template/main --allow-unrelated-histories
```

## Development

```bash
npm run dev      # dev server
npm run build    # type-check + production build to dist/
npm run preview  # preview the build
npm run lint     # ESLint
npm run new      # scaffold a post (npm run new -- "Title")
npm run deploy   # commit and push in one command
```

## License

[MIT](LICENSE) © TnTeQAQ
