
import { getUserIds, getData, setData } from "./storage.mjs";

export function buildElement(tag, props = {}, ...children) {
  const newElement = document.createElement(tag);
  Object.assign(newElement, props);
  for (const child of children) {
    if (typeof child === "string") {
      newElement.appendChild(document.createTextNode(child));
    } else if (child) {
      newElement.appendChild(child);
    }
  }
  return newElement;
}

function renderUserOptions() {
  const select = document.getElementById("user-dropDown");

  select.querySelectorAll("option.dynamic").forEach(o => o.remove());

  const users = getUserIds();
  users.forEach(id => {
    const option = buildElement("option", { value: id, className: "dynamic" }, `User ${id}`);
    select.appendChild(option);
  });
}

function renderBookmarks(userId) {
  const list = document.getElementById("bookmarks-list");
  list.innerHTML = "";

  if (!userId) return;

  const data = getData(userId) || [];

  if (data.length === 0) {
    list.appendChild(
      buildElement("p", {}, "No bookmarks found for this user.")
    );
    return;
  }

  const sortedData = data.slice().reverse();

  sortedData.forEach((item, idx) => {
    const li = buildElement("li");

    const a = buildElement(
      "a",
      { href: item.link, target: "_blank" },
      item.title || item.link
    );

    const desc = buildElement("p", {}, item.desc || "");

    const timestamp = buildElement(
      "p",
      { className: "timestamp" },
      `Added on: ${item.createdAt || "Unknown"}`
    );

    const del = buildElement("button", { type: "button" }, "Delete");
    del.addEventListener("click", () => {
      const newData = data.slice();
      const originalIndex = data.length - 1 - idx; 
      newData.splice(originalIndex, 1);
      setData(userId, newData);
      renderBookmarks(userId);
    });

    li.append(a, desc, timestamp, del);
    list.appendChild(li);
  });
}

function init() {
  renderUserOptions();

  const userSelect = document.getElementById("user-dropDown");
  const dataForm = document.getElementById("data-form");
  const textarea = document.getElementById("desc");

  userSelect.addEventListener("change", (e) => {
    renderBookmarks(e.target.value);
  });

  dataForm.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();       
      dataForm.requestSubmit(); 
    }
  });

  dataForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const userId = userSelect.value;

    if (!userId) {
      alert("Please select a user first");
      return;
    }

    const title = document.getElementById("title").value.trim();
    const link = document.getElementById("link").value.trim();
    const desc = textarea.value.trim(); // use textarea variable

    if (!link || !title || !desc) {
      alert("Please fill in all fields before submitting.");
      return;
    }

    const createdAt = new Date().toLocaleString();
    const item = { title, link, desc, createdAt };

    const data = getData(userId) || [];
    data.push(item);
    setData(userId, data);

    dataForm.reset();
    renderBookmarks(userId);
  });
}


window.addEventListener("DOMContentLoaded", init);
