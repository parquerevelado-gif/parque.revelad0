const urlCSV = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRBo8Pv60vdGp_trawO9-sPbPqT-SAsdb29F7iPiHmvVvx62qpbNCzJxu4g4nZlNcpRv0A-fUvz5n4U/pub?gid=323684883&single=true&output=csv';

$(document).ready(function () {
  const $fondo = $(".ripple-bg");
  const $contenedor = $("#recuerdos-container");

  // Detectar si el dispositivo es táctil
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // Intentar inicializar ripple (ignorar si falla)
  try {
    $fondo.ripples({
      resolution: 128,
      dropRadius: 20,
      perturbance: 0.02,
      interactive: true
    });
  } catch (e) {
    console.warn("Ripples no soportado. Se ignora.");
  }

  let fotos = [];
  let pool = [];

  // Función para mostrar una imagen
  function mostrarImagen(e) {
    if (pool.length === 0) pool = fotos.slice().sort(() => Math.random() - 0.5);
    const nextFoto = pool.pop();

    const x = e.clientX || e.originalEvent.touches[0].clientX;
    const y = e.clientY || e.originalEvent.touches[0].clientY;

    const img = $("<img>")
      .addClass("recuerdo-img")
      .attr("src", nextFoto)
      .css({
        left: x - 100 + "px",
        top: y - 75 + "px"
      });
    $contenedor.append(img);
  }

  // Cargar CSV
  fetch(urlCSV)
    .then(res => res.text())
    .then(csvText => {
      fotos = csvText.trim().split('\n');
      pool = fotos.slice().sort(() => Math.random() - 0.5);

      // Registrar eventos según tipo de dispositivo
      if (isTouchDevice) {
        $fondo.on("touchstart", function(e) {
          e.preventDefault(); // evita que también se dispare click
          mostrarImagen(e);
        });
      } else {
        $fondo.on("click", function(e) {
          mostrarImagen(e);
        });
      }

      // Botón borrar recuerdos
      $("#borrar-recuerdos").on("click", function () {
        $(".recuerdo-img").each(function () {
          const $img = $(this);
          $img.addClass("fade-out");
          setTimeout(() => { $img.remove(); }, 1000);
        });
        pool = fotos.slice().sort(() => Math.random() - 0.5);
      });
    })
    .catch(err => console.error("Error al cargar las fotos:", err));
});
