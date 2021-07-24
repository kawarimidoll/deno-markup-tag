export function tag(
  tagName: string,
  attributesOrFirstChild?: { [attr: string]: string } | string,
  ...children: string[]
): string {
  if (/\s/.test(tagName)) {
    throw new Error("tagName has whitespace character.");
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
    "keygen",
    "link",
    "meta",
    "param",
    "source",
  ].includes(tagName);

  const attrs: string[] = [];
  if (typeof attributesOrFirstChild === "string") {
    children.unshift(attributesOrFirstChild);
  } else if (attributesOrFirstChild != null) {
    Object.entries(attributesOrFirstChild)
      .forEach(([k, v]) => attrs.push(` ${k}="${v}"`));
  }

  const close = isVoidTag ? "" : `${children.join("")}</${tagName}>`;

  return `<${tagName}${attrs.join("")}>${close}`;
}
