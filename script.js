const urlCSV = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRBo8Pv60vdGp_trawO9-sPbPqT-SAsdb29F7iPiHmvVvx62qpbNCzJxu4g4nZlNcpRv0A-fUvz5n4U/pub?gid=323684883&single=true&output=csv';

$(document).ready(function () {
  const $fondo = $(".ripple-bg");
  const $contenedor = $("#recuerdos-container");

  // Detectar móvil
  const isMobile = window.innerWidth <= 768;

  // Configuración de ripples según dispositivo
  const rippleOptions = isMobile
    ? { resolution: 256, dropRadius: 15, perturbance: 0.03, interactive: true }
    : { resolution: 128, dropRadius: 20, perturbance: 0.02, interactive: true };

  // Iniciar efecto ripple
  $fondo.ripples(rippleOptions);

  let fadeTimer;

  function activarMovimiento() {
    clearTimeout(fadeTimer);
    $fondo.ripples('set', 'perturbance', rippleOptions.perturbance);

    fadeTimer = setTimeout(() => {
      let steps = 14;
      let interval = 350;
      let actual = 0;

      const fade = setInterval(() => {
        // Nunca baja a 0 → mantiene micro-movimiento
        let value = rippleOptions.perturbance - (rippleOptions.perturbance / steps) * actual;
        $fondo.ripples('set', 'perturbance', Math.max(isMobile ? 0.005 : 0.0025, value));
        actual++;
        if (actual > steps) clearInterval(fade);
      }, interval);
    }, 2000);
  }

  // Cargar CSV desde Google Sheets
  fetch(urlCSV)
    .then(res => res.text())
    .then(csvText => {
      const fotos = csvText.trim().split('\n');
      let pool = fotos.slice().sort(() => Math.random() - 0.5);

      function siguienteFoto() {
        if (pool.length === 0) {
          pool = fotos.slice().sort(() => Math.random() - 0.5);
        }
        return pool.pop();
      }

      // Click → aparece imagen
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




