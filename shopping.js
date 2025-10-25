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

//empty cart
const cart = [];

//used to reset the timer(user feedback)
let timerId;

clearCartBtn.addEventListener("click", clearCart);

sortByPriceBtn.addEventListener("click", sortByPrice);

function clearCart() {
  cart.length = 0;
  renderCartDetails();
  updateUserFeedback("Cart is cleared", "success");
}

function sortByPrice() {
  cart.sort(function (item1, item2) {
    return item1.price - item2.price;
  });
  renderCartDetails();
}

function renderProductDetails() {
  products.forEach(function (product) {
    // <div class="product-row">
    //       <p>Laptop - Rs. 50000</p>
    //       <button>Add to cart</button>
    //     </div>

    //   const productRow = `
    //     <div class="product-row">
    //         <p>${product.name} - Rs. ${product.price}</p>
    //         <button>Add to cart</button>
    //     </div>
    //   `;
    //   productsContainer.insertAdjacentHTML("beforeend", productRow);

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
  cart.forEach(function (product) {
    const { id, name, price } = product;

    const cartItemRow = `
      <div class="product-row">
              <p>${name} - Rs. ${price}</p>
              <button onclick="removeFromCart(${id})">Remove</button>
            </div>
      `;

    cartContainer.insertAdjacentHTML("beforeend", cartItemRow);
  });

  //   let totalPrice = 0;
  console.log("cart", cart);
  //   for (let i = 0; i < cart.length; i++) {
  //     totalPrice = totalPrice + cart[i].price;
  //   }

  const totalPrice = cart.reduce(function (acc, curProduct) {
    return acc + curProduct.price;
  }, 0);

  document.getElementById("totalPrice").textContent = `Rs. ${totalPrice}`;
}

//add to cart
function addToCart(id) {
  //   console.log("add to cart clicked", id);

  //check if the product is alredy available in the cart.
  const isProductAvailable = cart.some((product) => product.id === id);
  if (isProductAvailable) {
    updateUserFeedback(`Item already added to the cart`, "error");
    return;
  }

  const productToAdd = products.find(function (product) {
    return product.id === id;
  });
  //   console.log(productToAdd);
  cart.push(productToAdd);
  console.log(cart);
  renderCartDetails();

  //   feedbackElement.textContent = `${name} is added to the cart`;
  updateUserFeedback(`${productToAdd.name} is added to the cart`, "success");
}

function removeFromCart(id) {
  console.log(id);
  const product = cart.find((product) => product.id === id);
  //   const updatedCart = cart.filter(function (product) {
  //     return product.id !== id;
  //   });
  const productIndex = cart.findIndex((product) => product.id === id);
  cart.splice(productIndex, 1);
  //   console.log(updatedCart);
  //   cart = updatedCart;
  updateUserFeedback(`${product.name} is removed from the cart`, "error");
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
