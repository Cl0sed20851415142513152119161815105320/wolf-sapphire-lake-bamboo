let draft = loadConfig();
const root = document.getElementById("editor");
function field(label, value, key) {
  return `<label>${label}<input data-key="${key}" value="${String(value).replace(/"/g, """)}" /></label>`;
}
function render() {
  root.innerHTML = `
    <section class="card">
      <h2>Store</h2>
      <div class="grid2">
        ${field("Name", draft.name, "name")}
        ${field("Cash App tag", draft.cashtag, "cashtag")}
        ${field("TikTok handle", draft.tiktok, "tiktok")}
        ${field("Tagline", draft.tagline, "tagline")}
      </div>
    </section>
    <div class="row between"><h2>Products</h2><button type="button" id="add">Add tool</button></div>
    ${draft.products.map((p, i) => `
      <article class="card" data-i="${i}">
        <div class="grid2">
          <label>Name<input data-p="name" value="${p.name.replace(/"/g, """)}" /></label>
          <label>Price<input data-p="price" type="number" step="0.01" value="${p.price}" /></label>
          <label>Badge<input data-p="tag" value="${(p.tag || "").replace(/"/g, """)}" /></label>
        </div>
        <label>Description<textarea data-p="description">${p.description}</textarea></label>
        <button type="button" data-remove="${i}">Remove</button>
      </article>`).join("")}
    <div class="row">
      <button type="button" id="save">Save changes</button>
      <button type="button" id="reset" class="ghost">Reset defaults</button>
      <span id="msg" class="muted"></span>
    </div>`;
  root.querySelectorAll("[data-key]").forEach((el) => {
    el.oninput = () => { draft[el.dataset.key] = el.value; };
  });
  root.querySelectorAll("[data-i]").forEach((card) => {
    const i = Number(card.dataset.i);
    card.querySelectorAll("[data-p]").forEach((el) => {
      el.oninput = () => {
        draft.products[i][el.dataset.p] = el.dataset.p === "price" ? Number(el.value) || 0 : el.value;
      };
    });
  });
  root.querySelector("#add").onclick = () => {
    draft.products.push({ id: "tool-" + Date.now().toString(36), name: "New tool", description: "What buyers get.", price: 9.99, tag: "" });
    render();
  };
  root.querySelectorAll("[data-remove]").forEach((btn) => {
    btn.onclick = () => { draft.products.splice(Number(btn.dataset.remove), 1); render(); };
  });
  root.querySelector("#save").onclick = () => { saveConfig(draft); root.querySelector("#msg").textContent = "Saved. Open the shop."; };
  root.querySelector("#reset").onclick = () => { localStorage.removeItem(KEY); draft = loadConfig(); render(); };
}
render();
