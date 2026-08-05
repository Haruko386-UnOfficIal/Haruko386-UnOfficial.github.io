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
├── game/
│   └── index.html                  # 子页面示例：/game/
├── assets/
│   ├── css/style.css               # 页面样式与渐变动画
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
- 修改 `.links` 内的 `<a>` 可配置 About、Blog、GitHub、Weibo、Telegram 和 Feed。
- 当前 Blog 指向示例页面 `game/`；Weibo、Telegram 和 Feed 是待配置的 `#` 占位链接。

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

## 新建子页面

GitHub Pages 会把目录中的 `index.html` 作为该目录的入口文件。比如要创建：

```text
https://<你的用户名>.github.io/blog/
```

可以这样做：

1. 复制 `game/` 文件夹并重命名为 `blog/`。
2. 编辑 `blog/index.html` 中的标题和内容。
3. 保持共享资源使用上一级相对路径，例如 `../assets/css/style.css`。
4. 在首页导航中加入 `<a href="blog/">Blog</a>`。
5. 推送到 `main`，Actions 会自动重新发布。

更深层级的页面同理，但需要按目录深度调整 `../` 的数量。

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
