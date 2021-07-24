import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.102.0/testing/asserts.ts";
import { tag } from "./mod.ts";

Deno.test("[tag] render tag", () => {
  assertEquals(
    tag("div", { id: "foo" }, "Hello world!"),
    `<div id="foo">Hello world!</div>`,
  );
  assertEquals(
    tag("my-tag", { class: "bar" }, "My own tag!"),
    `<my-tag class="bar">My own tag!</my-tag>`,
  );
});

Deno.test("[tag] throw error when tag has whitespace characters", () => {
  assertThrows(
    () => {
      tag("separate tag", { id: "foo" }, "Hello world!");
    },
    Error,
    "tagName has whitespace character.",
  );
});
