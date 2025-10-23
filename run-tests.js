/**
 * @jest-environment jsdom
 */

import { buildElement } from "./script.mjs";

describe("buildElement()", () => {
  test("creates an element with text content", () => {
    const el = buildElement("p", {}, "Hello World");
    expect(el.tagName).toBe("P");
    expect(el.textContent).toBe("Hello World");
  });

  test("assigns properties to the element", () => {
    const el = buildElement("button", { id: "saveBtn", type: "button" }, "Save");
    expect(el.id).toBe("saveBtn");
    expect(el.type).toBe("button");
    expect(el.textContent).toBe("Save");
  });

  test("appends multiple children correctly", () => {
    const child1 = buildElement("span", {}, "Child 1");
    const child2 = buildElement("span", {}, "Child 2");
    const parent = buildElement("div", {}, child1, child2);
    expect(parent.children.length).toBe(2);
    expect(parent.children[0].textContent).toBe("Child 1");
    expect(parent.children[1].textContent).toBe("Child 2");
  });

  test("ignores null or undefined children", () => {
    const el = buildElement("div", {}, "Visible", null, undefined);
    expect(el.childNodes.length).toBe(1);
    expect(el.textContent).toBe("Visible");
  });
});
