# 极简博客模板

[![CI](https://github.com/TnTeQAQ/blog-template/actions/workflows/ci.yml/badge.svg)](https://github.com/TnTeQAQ/blog-template/actions/workflows)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Built with Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white)](https://vite.dev)
[![React 19](https://img.shields.io/badge/React-19-149eca?logo=react&logoColor=white)](https://react.dev)

[English](README.md) · 简体中文

一个极简黑白风格的个人博客模板：**React 19 + Vite 8 + TypeScript**，自带 Markdown 引擎、Three.js 首屏与细腻动效，写文章只需丢一个 Markdown 文件。**零后端、零数据库，构建产物是纯静态文件，可免费部署到 GitHub Pages / Vercel / Cloudflare Pages。**

- 在线示例：**https://tnteqaq.com**

## 特性

- **自写 Markdown → React 渲染引擎**：无 react-markdown / remark 依赖，支持标题、列表、表格、引用、代码块、原生 HTML
- **内容即文件**：文章放 `content/posts/`，同名文件夹存放图片，相对路径自动解析并打包
- **Three.js 粒子首屏**：滚动驱动的穿梭动画（自动遵循系统「减少动态效果」设置）
- **黑白极简设计**：自定义指针、磁吸/倾斜/视差/翻转等一套统一交互层（anime.js）
- **暗色模式**：首屏无闪烁，跟随本地偏好
- **干净 URL 路由**：基于 History 状态；深链接使用真实路径（`/archive`、`/posts/slug`、`/tags/tag`），打开后地址栏自动折叠回根路径，支持浏览器前进/后退与滚动位置恢复
- **纯静态**：`npm run build` 产出 `dist/`，任何静态托管均可部署

## 30 秒快速开始

1. 点击右上角 **Use this template** → **Create a new repository**（或直接点下面按钮）：

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
npm run deploy                    # 本地构建 + 推送站点到 <用户名>.github.io
```

- `npm run new -- "标题" --tags 随笔,前端`：新建时带标签；`--slug xxx` 指定英文文件名
- `npm run deploy -- "修复样式"`：自定义提交说明；不带参数则自动用时间生成
- 文章和品牌配置只保留在本工作区（已 gitignore），`deploy` 仅发布构建产物，不会把个人内容提交进公开模板

## 写文章

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

## 路由与深链接

站内跳转时地址栏始终保持根路径（页面状态保存在 `history.state` 中），但每个页面也都可以通过真实路径直接访问：

| 页面 | 路径 |
| --- | --- |
| 首页 | `/` |
| 归档 | `/archive` |
| 关于 | `/about` |
| Lab | `/lab` |
| 文章 | `/posts/<slug>` |
| 标签 | `/tags/<标签名>` |

打开这类链接会立刻渲染对应页面，随后地址栏自动折叠回根路径——既能分享链接、刷新可用，地址栏又保持简洁；按浏览器后退会回到首页。未知路径会显示自定义 404 页。

静态托管需要服务器对这些路径回退输出 `index.html`（SPA fallback）。`npm run deploy` 会把 `index.html` 复制为 `404.html` 以适应 GitHub Pages；Vercel / Netlify / Cloudflare Pages 则自动处理。

## 部署

### GitHub Pages 部署到 `<用户名>.github.io`（推荐，免费）

直接把构建好的站点推送到用户页仓库，不依赖 Actions / CI：

1. 一次性添加部署远程：

   ```bash
   git remote add pages git@github.com:<用户名>/<用户名>.github.io.git
   ```

2. 仓库 **Settings → Pages → Build and deployment → Source** 选择 **Deploy from a branch**，分支 `main`、目录 `/ (root)`；
3. 之后随时 `npm run deploy`，它会构建 `dist/` 并强制推送到 `pages` 的 `main` 分支。

> 自定义域名：首次部署后到 Settings → Pages 填入域名即可，GitHub 会读取构建产物里已生成的 `CNAME`。

### 绑定自定义域名（GitHub Pages）

1. 在 `public/CNAME` 文件中写入你的域名（如 `example.com`），仅保留本地——构建会把它复制进 `dist/`，由 `npm run deploy` 一并推送；
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
├── .github/workflows/        # ci.yml（lint + 类型检查 + 构建）
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
npm run deploy   # 构建并推送 dist/ 到 pages 远程
```

## License

[MIT](LICENSE) © TnTeQAQ
