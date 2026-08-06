# Non-existent World

一个开箱即用的 GitHub Pages 静态网站模板：动态渐变背景、居中的个人主页，以及“文件夹即页面”的零构建路由方式。

## 特点

- 纯 HTML、CSS、JavaScript，不需要 Node.js 或前端框架
- 渐变颜色和动画速度集中配置
- 响应式布局，并支持“减少动态效果”的系统设置
- 新建一个含 `index.html` 的文件夹，就能得到一个新路径
- 推送到 `main` 后由 GitHub Actions 自动发布

## 目录结构

```text
.
├── index.html                       # 首页内容和链接
├── blog/
│   ├── index.html                   # 博客列表（卡片布局 + 深度搜索 + 暗色模式）
│   ├── style.css                    # 博客完整样式（含进度条 / TOC / 暗色变量）
│   ├── posts.json                   # 文章元数据清单
│   ├── post/index.html              # 文章渲染器（marked.js + TOC + 滚动进度）
│   ├── archives/index.html          # 归档页（按年份分组）
│   ├── categories/index.html        # 分类页（聚合 + 筛选）
│   ├── tags/index.html              # 标签云 + 筛选
│   ├── about/index.html             # 关于页面
│   ├── links/index.html             # 友链页面
│   ├── static/background.jpeg       # banner 背景图
│   └── posts/
│       ├── hello-world.md           # 示例文章
│       ├── markdown-guide.md
│       └── static-blog.md
├── assets/
│   ├── css/style.css               # 首页样式与动效渐变
│   ├── data/colors.json            # 渐变颜色配置
│   └── js/main.js                  # 加载并应用颜色配置
├── .github/workflows/deploy.yml    # GitHub Pages 部署工作流
├── .nojekyll                       # 禁用 Jekyll 处理
└── _config.yml                     # 站点基础信息
```

## 部署到 `<username>.github.io`

1. 在 GitHub 新建一个公开仓库，名称必须是 `<你的用户名>.github.io`，例如 `Haruko386.github.io`。
2. 使用这个仓库作为模板，或把本项目中的文件复制到新仓库根目录。
3. 确认默认分支名为 `main`，然后推送代码。
4. 打开仓库的 **Settings → Pages**。
5. 在 **Build and deployment → Source** 中选择 **GitHub Actions**。
6. 打开 **Actions** 页面等待 `Deploy static site to Pages` 完成。
7. 访问 `https://<你的用户名>.github.io/`。

工作流也支持在 Actions 页面手动运行。若你的默认分支不是 `main`，请同步修改 [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) 中的分支名。

> GitHub Pages 的首次启用或 DNS/缓存更新可能需要几分钟。部署地址也会显示在成功的 workflow run 和仓库的 Deployments 页面中。

## 修改首页

编辑根目录的 [`index.html`](index.html)：

- 修改 `<title>`、`<h1>` 和 `.tagline` 可替换站点标题与副标题。
- 修改 `.avatar` 的 `src` 可替换头像，建议把图片放在 `assets/images/` 后使用相对路径。
- 修改 `.links` 内的 `<a>` 可配置 About、Blog、Gallery、GitHub 等链接。
- Blog 指向 `blog/` 文件夹；其余链接可根据需要自由替换。

## 配置动态渐变

只需编辑 [`assets/data/colors.json`](assets/data/colors.json)：

```json
{
  "colors": [
    "#fffdf4",
    "#d8eee7",
    "#6bc9c9",
    "#1594b2",
    "#062f6f"
  ],
  "speed": "20s"
}
```

- `colors` 至少填写两项，支持浏览器可识别的 CSS 颜色值。
- `speed` 是一次循环的时长，可使用 `s` 或 `ms`，例如 `12s`、`8000ms`。
- 如果配置加载失败，页面会自动使用 [`assets/css/style.css`](assets/css/style.css) 中的默认配色。

## 博客系统

完全仿照 [dianhsu.com](https://www.dianhsu.com/) (Hexo + Fluid 主题) 的布局与交互，全部用原生 HTML/CSS/JS 实现。

**核心文件：**

| 路径 | 功能 |
|------|------|
| `blog/` | 博客列表（卡片布局 + 分页 + 搜索 + 暗色模式） |
| `blog/post/?p=slug` | 文章详情（marked.js 渲染 MD + TOC 目录 + 滚动进度） |
| `blog/archives/` | 归档（按年份分组） |
| `blog/categories/` | 分类聚合（点击分类筛选文章） |
| `blog/tags/` | 标签云（点击标签筛选文章） |
| `blog/about/` | 关于页面 |
| `blog/links/` | 友链页面 |
| `blog/static/background.jpeg` | Banner 背景图 |
| `blog/style.css` | 全局博客样式（含进度条、回顶按钮、暗色主题变量） |

**特性：**

- 支持亮色/暗色模式（跟随系统或手动切换，`localStorage` 持久化）
- 全文搜索（`Ctrl+K` 打开搜索框，模糊匹配标题/摘要/分类/标签）
- 阅读进度条 + 回到顶部按钮
- 文章 TOC 目录（从 h2/h3 自动生成，IntersectionObserver 高亮当前阅读位置）
- Banner 打字机动画
- 完全响应式，移动端适配

### 发布新文章

1. 在 `blog/posts/` 下新建 `.md` 文件
2. 在 `blog/posts.json` 中添加元数据：

```json
{
  "slug": "my-post",
  "title": "文章标题",
  "date": "2026-08-06",
  "categories": ["分类"],
  "tags": ["标签1", "标签2"],
  "excerpt": "摘要",
  "cover": "https://example.com/cover.jpg"
}
```

- `slug` = 不含扩展名的 `.md` 文件名
- `cover` 留空则不显示封面图
- 分类和标签会自动聚合到对应页面

### 更换 Banner 背景

替换 `blog/static/background.jpeg` 即可。如使用其他路径或在线图片，修改 `blog/index.html` 中 banner 的 `--banner-img`。

## 新建通用子页面

延续"文件夹即页面"的规则：

## 本地预览

由于浏览器通常不允许通过 `file://` 请求 JSON 配置，推荐在仓库根目录启动一个本地静态服务器：

```bash
python -m http.server 8000
```

然后访问 `http://localhost:8000/`。直接双击 `index.html` 也能显示页面，但会使用 CSS 中的默认渐变配置。

## GitHub Pages 发布原理

本项目参考 GitHub 官方的静态站点 workflow：检出仓库、配置 Pages、上传仓库根目录作为 Pages artifact，再由 `deploy-pages` 发布。这个项目不需要额外的 build 步骤。

- [GitHub 官方静态 Pages workflow](https://github.com/actions/starter-workflows/blob/main/pages/static.yml)
- [使用自定义 GitHub Actions workflow 发布 Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [`actions/upload-pages-artifact`](https://github.com/actions/upload-pages-artifact)
- [`actions/deploy-pages`](https://github.com/actions/deploy-pages)

## 常见问题

**打开网站后是 404**

确认仓库名严格为 `<username>.github.io`、Pages 的 Source 已选择 GitHub Actions，并检查最新一次 Actions 运行是否成功。

**子页面是 404**

确认文件路径为 `子页面名/index.html`，访问地址建议以 `/` 结尾，例如 `/game/`。

**修改颜色后没有变化**

确认 JSON 格式正确，再强制刷新页面。若在本地预览，请使用静态服务器而不是直接打开文件。
