$(document).ready(function () {
  $('.ripple-bg').ripples({
    resolution: 128,
    perturbance: 0.03,
    dropRadius: 20,
    interactive: true
  });
});

const fotos = [
  "https://picsum.photos/id/1015/200/150",
  "https://picsum.photos/id/1025/200/150",
  "https://picsum.photos/id/1035/200/150",
  "https://picsum.photos/id/1050/200/150",
  "https://picsum.photos/id/1060/200/150"
];

document.querySelector(".ripple-bg").addEventListener("click", function (e) {
  const contenedor = document.getElementById("recuerdos-container");
  const img = document.createElement("img");
  img.classList.add("recuerdo-img");
  const random = fotos[Math.floor(Math.random() * fotos.length)];
  img.src = random;
  const x = e.clientX;
  const y = e.clientY;
  img.style.left = `${x - 100}px`;
  img.style.top = `${y - 75}px`;
  contenedor.appendChild(img);
});

document.getElementById("borrar-recuerdos").addEventListener("click", function () {
  const contenedor = document.getElementById("recuerdos-container");
  contenedor.innerHTML = "";
});
