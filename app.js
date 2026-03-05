// 🔗 URL de tu Google Sheets
const URL = "https://opensheet.elk.sh/1RhPGwK8Rq0Y8_g1S2X67qQm4c2ZUMPG4YibIai_XXxY/Filippiautos";

// 🚗 Cargar autos
async function cargarAutos() {
  const res = await fetch(URL);
  const data = await res.json();

  // 👀 agregar vistas a cada auto
  const autosConVistas = await Promise.all(
    data.map(async (auto) => {
      try {
        const resp = await fetch(`https://api.countapi.xyz/get/filippi/${encodeURIComponent(auto["MARCA-MODELO"])}`);
        const json = await resp.json();
        return { ...auto, vistas: json.value || 0 };
      } catch {
        return { ...auto, vistas: 0 };
      }
    })
  );

  // 🔥 ordenar por más vistos
  autosConVistas.sort((a, b) => b.vistas - a.vistas);

  mostrarAutos(autosConVistas);
}

// 🎨 Mostrar autos
function mostrarAutos(autos) {
  const contenedor = document.getElementById("autos");
  contenedor.innerHTML = "";
document.getElementById("contadorAutos").innerText =
"🚗 " + autos.length + " autos disponibles";
  autos.forEach((auto, index) => {
    const destacado = index < 3 ? "🔥 DESTACADO" : "";

    // 🧼 limpiar datos (evita errores)
    const modelo = auto["MARCA-MODELO"] || "";
    const anio = auto.AÑO || "";
    const km = auto.KILOMETRAJE || "";
    const precio = (auto.PRECIO || "").toString().replace(/\s/g, "");
    const imagen = auto.IMAGEN || "";
    const financiacion = auto.FINANCIACION || "NO";
    const permuta = auto.PERMUTA || "NO";

    contenedor.innerHTML += `
      <div class="card">
        <img src="${imagen}" style="width:100%; height:200px; object-fit:cover;">
        
        <h2>${modelo}</h2>
        <p>${destacado}</p>
        <p>👀 ${auto.vistas} vistas</p>

        <p>📅 Año: ${anio}</p>
        <p>🛣️ ${km} km</p>
        <p class="precio">$${precio}</p>

        <button onclick="verDetalle(
          '${modelo}',
          '${anio}',
          '${km}',
          '${precio}',
          '${imagen}',
          '${financiacion}',
          '${permuta}'
        )">
          Ver más
        </button>
      </div>
    `;
  });
}

// 🔗 Ir a detalle (FIX TOTAL)
function verDetalle(modelo, anio, km, precio, imagen, financiacion, permuta) {

  const url = `detalle.html?modelo=${encodeURIComponent(modelo)}&anio=${encodeURIComponent(anio)}&km=${encodeURIComponent(km)}&precio=${encodeURIComponent(precio)}&imagen=${encodeURIComponent(imagen)}&financiacion=${encodeURIComponent(financiacion)}&permuta=${encodeURIComponent(permuta)}`;

  window.location.href = url;
}

// 🔎 Buscador
function filtrarAutos() {
  const input = document.getElementById("buscador").value.toLowerCase();
  const cards = document.querySelectorAll(".card");

  cards.forEach(card => {
    const texto = card.innerText.toLowerCase();
    card.style.display = texto.includes(input) ? "block" : "none";
  });
}

// 🚀 iniciar app
cargarAutos();