export function tag(
  tagName: string,
  attributesOrFirstChild?: Record<string, string> | string,
  ...children: Array<string>
): string {
  if (/\s/.test(tagName)) {
    throw new Error("tagName has whitespace characters.");
  }

  const isVoidTag = [
    "area",
    "base",
    "br",
    "col",
    "embed",
    "hr",
    "img",
    "input",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr",
  ].includes(tagName);

  const attrs: Array<string> = [];
  if (typeof attributesOrFirstChild === "string") {
    children.unshift(attributesOrFirstChild);
  } else if (attributesOrFirstChild != null) {
    Object.entries(attributesOrFirstChild)
      .forEach(([k, v]) => attrs.push(` ${k}="${v}"`));
  }

  const close = isVoidTag ? "" : `${children.join("")}</${tagName}>`;

  return `<${tagName}${attrs.join("")}>${close}`;
}

// character references
export const NBSP = "&nbsp;";
export const LT = "&lt;";
export const GT = "&gt;";
export const AMP = "&amp;";
export const QUOT = "&quot;";
