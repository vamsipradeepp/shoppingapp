//Elements references
const productsContainer = document.getElementById("productsContainer");
const cartContainer = document.getElementById("cartContainer");
const feedbackElement = document.getElementById("feedback");
const clearCartBtn = document.getElementById("clearCart");
const sortByPriceBtn = document.getElementById("sortByPrice");

//default products
const products = [
  {
    id: 1,
    name: "Laptop",
    price: 50000,
  },
  {
    id: 2,
    name: "Phone",
    price: 20000,
  },
  {
    id: 3,
    name: "Tablet",
    price: 5000,
  },
  {
    id: 4,
    name: "Smartwatch",
    price: 1000,
  },
  {
    id: 5,
    name: "Headphones",
    price: 500,
  },
];

//empty cart - now stores objects with quantity
const cart = [];

//used to reset the timer(user feedback)
let timerId;

const MAX_QUANTITY = 10;

clearCartBtn.addEventListener("click", clearCart);

sortByPriceBtn.addEventListener("click", sortByPrice);

function clearCart() {
  cart.length = 0;
  renderCartDetails();
  updateUserFeedback("Cart is cleared", "success");
}

function sortByPrice() {
  cart.sort(function (item1, item2) {
    const total1 = item1.price * item1.quantity;
    const total2 = item2.price * item2.quantity;
    return total1 - total2;
  });
  renderCartDetails();
}

function renderProductDetails() {
  products.forEach(function (product) {
    const { id, name, price } = product;
    const divElement = document.createElement("div");
    divElement.className = "product-row";
    divElement.innerHTML = `
        <p>${name} - Rs. ${price}</p>
        <button onclick="addToCart(${id})">Add to cart</button>
        `;
    productsContainer.appendChild(divElement);
  });
}

function renderCartDetails() {
  cartContainer.innerHTML = "";
  cart.forEach(function (cartItem) {
    const { id, name, price, quantity } = cartItem;

    const cartItemRow = `
      <div class="product-row">
              <p>${name} - Rs. ${price} x ${quantity} = Rs. ${
      price * quantity
    }</p>
              <button onclick="removeFromCart(${id})">Remove</button>
            </div>
      `;

    cartContainer.insertAdjacentHTML("beforeend", cartItemRow);
  });

  const totalPrice = cart.reduce(function (acc, cartItem) {
    return acc + cartItem.price * cartItem.quantity;
  }, 0);

  document.getElementById("totalPrice").textContent = `Rs. ${totalPrice}`;
}

//add to cart
function addToCart(id) {
  //check if the product is already available in the cart
  const existingCartItem = cart.find((item) => item.id === id);

  if (existingCartItem) {
    // Product exists, check if we can add more
    if (existingCartItem.quantity >= MAX_QUANTITY) {
      updateUserFeedback(
        `Out of stock! Maximum ${MAX_QUANTITY} items allowed`,
        "error"
      );
      return;
    }

    // Increase quantity
    existingCartItem.quantity++;
    updateUserFeedback(
      `${existingCartItem.name} quantity increased to ${existingCartItem.quantity}`,
      "success"
    );
  } else {
    // Product doesn't exist, add new item with quantity 1
    const productToAdd = products.find(function (product) {
      return product.id === id;
    });

    cart.push({
      ...productToAdd,
      quantity: 1,
    });

    updateUserFeedback(`${productToAdd.name} is added to the cart`, "success");
  }

  renderCartDetails();
}

function removeFromCart(id) {
  const cartItem = cart.find((item) => item.id === id);

  if (cartItem.quantity > 1) {
    // Decrease quantity
    cartItem.quantity--;
    updateUserFeedback(
      `${cartItem.name} quantity decreased to ${cartItem.quantity}`,
      "success"
    );
  } else {
    // Remove item completely
    const productIndex = cart.findIndex((item) => item.id === id);
    cart.splice(productIndex, 1);
    updateUserFeedback(`${cartItem.name} is removed from the cart`, "error");
  }

  renderCartDetails();
}

function updateUserFeedback(msg, type) {
  clearTimeout(timerId);
  feedbackElement.style.display = "block";
  //type - success(green), error(red)
  if (type === "success") {
    feedbackElement.style.backgroundColor = "green";
  }
  if (type === "error") {
    feedbackElement.style.backgroundColor = "red";
  }
  feedbackElement.textContent = msg;

  timerId = setTimeout(function () {
    feedbackElement.style.display = "none";
  }, 3000);
}

//rendering products
renderProductDetails();
