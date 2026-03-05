// URL de Google Sheets
const URL = "https://opensheet.elk.sh/1RhPGwK8Rq0Y8_g1S2X67qQm4c2ZUMPG4YibIai_XXxY/Filippiautos";

async function cargarAutos(){

  const res = await fetch(URL);
  const autos = await res.json();

  mostrarAutos(autos);

}

function mostrarAutos(autos){

  const contenedor = document.getElementById("autos");
  contenedor.innerHTML = "";

  autos.forEach(auto => {

    const modelo = auto["MARCA-MODELO"] || "";
    const anio = auto["AÑO"] || "";
    const km = auto["KILOMETRAJE"] || "";
    const precio = auto["PRECIO"] || "";
    const imagen = auto["IMAGEN"] || "";
    const financiacion = auto["FINANCIACION"] || "NO";
    const permuta = auto["PERMUTA"] || "NO";

    contenedor.innerHTML += `
      <div class="card">

        <img src="${imagen}" style="width:100%; height:200px; object-fit:cover;">

        <h2>${modelo}</h2>

        <p>📅 Año: ${anio}</p>
        <p>🛣️ ${km} km</p>
        <p class="precio">$${precio}</p>

        <button onclick="verDetalle('${modelo}','${anio}','${km}','${precio}','${imagen}','${financiacion}','${permuta}')">
        Ver más
        </button>

      </div>
    `;

  });

}

function verDetalle(modelo,anio,km,precio,imagen,financiacion,permuta){

  const url = `detalle.html?modelo=${encodeURIComponent(modelo)}&anio=${encodeURIComponent(anio)}&km=${encodeURIComponent(km)}&precio=${encodeURIComponent(precio)}&imagen=${encodeURIComponent(imagen)}&financiacion=${encodeURIComponent(financiacion)}&permuta=${encodeURIComponent(permuta)}`;

  window.location.href = url;

}

function filtrarAutos(){

  const input = document.getElementById("buscador").value.toLowerCase();
  const cards = document.querySelectorAll(".card");

  cards.forEach(card => {

    const texto = card.innerText.toLowerCase();
    card.style.display = texto.includes(input) ? "block" : "none";

  });

}

cargarAutos();