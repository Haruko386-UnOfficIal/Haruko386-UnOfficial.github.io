# Haruko386.github.io

纯 HTML、CSS、JavaScript 构建的个人主页与静态博客。博客视觉参考 Hexo Fluid，正文直接读取 `blog/posts/` 中的 Markdown 文件。

## 发布文章

只需在 `blog/posts/` 新建一个 `.md` 文件，并在开头填写 front matter：

```markdown
---
title: 文章标题
date: 2026-08-07 12:00:00
categories: 分类
tags:
  - 标签一
  - 标签二
index_img: https://example.com/cover.jpg
---

正文从这里开始。
```

- 文件名会自动成为文章地址中的 `slug`，支持中文、空格和括号。
- `index_img` 会同时用于首页缩略图和文章页头图。
- `top: true` 可以将文章置顶。
- 摘要会从正文自动提取，也可用 `description` 或 `excerpt` 手动指定。

不需要手工修改 `blog/posts.json`。推送到 `main` 后，GitHub Actions 会运行 `scripts/generate-posts.mjs`，扫描全部 Markdown 并生成索引，再发布到 GitHub Pages。

本地新增文章后，可手动刷新索引：

```bash
node scripts/generate-posts.mjs
```

然后在仓库根目录启动任意静态服务器，例如：

```bash
python -m http.server 8000
```

访问 `http://localhost:8000/blog/`。由于页面需要读取 JSON 和 Markdown，不支持直接用 `file://` 双击预览。

## 主要文件

```text
blog/
├── index.html           # 博客首页
├── app.js               # 共用导航、数据读取和页面行为
├── style.css            # Fluid 风格与响应式样式
├── post/index.html      # Markdown 文章渲染页
├── posts/               # 只需在这里新增文章
└── posts.json           # 自动生成，请勿手工维护
scripts/
└── generate-posts.mjs   # 文章扫描与索引生成脚本
```

部署工作流位于 `.github/workflows/deploy.yml`。GitHub 仓库的 Pages Source 需选择 **GitHub Actions**。
