const urlCSV = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSSSez9h2cXtIeyHfzeUgHGkPYoM6CVPagA11PH39ZM4m7ieT5UwpXPuAKcM08OWYp1FDvSFKabR7na/pub?output=csv';

$(document).ready(function () {
  $('.ripple-bg').ripples({
    resolution: 128,
    perturbance: 0.03,
    dropRadius: 20,
    interactive: true
  });

  let fotos = [];
  let fotosDisponibles = [];

  function limpiarLista(lista) {
    const set = new Set();
    lista.forEach(item => {
      const trimmed = item.trim();
      if(trimmed) set.add(trimmed);
    });
    return Array.from(set);
  }

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  function resetFotosDisponibles() {
    fotosDisponibles = [...fotos];
    shuffleArray(fotosDisponibles);
    console.log('Fotos disponibles reseteadas, total:', fotosDisponibles.length);
  }

  fetch(urlCSV)
    .then(res => res.text())
    .then(csvText => {
      fotos = limpiarLista(csvText.split('\n'));
      resetFotosDisponibles();

      const $contenedor = $("#recuerdos-container");
      const $fondo = $(".ripple-bg");

      $fondo.on("click", function (e) {
        if(fotosDisponibles.length === 0) {
          resetFotosDisponibles();
          console.log('Lista vacía, reseteando...');
        }

        const imgSrc = fotosDisponibles.shift();
        console.log('Mostrando imagen:', imgSrc, 'quedan', fotosDisponibles.length);

        const img = $("<img>")
          .addClass("recuerdo-img")
          .attr("src", imgSrc)
          .css({
            left: e.clientX - 100 + "px",
            top: e.clientY - 75 + "px",
            position: "absolute",
            pointerEvents: "none",
            zIndex: 2
          });
        $contenedor.append(img);
      });

      $("#borrar-recuerdos").on("click", function () {
        $contenedor.empty();
      });
    })
    .catch(err => {
      console.error("Error al cargar las fotos:", err);
    });
});
