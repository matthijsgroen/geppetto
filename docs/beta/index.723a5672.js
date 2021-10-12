const e=e=>{const n=document.getElementById("errorBox"),t=document.createElement("p");t.textContent=e,n.appendChild(t)};window.addEventListener("error",(n=>{e(n.message),e(`${n.colno}`),e(`${n.lineno}`),e(`${n.error}`)}));
//# sourceMappingURL=index.723a5672.js.map
