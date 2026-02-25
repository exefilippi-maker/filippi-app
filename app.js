const URL = "https://opensheet.elk.sh/1RhPGwK8Rq0Y8_g1S2X67qQm4c2ZUMPG4YibIai_XXxY/Filippiautos";

fetch(URL)
  .then(res => res.json())
  .then(data => {
    const contenedor = document.querySelector(".autos");
    contenedor.innerHTML = "";

    data.forEach(auto => {
      contenedor.innerHTML += `
        <div class="card">
          <img src="${auto.IMAGEN}?v=${Date.now()}" alt="Auto" style="width:100%; height:200px; object-fit:cover;">
          <h2>${auto["MARCA-MODELO"]}</h2>
          <p>Año: ${auto.AÑO}</p>
          <p>KMs: ${auto.KILOMETRAJE}</p>
          <p class="precio">$${auto.PRECIO}</p>
          <button onclick="consultar('${auto["MARCA-MODELO"]}')">Consultar</button>
        </div>
      `;
    });
  });

function consultar(modelo) {
  const numero = "549381XXXXXXX"; // tu número
  const mensaje = `Hola, consulto por el ${modelo}`;
  window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`);
}