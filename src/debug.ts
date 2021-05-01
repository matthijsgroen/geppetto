const writeError = (text: string) => {
  const box = document.getElementById("errorBox");
  const el = document.createElement("p");
  el.textContent = text;
  box.appendChild(el);
};

window.addEventListener("error", (e) => {
  writeError(e.message);
  writeError(`${e.colno}`);
  writeError(`${e.lineno}`);
  writeError(`${e.error}`);
});
