const config = loadConfig();
let cart = [];
const $ = (id) => document.getElementById(id);
$("shopName").textContent = config.name;
$("mark").textContent = config.name.slice(0, 1).toUpperCase();
$("tagline").textContent = config.tagline;
$("tagLineSmall").textContent = "$" + cleanTag(config.cashtag);
$("tiktok").href = "https://www.tiktok.com/@" + cleanHandle(config.tiktok);
$("tiktokText").href = $("tiktok").href;
$("tiktokText").textContent = "@" + cleanHandle(config.tiktok);
$("cashLink").href = "https://cash.app/$" + cleanTag(config.cashtag);
$("payNow").href = $("cashLink").href;
$("cashTag").textContent = "$" + cleanTag(config.cashtag);
$("foot").textContent = config.name + " · pay with Cash App";

$("grid").innerHTML = config.products.map((p) => `
  <article class="card">
    ${p.tag ? `<span class="badge">${p.tag}</span>` : ""}
    <h2>${p.name}</h2>
    <p>${p.description}</p>
    <div class="row between">
      <b class="price">${money(p.price)}</b>
      <button type="button" data-add="${p.id}">Add</button>
    </div>
  </article>`).join("");

function paint() {
  const n = cart.reduce((s, l) => s + l.qty, 0);
  $("count").textContent = n ? String(n) : "";
  const lines = cart.map((l) => ({ ...l, product: config.products.find((p) => p.id === l.id) })).filter((l) => l.product);
  const total = lines.reduce((s, l) => s + l.product.price * l.qty, 0);
  $("total").textContent = money(total);
  $("lines").innerHTML = lines.length ? lines.map((l) => `
    <div class="line">
      <span>${l.product.name} × ${l.qty}</span>
      <span>
        <button type="button" data-q="${l.id}" data-d="-1">-</button>
        <button type="button" data-q="${l.id}" data-d="1">+</button>
      </span>
    </div>`).join("") : "<p class='muted'>Nothing here yet.</p>";
  $("summary").innerHTML = lines.map((l) => `<div class="row between"><span>${l.product.name} × ${l.qty}</span><span>${money(l.product.price * l.qty)}</span></div>`).join("")
    + `<div class="row between"><b>Due</b><b>${money(total)}</b></div>`;
  $("toCheckout").disabled = !lines.length;
}
document.body.addEventListener("click", (e) => {
  const add = e.target.closest("[data-add]");
  if (add) {
    const id = add.dataset.add;
    const hit = cart.find((l) => l.id === id);
    if (hit) hit.qty += 1; else cart.push({ id, qty: 1 });
    paint();
  }
  const q = e.target.closest("[data-q]");
  if (q) {
    const line = cart.find((l) => l.id === q.dataset.q);
    line.qty += Number(q.dataset.d);
    cart = cart.filter((l) => l.qty > 0);
    paint();
  }
});
$("openCart").onclick = () => $("cart").classList.remove("hidden");
$("closeCart").onclick = () => $("cart").classList.add("hidden");
$("toCheckout").onclick = () => { $("cart").classList.add("hidden"); $("checkout").classList.remove("hidden"); };
$("closeCheck").onclick = () => $("checkout").classList.add("hidden");
$("place").onclick = () => {
  const name = $("buyer").value.trim();
  const email = $("email").value.trim();
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
  const lines = cart.map((l) => ({ ...l, product: config.products.find((p) => p.id === l.id) })).filter((l) => l.product);
  const total = lines.reduce((s, l) => s + l.product.price * l.qty, 0);
  const id = "TV-" + Date.now().toString(36).toUpperCase();
  $("oid").textContent = id;
  $("doneText").textContent = "Send " + money(total) + " to $" + cleanTag(config.cashtag) + " and put " + id + " in the note. Delivery goes to " + email + ".";
  cart = [];
  paint();
  $("checkout").classList.add("hidden");
  $("done").classList.remove("hidden");
};
$("closeDone").onclick = () => $("done").classList.add("hidden");
paint();
