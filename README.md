# deno-markup-tag

[![ci](https://github.com/kawarimidoll/deno-markup-tag/workflows/ci/badge.svg)](.github/workflows/ci.yml)
[![deno.land](https://img.shields.io/badge/deno-%5E1.0.0-green?logo=deno)](https://deno.land)
[![vr scripts](https://badges.velociraptor.run/flat.svg)](https://velociraptor.run)
[![LICENSE](https://img.shields.io/badge/license-MIT-brightgreen)](LICENSE)
[![tag](https://img.shields.io/github/v/tag/kawarimidoll/deno-markup-tag?sort=semver)](https://github.com/kawarimidoll/deno-markup-tag/tags)

## Usage

### tag

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
