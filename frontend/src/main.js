import "./style.css";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

async function loadTodos() {
  const listEl = document.getElementById("todo-list");
  listEl.innerHTML = "<li>Đang tải...</li>";
  try {
    const res = await fetch(`${API_BASE}/api/todos`);
    const todos = await res.json();
    listEl.innerHTML = todos
      .map((t) => `<li>${t.done ? "✅" : "⬜"} ${t.title}</li>`)
      .join("");
  } catch (err) {
    listEl.innerHTML = "<li>Lỗi tải dữ liệu từ Backend!</li>";
  }
}

document.getElementById("reload-btn").addEventListener("click", loadTodos);
loadTodos();
