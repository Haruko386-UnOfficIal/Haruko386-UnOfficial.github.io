# 如何用原生 HTML 搭建一个静态博客

不使用 React、Vue、Hexo 或任何构建工具，只用原生三件套就能在 GitHub Pages 上运行一个完整的博客。

## 为什么选择原生方案

- **零依赖**：不需要 Node.js、npm install
- **部署简单**：GitHub Pages 直接托管静态文件
- **性能好**：没有构建步骤，没有运行时框架

## 核心组件

### 文章列表

通过 `posts.json` 维护文章元数据，页面加载时 fetch 该 JSON，然后渲染卡片列表。

```json
{
  "slug": "static-blog",
  "title": "如何用原生 HTML 搭建一个静态博客",
  "date": "2026-06-20",
  "categories": ["教程"],
  "tags": ["GitHub Pages"]
}
```

### Markdown 渲染

使用 [marked.js](https://github.com/markedjs/marked) 在客户端解析 `.md` 文件：

```javascript
fetch('posts/hello-world.md')
  .then(r => r.text())
  .then(md => {
    document.getElementById('postBody').innerHTML = marked.parse(md);
  });
```

### 路由设计

采用"文件夹即页面"的设计 —— 每个子路径就是一个文件夹，里面放 `index.html`。

## 功能清单

1. 博客列表带分页
2. 分类 / 标签聚合
3. 按年份归档
4. 全文搜索
5. 暗色模式
6. 文章 TOC 目录

> 这就是原生三件套的力量。
