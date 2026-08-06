import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const postsDir = path.join(root, 'blog', 'posts');
const output = path.join(root, 'blog', 'posts.json');

function cleanScalar(value = '') {
  const text = value.trim();
  if ((text.startsWith('"') && text.endsWith('"')) || (text.startsWith("'") && text.endsWith("'"))) {
    return text.slice(1, -1);
  }
  if (text === 'true') return true;
  if (text === 'false') return false;
  return text;
}

function parseFrontMatter(source) {
  const match = source.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*(?:\r?\n|$)/);
  if (!match) return { data: {}, body: source };

  const data = {};
  let activeKey = '';
  for (const rawLine of match[1].split(/\r?\n/)) {
    const listItem = rawLine.match(/^\s*-\s+(.+)$/);
    if (listItem && activeKey) {
      if (!Array.isArray(data[activeKey])) data[activeKey] = data[activeKey] ? [data[activeKey]] : [];
      data[activeKey].push(cleanScalar(listItem[1]));
      continue;
    }

    const field = rawLine.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (!field) continue;
    activeKey = field[1];
    data[activeKey] = field[2] ? cleanScalar(field[2]) : [];
  }

  return { data, body: source.slice(match[0].length) };
}

function asList(value) {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  return value === undefined || value === null || value === '' ? [] : [String(value)];
}

function createExcerpt(markdown) {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/^\s{0,3}(#{1,6}|>|[-*+]\s|\d+\.\s)\s*/gm, '')
    .replace(/[`*_~|]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 180);
}

const files = (await readdir(postsDir, { withFileTypes: true }))
  .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith('.md'))
  .map((entry) => entry.name);

const posts = [];
for (const file of files) {
  const source = await readFile(path.join(postsDir, file), 'utf8');
  const { data, body } = parseFrontMatter(source.replace(/^\uFEFF/, ''));
  const slug = file.replace(/\.md$/i, '');
  posts.push({
    slug,
    file,
    title: String(data.title || slug),
    date: String(data.date || '').slice(0, 10),
    categories: asList(data.categories || data.category || data.ccategories),
    tags: asList(data.tags),
    cover: String(data.index_img || data.cover || ''),
    excerpt: String(data.description || data.excerpt || createExcerpt(body)),
    top: data.top === true || data.sticky === true,
  });
}

posts.sort((a, b) => Number(b.top) - Number(a.top) || b.date.localeCompare(a.date) || a.title.localeCompare(b.title, 'zh-CN'));
await writeFile(output, `${JSON.stringify(posts, null, 2)}\n`, 'utf8');
console.log(`Generated blog/posts.json from ${posts.length} Markdown files.`);
