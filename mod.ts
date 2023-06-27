// types
export type Attributes = Record<string, string | number | boolean>;

// internal helper
function isVoidTag(tagName: string): boolean {
  // deno-fmt-ignore
  return [
    "area", "base", "br", "col", "embed", "hr", "img",
    "input", "link", "meta", "param", "source", "track", "wbr",
  ].includes(tagName);
}

function parseAttributes(attributes: Attributes = {}): Array<string> {
  const attrs: Array<string> = [];
  Object.entries(attributes)
    .forEach(([k, v]) => {
      if (typeof v !== "boolean") {
        // add the pair of key and value when the attribute is string or number
        const value = sanitize(`${v}`, { amp: false, lt: false, gt: false });
        attrs.push(` ${k}="${value}"`);
      } else if (v) {
        // add just key key when the attribute is true
        attrs.push(` ${k}`);
      }
      // skip when the attribute is false
    });
  return attrs;
}

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
 *
 * // boolean attributes
 * assertEquals(
 *   tag("button", { type: "button", disabled: true }, "disabled"),
 *   `<button type="button" disabled>disabled</button>`,
 * );

 * // skip attributes
 * assertEquals(
 *   tag("input", { type: "text", readonly: false }),
 *   `<input type="text">`,
 * );
 * ```
 */
export function tag(
  tagName: string,
  attributesOrFirstChild?: Attributes | string,
  ...children: Array<string>
): string {
  if (!tagName) {
    throw new Error("tagName is empty.");
  }

  if (/\s/.test(tagName)) {
    throw new Error("tagName has whitespace characters.");
  }

  if (typeof attributesOrFirstChild === "string") {
    children.unshift(attributesOrFirstChild);
    attributesOrFirstChild = {};
  }
  const attrs = parseAttributes(attributesOrFirstChild);
  const close = isVoidTag(tagName) ? "" : `${children.join("")}</${tagName}>`;

  return `<${tagName}${attrs.join("")}>${close}`;
}

/**
 * Render markup tag, always add closing tag unlike tag().
 * @param tagName (required)
 * @param attributes (optional)
 * @param children (optional)
 * @return rendered tag
 *
 * Examples:
 *
 * ```ts
 * import { tag, tagNoVoid } from "https://deno.land/x/markup_tag/mod.ts";
 * import { assertEquals } from "https://deno.land/std/testing/asserts.ts"
 *
 * // in tag(), skip attributes in void tags like 'link'
 * assertEquals(
 *   tag("link", "http://example.com"),
 *   `<link>`,
 * );
 *
 * // in tagNoVoid(), always add closing tag
 * assertEquals(
 *   tagNoVoid("link", "http://example.com"),
 *   `<link>http://example.com</link>`,
 * );
 * ```
 */
export function tagNoVoid(
  tagName: string,
  attributesOrFirstChild?: Attributes | string,
  ...children: Array<string>
): string {
  if (isVoidTag(tagName)) {
    if (typeof attributesOrFirstChild === "string") {
      children.unshift(attributesOrFirstChild);
      attributesOrFirstChild = {};
    }
    return tag(tagName, attributesOrFirstChild) +
      `${children.join("")}</${tagName}>`;
  }
  return tag(tagName, attributesOrFirstChild, ...children);
}

/**
 * Render markup tag, always remove closing tag unlike tag().
 * @param tagName (required)
 * @param attributes (optional)
 * @return rendered tag
 *
 * Examples:
 *
 * ```ts
 * import { tag, tagVoid } from "https://deno.land/x/markup_tag/mod.ts";
 * import { assertEquals } from "https://deno.land/std/testing/asserts.ts"
 *
 * // in tag(), add close tag like 'div'
 * assertEquals(
 *   tag("div", { class: "red" }),
 *   `<div class="red"></div>`,
 * );
 *
 * // in tagVoid(), always remove closing tag
 * assertEquals(
 *   tagVoid("div", { class: "red" }),
 *   `<div class="red">`,
 * );
 * ```
 */
export function tagVoid(tagName: string, attributes?: Attributes): string {
  return `<${tagName}${parseAttributes(attributes).join("")}>`;
}

/**
 * Generate markup tag functions.
 * @param tagName (required)
 * @param type (optional)
 * @return markup tag function
 * @see tag()
 * @see tagNoVoid()
 * @see tagVoid()
 *
 * Examples:
 *
 * ```ts
 * import { generateTag } from "https://deno.land/x/markup_tag/mod.ts";
 * import { assertEquals } from "https://deno.land/std/testing/asserts.ts"
 *
 * const div = generateTag("div");
 * assertEquals(
 *   div({ id: "foo", class: "bar" }, "Hello world!"),
 *   `<div id="foo" class="bar">Hello world!</div>`,
 * );
 *
 * const link = generateTag("link", "noVoid");
 * assertEquals(
 *   link("http://example.com"),
 *   `<link>http://example.com</link>`,
 * );
 *
 * const span = generateTag("span", "void");
 * assertEquals(
 *   tagVoid("span", { class: "red" }),
 *   `<span class="red">`,
 * );
 * ```
 */
export function generateTag(
  tagName: string,
  type: "void",
): (attributes?: Attributes) => string;
export function generateTag(
  tagName: string,
  type: "noVoid",
): (
  attributesOrFirstChild?: Attributes | string,
  ...children: Array<string>
) => string;
export function generateTag(
  tagName: string,
  type?: "normal",
): (
  attributesOrFirstChild?: Attributes | string,
  ...children: Array<string>
) => string;
export function generateTag(
  tagName: string,
  type?: "normal" | "void" | "noVoid",
) {
  if (type === "void") {
    return function (attributes?: Attributes) {
      return tagVoid(tagName, attributes);
    };
  }
  if (type === "noVoid") {
    return function (
      attributesOrFirstChild?: Attributes | string,
      ...children: Array<string>
    ) {
      return tagNoVoid(tagName, attributesOrFirstChild, ...children);
    };
  }
  return function (
    attributesOrFirstChild?: Attributes | string,
    ...children: Array<string>
  ) {
    return tag(tagName, attributesOrFirstChild, ...children);
  };
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
  { amp = true, lt = true, gt = true, quot = true }: {
    amp?: boolean;
    lt?: boolean;
    gt?: boolean;
    quot?: boolean;
  } = {},
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
