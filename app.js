const URL = "https://opensheet.elk.sh/1RhPGwK8Rq0Y8_g1S2X67qQm4c2ZUMPG4YibIai_XXxY/Filippiautos";

async function cargarAutos() {
  const res = await fetch(URL);
  const data = await res.json();

  // 🔥 agregar vistas a cada auto
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

  // 🔥 ordenar por vistas (de mayor a menor)
  autosConVistas.sort((a, b) => b.vistas - a.vistas);

  mostrarAutos(autosConVistas);
}

function mostrarAutos(autos) {
  const contenedor = document.getElementById("autos");
  contenedor.innerHTML = "";

  autos.forEach((auto, index) => {
    const destacado = index < 3 ? "🔥 DESTACADO" : "";

    contenedor.innerHTML += `
      <div class="card">
        <img src="${auto.IMAGEN}" style="width:100%; height:200px; object-fit:cover;">
        
        <h2>${auto["MARCA-MODELO"]}</h2>
        <p>${destacado}</p>
        <p>👀 ${auto.vistas} vistas</p>

        <p>Año: ${auto.AÑO}</p>
        <p>KMs: ${auto.KILOMETRAJE}</p>
        <p class="precio">$${auto.PRECIO}</p>

        <button onclick="verDetalle('${auto["MARCA-MODELO"]}', '${auto.AÑO}', '${auto.KILOMETRAJE}', '${auto.PRECIO}', '${auto.IMAGEN}')">
          Ver más
        </button>
      </div>
    `;
  });
}

function verDetalle(modelo, anio, km, precio, imagen) {
  window.location.href = `detalle.html?modelo=${encodeURIComponent(modelo)}&anio=${anio}&km=${km}&precio=${precio}&imagen=${encodeURIComponent(imagen)}`;
}

// iniciar
cargarAutos();