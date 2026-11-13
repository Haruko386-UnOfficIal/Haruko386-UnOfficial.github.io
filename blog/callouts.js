/* 自定义段落（GitHub 风格的 [!note] 提示块）
 *
 * 写法：在同一条引用里，第一行写标记，后面写内容。
 *
 *   > [!note]
 *   >
 *   > 这里是想强调的内容，可以照常写 **粗体**、[链接](https://example.com)。
 *
 * 类型名可以随便起：> [!tip]、> [!diary]、> [!警告] 都行。
 * 没在这里登记过的类型，会按名字算出一个固定色相，所以不用改代码也能用。
 * 想固定某个类型的颜色或标题，就在下面加一条；label 留空字符串就不显示标题行。
 */
window.calloutTypes = {
  note: { label: 'Note', color: '#0969da' },
  tip: { label: 'Tip', color: '#1a7f37' },
  important: { label: 'Important', color: '#8250df' },
  warning: { label: 'Warning', color: '#9a6700' },
  caution: { label: 'Caution', color: '#cf222e' },

  // 自定义段落示例：把注释去掉就能用
  sentence: { label: 'sentence', color: '#fb8db1' },
  heart: { label: '', color: '#f66e67' },
  // quote: { label: '', color: '#5f7d95' },  // 不要标题行
};

(function (global) {
  'use strict';

  // [!type] —— 类型名最长 32 字，不允许出现空格或右括号
  var MARKER = /^\[!([^\]\s][^\]]{0,31})\]/;
  var types = global.calloutTypes || {};

  function definitionOf(type) {
    return types[type] || types[type.toLowerCase()] || null;
  }

  // 没登记的类型：按名字算色相，同一个名字永远是同一个颜色
  function hueOf(text) {
    var hash = 0;
    for (var i = 0; i < text.length; i += 1) hash = (hash * 31 + text.charCodeAt(i)) % 360;
    return hash;
  }

  function colorOf(type) {
    var definition = definitionOf(type);
    if (definition && definition.color) return definition.color;
    return 'hsl(' + hueOf(type) + ' 55% 52%)';
  }

  function labelOf(type) {
    var definition = definitionOf(type);
    if (definition && typeof definition.label === 'string') return definition.label;
    return type;
  }

  function slugOf(type) {
    return type.toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '') || 'custom';
  }

  // 只从段落最前面的文字节点里删掉 [!type]，段落里其它格式保持不动
  function stripMarker(paragraph) {
    var walker = document.createTreeWalker(paragraph, NodeFilter.SHOW_TEXT, null);
    var node;
    while ((node = walker.nextNode())) {
      var value = node.nodeValue;
      if (!value.trim()) continue;
      var lead = value.match(/^\s*/)[0].length;
      if (!MARKER.test(value.slice(lead))) return false;
      node.nodeValue = value.slice(0, lead) + value.slice(lead).replace(MARKER, '').trim();
      return true;
    }
    return false;
  }

  function decorate(root) {
    if (!root) return;
    Array.prototype.forEach.call(root.querySelectorAll('blockquote'), function (quote) {
      if (quote.classList.contains('callout')) return;
      var first = quote.firstElementChild;
      if (!first || first.tagName !== 'P') return;

      var match = MARKER.exec(first.textContent.trim());
      if (!match || !stripMarker(first)) return;

      var type = match[1].trim();
      if (!first.textContent.trim() && !first.children.length) quote.removeChild(first);

      quote.classList.add('callout', 'callout-' + slugOf(type));
      quote.setAttribute('data-callout', type);
      quote.style.setProperty('--callout-color', colorOf(type));

      var label = labelOf(type);
      if (label) {
        var title = document.createElement('p');
        title.className = 'callout-title';
        title.textContent = label;
        quote.insertBefore(title, quote.firstChild);
      }
    });
  }

  global.Callouts = { decorate: decorate, colorOf: colorOf, labelOf: labelOf };
})(window);
