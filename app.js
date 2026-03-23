const URL_SHEETS = "https://opensheet.elk.sh/1RhPGwK8Rq0Y8_g1S2X67qQm4c2ZUMPG4YibIai_XXxY/Filippiautos";

let todosLosAutos = [];

// ─── CARGA ───────────────────────────────────────────────
async function cargarAutos() {
  mostrarSkeleton();

  try {
    const res = await fetch(URL_SHEETS);
    if (!res.ok) throw new Error("Error al cargar");

    const autos = await res.json();
    todosLosAutos = autos;
    mostrarAutos(autos);

  } catch (err) {
    mostrarError();
  }
}

// ─── SKELETON LOADER ─────────────────────────────────────
function mostrarSkeleton() {
  const contenedor = document.getElementById("autos");
  contenedor.innerHTML = "";

  for (let i = 0; i < 6; i++) {
    const sk = document.createElement("div");
    sk.className = "card skeleton";
    sk.innerHTML = `
      <div class="sk-img"></div>
      <div class="sk-line sk-title"></div>
      <div class="sk-line sk-short"></div>
      <div class="sk-line sk-short"></div>
      <div class="sk-line sk-price"></div>
      <div class="sk-line sk-btn"></div>
    `;
    contenedor.appendChild(sk);
  }
}

// ─── ERROR ───────────────────────────────────────────────
function mostrarError() {
  const contenedor = document.getElementById("autos");
  contenedor.innerHTML = `
    <div class="mensaje-error">
      <p>😕 No pudimos cargar los autos.</p>
      <p>Revisá tu conexión e intentá de nuevo.</p>
      <button onclick="cargarAutos()">Reintentar</button>
    </div>
  `;
}

// ─── MOSTRAR AUTOS ────────────────────────────────────────
function mostrarAutos(autos) {
  const contenedor = document.getElementById("autos");
  contenedor.innerHTML = "";

  actualizarContador(autos.length, todosLosAutos.length);

  if (autos.length === 0) {
    contenedor.innerHTML = `
      <div class="mensaje-vacio">
        <p>🔍 No encontramos autos con ese nombre.</p>
      </div>
    `;
    return;
  }

  autos.forEach(auto => {
    const modelo      = auto["MARCA-MODELO"]  || "";
    const anio        = auto["AÑO"]           || "";
    const km          = auto["KILOMETRAJE"]   || "";
    const precio      = auto["PRECIO"]        || "";
    const imagen      = auto["IMAGEN"]        || "";
    const imagenes    = auto["IMAGENES"]      || "";
    const financiacion = auto["FINANCIACION"] || "NO";
    const permuta     = auto["PERMUTA"]       || "NO";

    // Formateo de números
    const precioFormateado = precio
  ? "$" + Number(precio.replace(/\./g, "")).toLocaleString("es-AR")
  : "Consultar precio";
    const kmFormateado = km
      ? Number(km).toLocaleString("es-AR") + " km"
      : "";

    // Crear el elemento sin innerHTML para evitar inyección
    const card = document.createElement("div");
    card.className = "card";

    const img = document.createElement("img");
    img.src = imagen;
    img.alt = modelo;
    img.loading = "lazy";

    const h2 = document.createElement("h2");
    h2.textContent = modelo;

    const pAnio = document.createElement("p");
    pAnio.textContent = "📅 Año: " + anio;

    const pKm = document.createElement("p");
    pKm.textContent = "🛣️ " + kmFormateado;

    const pPrecio = document.createElement("p");
    pPrecio.className = "precio";
    pPrecio.textContent = precioFormateado;

    const btn = document.createElement("button");
    btn.textContent = "Ver más";

    // Datos en dataset para evitar problemas con caracteres especiales en onclick
    card.dataset.modelo      = modelo;
    card.dataset.anio        = anio;
    card.dataset.km          = km;
    card.dataset.precio      = precio;
    card.dataset.imagen      = imagen;
    card.dataset.imagenes    = imagenes;
    card.dataset.financiacion = financiacion;
    card.dataset.permuta     = permuta;

    btn.addEventListener("click", () => {
      const d = card.dataset;
      verDetalle(d.modelo, d.anio, d.km, d.precio, d.imagen, d.imagenes, d.financiacion, d.permuta);
    });

    card.appendChild(img);
    card.appendChild(h2);
    card.appendChild(pAnio);
    card.appendChild(pKm);
    card.appendChild(pPrecio);
    card.appendChild(btn);
    contenedor.appendChild(card);
  });
}

// ─── CONTADOR ────────────────────────────────────────────
function actualizarContador(visibles, total) {
  let contador = document.getElementById("contadorAutos");
  if (!contador) return;

  if (visibles === total) {
    contador.textContent = total + " autos disponibles";
  } else {
    contador.textContent = "Mostrando " + visibles + " de " + total;
  }
}

// ─── DETALLE ─────────────────────────────────────────────
function verDetalle(modelo, anio, km, precio, imagen, imagenes, financiacion, permuta) {
  const params = new URLSearchParams({
    modelo,
    anio,
    km,
    precio,
    imagen,
    imagenes,
    financiacion,
    permuta
  });

  window.location.href = "detalle.html?" + params.toString();
}

// ─── FILTRO ──────────────────────────────────────────────
function filtrarAutos() {
  const input = document.getElementById("buscador").value.toLowerCase().trim();

  const filtrados = todosLosAutos.filter(auto => {
    const modelo = (auto["MARCA-MODELO"] || "").toLowerCase();
    const anio   = (auto["AÑO"]          || "").toLowerCase();
    return modelo.includes(input) || anio.includes(input);
  });

  mostrarAutos(filtrados);
}

// ─── INIT ────────────────────────────────────────────────
cargarAutos();