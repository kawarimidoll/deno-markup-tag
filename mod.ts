/**
 * Render markup tag.
 * @param tagName (required)
 * @param attributes (optional)
 * @param children (optional)
 * @return rendered tag
 *
 * Examples:
 *
 * ```ts
 * import { tag } from "https://deno.land/x/markup_tag/mod.ts";
 * import { assertEquals } from "https://deno.land/std/testing/asserts.ts"
 *
 * // common usage
 * assertEquals(
 *   tag("div", { id: "foo", class: "bar" }, "Hello world!"),
 *   `<div id="foo" class="bar">Hello world!</div>`,
 * );
 *
 * // void (no-close) tag
 * assertEquals(
 *   tag("meta", { charset: "utf-8" }),
 *   `<meta charset="utf-8">`,
 * );
 *
 * // nested tags
 * assertEquals(
 *   tag( "ul", { class: "nav" }, tag("li", "first"), tag("li", "second")),
 *   `<ul class="nav"><li>first</li><li>second</li></ul>`,
 * );
 * ```
 */
export function tag(
  tagName: string,
  attributesOrFirstChild?: Record<string, string | number> | string,
  ...children: Array<string>
): string {
  if (!tagName) {
    throw new Error("tagName is empty.");
  }

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

/**
 * character reference to no-break space
 */
export const NBSP = "&nbsp;";

/**
 * character reference to `<`
 */
export const LT = "&lt;";

/**
 * character reference to `>`
 */
export const GT = "&gt;";

/**
 * character reference to `&`
 */
export const AMP = "&amp;";

/**
 * character reference to `"`
 */
export const QUOT = "&quot;";

/**
 * Sanitize `&`, `<`, `>` and `"` in string.
 * @param str (optional)
 * @param SanitizeOption (optional)
 * @return sanitized string
 *
 * Use SanitizeOption like `{ amp: false }` to ignore sanitizing.
 *
 * Examples:
 *
 * ```ts
 * import { sanitize } from "https://deno.land/x/markup_tag/mod.ts";
 * import { assertEquals } from "https://deno.land/std/testing/asserts.ts"
 *
 * // common usage
 * assertEquals(
 *   sanitize(`<img src="https://www.example.com?width=10&height=10">`),
 *   "&lt;img src=&quot;https://www.example.com?width=10&amp;height=10&quot;&gt;",
 * );
 *
 * // ignore sanitizing specific characters
 * assertEquals(sanitize("<br>", { lt: false, gt: false }), "<br>");
 * ```
 */
export function sanitize(
  str = "",
  { amp = true, lt = true, gt = true, quot = true }: Record<string, boolean> =
    {},
): string {
  if (amp) {
    str = str.replaceAll("&", AMP);
  }
  if (lt) {
    str = str.replaceAll("<", LT);
  }
  if (gt) {
    str = str.replaceAll(">", GT);
  }
  if (quot) {
    str = str.replaceAll(`"`, QUOT);
  }
  return str;
}
