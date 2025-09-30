const $ = (s) => document.querySelector(s);
const tb = $("#tb");
const msg = $("#msg");
const frm = $("#frm");
const nombre = $("#nombre");
const precio = $("#precio");

async function cargar() {
  const res = await fetch(`${API}/productos`);
  const data = await res.json();
  tb.innerHTML = data.map(p => `
    <tr>
      <td>${p.id}</td>
      <td>${p.nombre}</td>
      <td>${Number(p.precio).toFixed(2)}</td>
      <td><button data-id="${p.id}" class="del">Eliminar</button></td>
    </tr>
  `).join("");
}

frm.addEventListener("submit", async (e) => {
  e.preventDefault();
  msg.textContent = "";
  const body = {
    nombre: nombre.value.trim(),
    precio: Number(precio.value)
  };
  try {
    const res = await fetch(`${API}/productos`, {
      method: "POST",
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Error ${res.status}`);
    }
    nombre.value = ""; precio.value = "";
    await cargar();
    msg.textContent = "Creado";
  } catch (err) {
    msg.textContent = err.message;
  }
});

tb.addEventListener("click", async (e) => {
  const btn = e.target.closest(".del");
  if (!btn) return;
  const id = btn.dataset.id;
  const ok = confirm(`Eliminar producto #${id}?`);
  if (!ok) return;
  const res = await fetch(`${API}/productos/${id}`, { method: "DELETE" });
  if (res.status === 204) {
    await cargar();
  } else {
    const err = await res.json().catch(() => ({}));
    alert(err.error || `Error ${res.status}`);
  }
});

cargar();
