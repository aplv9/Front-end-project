import { products } from "./products.js";

window.onload = function () {

  // Inicio PPAL

  // Obtener elementos del DOM
  const modal = document.getElementById("contactModal");
  const openModalBtn = document.getElementById("openModalBtn");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const cardContainerRow = document.getElementsByClassName("row")[0];

  // Funciones modal:
  // Función para abrir el modal
  openModalBtn.addEventListener("click", function () {
    modal.style.display = "flex";
  });

  // Función para cerrar el modal
  closeModalBtn.addEventListener("click", function () {
    modal.style.display = "none";
  });

  // Cerrar el modal si se hace clic fuera de él
  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  // Mostrar las tarjetas
  showCards(products, cardContainerRow);

  // Fin PPAL

  // Funciones para las tarjetas:
  // Función para generar las tarjetas
  function generateCard(product) {
    let card = `
                <div class="card" style="width: 200px">
                <img src=${product.image} class="card-img-top" alt="Imagen del producto" />
                <div class="card-body">
                    <h5 class="card-title">${product.title}</h5>
                    <p class="card-text">${product.description}</p>
                    <p class="card-text"><strong>Precio:</strong> ${product.price}</p>
                </div>
                <div class="card-footer">
                    <div data-tooltip="Add to car" class="button">
                        <div class="button-wrapper">
                            <div class="text">Buy Now</div>
                            <span class="icon">
                                <svg viewBox="0 0 16 16" class="bi bi-cart2" fill="currentColor" height="16" width="16"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5zM3.14 5l1.25 5h8.22l1.25-5H3.14zM5 13a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0z">
                                    </path>
                                </svg>
                            </span>
                        </div>
                    </div>
                </div>
            </div>`;
    return card;
  }

  // Función para mostrar las tarjetas
  function showCards(products, cardContainerRow) {
    let cards = "";
    products.forEach(product => {
      cards += generateCard(product);
    });
    cardContainerRow.innerHTML = cards;
  }
}
