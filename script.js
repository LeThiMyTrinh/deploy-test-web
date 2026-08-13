document.getElementById("deploy-btn").addEventListener("click", async () => {
  const resultEl = document.getElementById("deploy-result");
  resultEl.textContent = "Đang gọi API...";
  try {
    const res = await fetch("/api/hello");
    const data = await res.json();
    resultEl.textContent = `${data.message} (lúc ${data.time})`;
  } catch (err) {
    resultEl.textContent = "Lỗi gọi API!";
  }
});
