# deno-markup-tag

[![ci](https://github.com/kawarimidoll/deno-markup-tag/workflows/ci/badge.svg)](.github/workflows/ci.yml)
[![deno version](https://img.shields.io/badge/deno-%5E1.13.0-green?logo=deno)](https://deno.land)
[![vr scripts](https://badges.velociraptor.run/flat.svg)](https://velociraptor.run)
[![LICENSE](https://img.shields.io/badge/license-MIT-brightgreen)](LICENSE)
[![deno.land](https://img.shields.io/github/v/tag/kawarimidoll/deno-markup-tag?style=flat&logo=deno&label=deno.land&color=steelblue&sort=semver)](https://deno.land/x/markup_tag)
[![nest badge](https://nest.land/badge.svg)](https://nest.land/package/markup-tag)

## Usage

[![deno doc](https://doc.deno.land/badge.svg)](https://doc.deno.land/https/deno.land/x/markup_tag/mod.ts)

### Import

From [deno.land/x](https://deno.land/x):

```ts
import { tag } from "https://deno.land/x/markup_tag@0.4.0/mod.ts";
```

From [x.nest.land](http://nest.land):

```ts
import { tag } from "https://x.nest.land/markup-tag@0.4.0/mod.ts";
```

From [pax.deno.dev](http://pax.deno.dev):

```ts
import { tag } from "https://pax.deno.dev/kawarimidoll/deno-markup-tag@0.4.0";
```

### tag

Render markup tag.

```ts
// common usage
assertEquals(
  tag("div", { id: "foo", class: "bar" }, "Hello world!"),
  `<div id="foo" class="bar">Hello world!</div>`,
);

// void (no-close) tag
assertEquals(tag("meta", { charset: "utf-8" }), `<meta charset="utf-8">`);

// nested tags
assertEquals(
  tag("ul", { class: "nav" }, tag("li", "first"), tag("li", "second")),
  `<ul class="nav"><li>first</li><li>second</li></ul>`,
);

// boolean attributes
assertEquals(
  tag("button", { type: "button", disabled: true }, "disabled"),
  `<button type="button" disabled>disabled</button>`,
);

// skip attributes
assertEquals(
  tag("input", { type: "text", readonly: false }),
  `<input type="text">`,
);
```

### Character references

These constants are exported.

```ts
const NBSP = "&nbsp;";
const LT = "&lt;";
const GT = "&gt;";
const AMP = "&amp;";
const QUOT = "&quot;";
```

### sanitize

Sanitize `&`, `<`, `>` and `"` in string.

```ts
// common usage
assertEquals(
  sanitize(`<img src="https://www.example.com?width=10&height=10">`),
  "&lt;img src=&quot;https://www.example.com?width=10&amp;height=10&quot;&gt;",
);

// ignore sanitizing specific characters
assertEquals(sanitize("<br>", { lt: false, gt: false }), "<br>");
```
