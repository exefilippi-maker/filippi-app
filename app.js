const URL = "https://opensheet.elk.sh/1RhPGwK8Rq0Y8_g1S2X67qQm4c2ZUMPG4YibIai_XXxY/Filippiautos";

let autosGlobal = [];

fetch(URL)
  .then(res => res.json())
  .then(data => {
    autosGlobal = data;
    mostrarAutos(data);
  });

function mostrarAutos(lista) {
  const contenedor = document.getElementById("autos");
  contenedor.innerHTML = "";

  lista.forEach(auto => {
    contenedor.innerHTML += `
      <div class="card" onclick="verDetalle('${auto["MARCA-MODELO"]}', '${auto.AÑO}', '${auto.KILOMETRAJE}', '${auto.PRECIO}', '${auto.IMAGEN}')">
        <img src="${auto.IMAGEN}" alt="Auto" style="width:100%; height:200px; object-fit:cover;">
        <h2>${auto["MARCA-MODELO"]}</h2>
        <p>Año: ${auto.AÑO}</p>
        <p>KMs: ${auto.KILOMETRAJE}</p>
        <p class="precio">$${auto.PRECIO}</p>
        <button onclick="consultar('${auto["MARCA-MODELO"]}')">Consultar</button>
      </div>
    `;
  });
}

function filtrarAutos() {
  const texto = document.getElementById("buscador").value.toLowerCase();

  const filtrados = autosGlobal.filter(auto =>
    auto["MARCA-MODELO"].toLowerCase().includes(texto)
  );

  mostrarAutos(filtrados);
}

function consultar(modelo) {
  const mensaje = `Hola, consulto por el ${modelo}`;
  const url = `https://api.whatsapp.com/send?phone=543812082314&text=${encodeURIComponent(mensaje)}`;
  window.open(url, "_blank");
}
function verDetalle(modelo, anio, km, precio, imagen) {
  const url = `detalle.html?modelo=${encodeURIComponent(modelo)}&anio=${anio}&km=${km}&precio=${precio}&imagen=${encodeURIComponent(imagen)}`;
  window.location.href = url;
}