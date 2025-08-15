const urlCSV = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRBo8Pv60vdGp_trawO9-sPbPqT-SAsdb29F7iPiHmvVvx62qpbNCzJxu4g4nZlNcpRv0A-fUvz5n4U/pub?gid=323684883&single=true&output=csv';

$(document).ready(function () {
  const $fondo = $(".ripple-bg");
  const $contenedor = $("#recuerdos-container");

  // Iniciar en quieto
  $fondo.ripples({
    resolution: 128,
    dropRadius: 20,
    perturbance: 0,
    interactive: true
  });

  let fadeTimer;

  function activarMovimiento() {
    clearTimeout(fadeTimer);
    $fondo.ripples('set', 'perturbance', 0.015);

    fadeTimer = setTimeout(() => {
      let steps = 14;
      let interval = 350;
      let actual = 0;

      const fade = setInterval(() => {
        let value = 0.015 - (0.015 / steps) * actual;
        $fondo.ripples('set', 'perturbance', Math.max(0, value));
        actual++;
        if (actual > steps) clearInterval(fade);
      }, interval);
    }, 2000);
  }

  fetch(urlCSV)
    .then(res => res.text())
    .then(csvText => {
      const fotos = csvText.trim().split('\n');

      $fondo.on("click", function (e) {
        activarMovimiento();

        const img = $("<img>")
          .addClass("recuerdo-img")
          .attr("src", fotos[Math.floor(Math.random() * fotos.length)])
          .css({
            left: e.clientX - 100 + "px",
            top: e.clientY - 75 + "px"
          });

        $contenedor.append(img);
      });

      $fondo.on("mousemove", activarMovimiento);

      $("#borrar-recuerdos").on("click", function () {
        $(".recuerdo-img").each(function () {
          const $img = $(this);
          $img.addClass("fade-out");

          // Eliminar luego de la animación de salida
          setTimeout(() => {
            $img.remove();
          }, 1000);
        });
      });
    })
    .catch(err => {
      console.error("Error al cargar las fotos:", err);
    });
});
