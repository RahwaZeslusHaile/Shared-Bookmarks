/**
 * @jest-environment jsdom
 */
import { buildElement } from "./script.mjs";
import { getData, setData, clearData } from "./storage.mjs";

beforeEach(() => {
  localStorage.clear();
});

test("buildElement creates an element with text", () => {
  const el = buildElement("p", {}, "Hello World");
  expect(el.tagName).toBe("P");
  expect(el.textContent).toBe("Hello World");
});

test("storage: set/get/clear data", () => {
  const userId = "1";
  const bookmarks = [{ title: "Google", link: "https://google.com", desc: "Search" }];

  setData(userId, bookmarks);
  expect(getData(userId)).toEqual(bookmarks);

  clearData(userId);
  expect(getData(userId)).toBeNull();
});
