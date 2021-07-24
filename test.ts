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
      tag("li", "first element"),
      tag("li", "second element"),
    ),
    `<ul><li>first element</li><li>second element</li></ul>`,
  );
});

Deno.test("throw error when tag has whitespace characters", () => {
  assertThrows(
    () => {
      tag("separate tag", { id: "foo" }, "Hello world!");
    },
    Error,
    "tagName has whitespace character.",
  );
});
