
import { products } from "./products.js";

// Inserta tu clave de API aquí
const apiKey = 'ec3e419fe49c4abfa8b13700243112';
const city = 'Buenos Aires';  // Cambia esto a la ciudad que deseas mostrar


window.onload = () => {
  // Obtener elementos del DOM
  const elements = getDOMElements();
  const carritoModal = new bootstrap.Modal(elements.carritoModalElement);

  // Configurar eventos
  setupModalEvents(elements.modal, elements.openModalBtn, elements.closeModalBtn);
  setupShoppingCartEvent(elements.shoppingCart, carritoModal);
  renderProductCards(products, elements.cardContainerRow);

  // Configurar eventos en botones de tarjetas
  setupProductCardEvents(elements.cardContainerRow);

  obtenerClima();
};

  // Función para obtener el clima
  async function obtenerClima() {
    const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&lang=es`;
    try {
      const response = await fetch(url);
      if (response == null){
        alert('api no responde')
      }

      const data = await response.json();
      // Accede a los datos y muestra el clima
      let temperatura = data.current.heatindex_c;
      let icono = data.current.condition.icon;
      let humedad = data.current.humidity;
      
      console.log(temperatura,icono,humedad);
      document.getElementById('clima').innerHTML = `
        <p><strong>${city}</strong>: ${temperatura}°C </p>
      `;
    } catch (error) {
      console.error('Error al obtener el clima:', error);
      document.getElementById('clima').innerHTML = `<p>No se pudo obtener el clima.</p>`;
    }
  }

// Obtener elementos del DOM
function getDOMElements() {
  return {
    modal: document.getElementById("contactModal"),
    openModalBtn: document.getElementById("openModalBtn"),
    closeModalBtn: document.getElementById("closeModalBtn"),
    carritoModalElement: document.getElementById("carritoModal"),
    carritoTabla: document.getElementById("carritoTabla"),
    totalElement: document.getElementById("total"),
    cardContainerRow: document.getElementsByClassName("row")[0],
    shoppingCart: document.getElementsByClassName("cart-link")[0],
  };
}

// Configurar eventos del modal
function setupModalEvents(modal, openModalBtn, closeModalBtn) {
  openModalBtn.addEventListener("click", () => {
    modal.style.display = "flex";
  });

  closeModalBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
}

// Renderizar tarjetas de productos
function renderProductCards(products, cardContainerRow) {
  cardContainerRow.innerHTML = products.map(generateCard).join("");
}

// Generar HTML de una tarjeta de producto
function generateCard(product) {
  return `
    <div class="card" style="width: 200px">
      <img src="${product.image}" class="card-img-top" alt="Imagen del producto" />
      <div class="card-body">
        <h5 class="card-title">${product.title}</h5>
        <p class="card-text">${product.description}</p>
        <p class="card-text"><strong>Precio:</strong> ${product.price}</p>
      </div>
      <div class="card-footer">
        <div data-tooltip="Add to cart" class="button-cards">
          <div class="button-wrapper">
            <div class="text">Buy Now</div>
            <span class="icon">
              <svg viewBox="0 0 16 16" class="bi bi-cart2" fill="currentColor" height="16" width="16"
                  xmlns="http://www.w3.org/2000/svg">
                <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5zM3.14 5l1.25 5h8.22l1.25-5H3.14zM5 13a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0z">
                </path>
              </svg>
            </span>
          </div>
        </div>
      </div>
    </div>`;
}

// Configurar eventos en las tarjetas de producto
function setupProductCardEvents(cardContainerRow) {
  const buttons = cardContainerRow.querySelectorAll(".button-wrapper");
  buttons.forEach((button) => {
    button.addEventListener("click", () => addToShoppingCart(button));
  });
}

// Agregar producto al carrito
function addToShoppingCart(button) {
  const card = button.closest(".card");
  const title = card.querySelector(".card-title").textContent;
  const description = card.querySelector(".card-text").textContent;
  const priceText = card.querySelector(".card-text strong").nextSibling.textContent.trim();
  const price = parseFloat(priceText.replace(/[^\d.]/g, ""));

  const product = { title, description, price, quantity: 1 };
  let cart = JSON.parse(localStorage.getItem("shoppingCart")) || [];

  const existingProductIndex = cart.findIndex((p) => p.title === title);
  if (existingProductIndex > -1) {
    cart[existingProductIndex].quantity += 1;
  } else {
    cart.push(product);
  }

  localStorage.setItem("shoppingCart", JSON.stringify(cart));
}

// Configurar evento para mostrar el carrito
function setupShoppingCartEvent(shoppingCart, carritoModal) {
  shoppingCart.addEventListener("click", () => {
    mostrarCarrito();
    carritoModal.show();
  });
}

// Mostrar productos en el carrito
function mostrarCarrito() {
  const carritoTabla = document.getElementById("carritoTabla");
  const totalElement = document.getElementById("total");
  let cart = JSON.parse(localStorage.getItem("shoppingCart")) || [];
  carritoTabla.innerHTML = "";
  let total = 0;

  cart.forEach((product, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${product.title}</td>
      <td><input type="number" value="${product.quantity}" min="1" data-index="${index}" class="quantity-input" /></td>
      <td>$${(product.price * product.quantity).toFixed(2)}</td>
      <td><button class="btn btn-danger" data-index="${index}">Eliminar</button></td>
    `;
    carritoTabla.appendChild(row);
    total += product.price * product.quantity;
  });

  totalElement.textContent = total.toFixed(2);

  setupQuantityChangeEvents();
  setupDeleteProductEvents();
}

// Configurar eventos para cambiar cantidad en el carrito
function setupQuantityChangeEvents() {
  const quantityInputs = document.querySelectorAll(".quantity-input");
  quantityInputs.forEach((input) => {
    input.addEventListener("change", (event) => {
      const index = event.target.getAttribute("data-index");
      const newQuantity = Math.max(parseInt(event.target.value), 1);
      updateProductQuantity(index, newQuantity);
    });
  });
}

// Actualizar cantidad del producto en el carrito
function updateProductQuantity(index, newQuantity) {
  let cart = JSON.parse(localStorage.getItem("shoppingCart")) || [];
  cart[index].quantity = newQuantity;
  localStorage.setItem("shoppingCart", JSON.stringify(cart));
  mostrarCarrito();
}

// Configurar eventos para eliminar productos del carrito
function setupDeleteProductEvents() {
  const deleteButtons = document.querySelectorAll(".btn-danger");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const index = event.target.getAttribute("data-index");
      deleteProductFromCart(index);
    });
  });
}

// Eliminar producto del carrito
function deleteProductFromCart(index) {
  let cart = JSON.parse(localStorage.getItem("shoppingCart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("shoppingCart", JSON.stringify(cart));
  mostrarCarrito();
}
