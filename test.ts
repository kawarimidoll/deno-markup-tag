import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.102.0/testing/asserts.ts";
import { tag } from "./mod.ts";

Deno.test("render tag", () => {
  assertEquals(
    tag("div", { id: "foo", class: "bar" }, "Hello world!"),
    `<div id="foo" class="bar">Hello world!</div>`,
  );
  assertEquals(
    tag("my-tag", { class: "bar" }, "My own tag!"),
    `<my-tag class="bar">My own tag!</my-tag>`,
  );
});

Deno.test("render void tag", () => {
  assertEquals(
    tag("meta", { charset: "utf-8" }),
    `<meta charset="utf-8">`,
  );
  assertEquals(
    tag("input", {
      type: "text",
      name: "name",
      placeholder: "input your name",
    }),
    `<input type="text" name="name" placeholder="input your name">`,
  );
});

Deno.test("render tag without attributes", () => {
  assertEquals(
    tag("div", "No attributes!"),
    `<div>No attributes!</div>`,
  );
  assertEquals(
    tag("br"),
    `<br>`,
  );
});

Deno.test("render nested tag", () => {
  assertEquals(
    tag(
      "a",
      { href: "https://deno.land" },
      tag("img", { src: "https://deno.land/logo.svg" }),
    ),
    `<a href="https://deno.land"><img src="https://deno.land/logo.svg"></a>`,
  );
  assertEquals(
    tag(
      "ul",
      { class: "nav" },
      tag("li", "first element"),
      tag("li", "second element"),
    ),
    `<ul class="nav"><li>first element</li><li>second element</li></ul>`,
  );
  assertEquals(
    tag(
      "div",
      { class: "container" },
      tag(
        "article",
        { class: "post" },
        tag("p", "awesome text"),
      ),
    ),
    `<div class="container"><article class="post"><p>awesome text</p></article></div>`,
  );
});

Deno.test("render svg tag", () => {
  assertEquals(
    tag(
      "svg",
      { width: 100, height: 100 },
      tag("rect", { x: 20, y: 20, fill: "#a33" }),
    ),
    `<svg width="100" height="100"><rect x="20" y="20" fill="#a33"></rect></svg>`,
  );
});

Deno.test("throw error when tag has whitespace characters", () => {
  assertThrows(
    () => {
      tag("separate tag", { id: "foo" }, "Hello world!");
    },
    Error,
    "tagName has whitespace characters.",
  );
});
