const urlCSV = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRBo8Pv60vdGp_trawO9-sPbPqT-SAsdb29F7iPiHmvVvx62qpbNCzJxu4g4nZlNcpRv0A-fUvz5n4U/pub?gid=323684883&single=true&output=csv';

$(document).ready(function () {
  const $fondo = $(".ripple-bg");
  const $contenedor = $("#recuerdos-container");

  // Iniciar efecto ripple en quieto
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

  // Cargar CSV desde Google Sheets
  fetch(urlCSV)
    .then(res => res.text())
    .then(csvText => {
      // Cada fila del CSV es una URL de imagen
      const fotos = csvText.trim().split('\n');

      // Pool barajado de imágenes
      let pool = fotos.slice().sort(() => Math.random() - 0.5);

      function siguienteFoto() {
        if (pool.length === 0) {
          pool = fotos.slice().sort(() => Math.random() - 0.5);
        }
        return pool.pop();
      }

      // Al hacer click en el fondo -> aparece imagen
      $fondo.on("click", function (e) {
        activarMovimiento();

        const nextFoto = siguienteFoto();

        const img = $("<img>")
          .addClass("recuerdo-img")
          .attr("src", nextFoto)
          .css({
            left: e.clientX - 100 + "px",
            top: e.clientY - 75 + "px"
          });

        $contenedor.append(img);
      });

      // Movimiento activa el ripple
      $fondo.on("mousemove", activarMovimiento);

      // Botón para borrar recuerdos
      $("#borrar-recuerdos").on("click", function () {
        $(".recuerdo-img").each(function () {
          const $img = $(this);
          $img.addClass("fade-out");

          // Eliminar luego de la animación
          setTimeout(() => {
            $img.remove();
          }, 1000);
        });

        // Reiniciar el pool para nueva ronda
        pool = fotos.slice().sort(() => Math.random() - 0.5);
      });
    })
    .catch(err => {
      console.error("Error al cargar las fotos:", err);
    });
});

