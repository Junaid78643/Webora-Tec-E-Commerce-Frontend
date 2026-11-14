const products = [
  {
    id: 1,
    name: "Aurora Lamp",
    category: "Home",
    price: 59,
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
    description: "Soft ambient lighting that warms up any workspace or reading nook.",
  },
  {
    id: 2,
    name: "Terra Bottle",
    category: "Accessories",
    price: 28,
    image:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80",
    description: "A durable insulated bottle designed for daily commutes and long hikes.",
  },
  {
    id: 3,
    name: "Cedar Chair",
    category: "Furniture",
    price: 180,
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
    description: "Minimal Scandinavian comfort with a natural wood frame and plush cushion.",
  },
  {
    id: 4,
    name: "Ridge Backpack",
    category: "Accessories",
    price: 94,
    image:
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&q=80",
    description: "Weather-ready storage for workdays, travel, and everyday essentials.",
  },
  {
    id: 5,
    name: "Nova Headphones",
    category: "Tech",
    price: 129,
    image:
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80",
    description: "Crisp sound, all-day comfort, and noise isolation for focused listening.",
  },
  {
    id: 6,
    name: "Bloom Throw",
    category: "Textiles",
    price: 42,
    image:
      "https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=900&q=80",
    description: "A soft woven throw adding texture and warmth to modern interiors.",
  },
  {
    id: 7,
    name: "Sora Watch",
    category: "Accessories",
    price: 155,
    image:
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=900&q=80",
    description: "Sleek everyday timekeeping with refined detailing and a brushed finish.",
  },
  {
    id: 8,
    name: "Vale Ceramic Set",
    category: "Kitchen",
    price: 78,
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=900&q=80",
    description: "A handcrafted collection of stackable mugs and bowls for daily rituals.",
  },
  {
    id: 9,
    name: "Horizon Speaker",
    category: "Tech",
    price: 88,
    image:
      "https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?auto=format&fit=crop&w=900&q=80",
    description: "Portable wireless audio with balanced bass and a compact silhouette.",
  },
];

const state = {
  query: "",
  category: "All",
  sort: "featured",
  cart: loadCart(),
};

const categories = ["All", ...new Set(products.map((product) => product.category))];

const refs = {
  cartToggle: document.querySelector("#cartToggle"),
  closeCart: document.querySelector("#closeCart"),
  cartDrawer: document.querySelector("#cartDrawer"),
  cartCount: document.querySelector("#cartCount"),
  cartItems: document.querySelector("#cartItems"),
  cartTotal: document.querySelector("#cartTotal"),
  checkoutBtn: document.querySelector("#checkoutBtn"),
  productGrid: document.querySelector("#productGrid"),
  searchInput: document.querySelector("#searchInput"),
  sortSelect: document.querySelector("#sortSelect"),
  categoryFilterBar: document.querySelector("#categoryFilterBar"),
  checkoutModal: document.querySelector("#checkoutModal"),
  closeCheckout: document.querySelector("#closeCheckout"),
  checkoutForm: document.querySelector("#checkoutForm"),
  formMessage: document.querySelector("#formMessage"),
  toast: document.querySelector("#toast"),
};

function loadCart() {
  try {
    const savedCart = JSON.parse(localStorage.getItem("lumaCart") || "[]");
    return Array.isArray(savedCart) ? savedCart : [];
  } catch {
    return [];
  }
}

function saveCart() {
  localStorage.setItem("lumaCart", JSON.stringify(state.cart));
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function showToast(message) {
  refs.toast.textContent = message;
  refs.toast.classList.add("visible");

  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(() => {
    refs.toast.classList.remove("visible");
  }, 1900);
}

function getVisibleProducts() {
  let list = [...products];

  list = list.filter((product) => {
    const matchesCategory = state.category === "All" || product.category === state.category;
    const haystack = `${product.name} ${product.category} ${product.description}`.toLowerCase();
    const matchesSearch = haystack.includes(state.query.trim().toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (state.sort === "price-asc") {
    list.sort((a, b) => a.price - b.price);
  }

  if (state.sort === "price-desc") {
    list.sort((a, b) => b.price - a.price);
  }

  return list;
}

function renderCategoryFilters() {
  refs.categoryFilterBar.innerHTML = categories
    .map(
      (category) => `
        <button
          type="button"
          class="category-chip ${state.category === category ? "active" : ""}"
          data-category="${category}"
        >
          ${category}
        </button>
      `
    )
    .join("");
}

function renderProducts() {
  const visibleProducts = getVisibleProducts();

  if (!visibleProducts.length) {
    refs.productGrid.innerHTML = `
      <div class="empty-products">
        <h3>No products found</h3>
        <p>Try another search term or choose a different category.</p>
      </div>
    `;
    return;
  }

  refs.productGrid.innerHTML = visibleProducts
    .map(
      (product) => `
        <article class="product-card">
          <div class="product-image">
            <img src="${product.image}" alt="${product.name}" loading="lazy" />
          </div>
          <div class="product-body">
            <div class="product-meta">
              <span class="category-pill">${product.category}</span>
              <span>★ 4.8</span>
            </div>
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="product-actions">
              <span class="product-price">${formatCurrency(product.price)}</span>
              <button class="add-cart-btn" type="button" data-id="${product.id}">Add to cart</button>
            </div>
          </div>
        </article>
      `
    )
    .join("");
}

function addToCart(productId) {
  const product = products.find((item) => item.id === Number(productId));

  if (!product) {
    return;
  }

  const existingItem = state.cart.find((item) => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    state.cart.push({ ...product, quantity: 1 });
  }

  saveCart();
  renderCart();
  openCart();
  showToast(`${product.name} added to cart`);
}

function updateCartQuantity(productId, change) {
  const item = state.cart.find((entry) => entry.id === productId);

  if (!item) {
    return;
  }

  item.quantity += change;

  if (item.quantity <= 0) {
    state.cart = state.cart.filter((entry) => entry.id !== productId);
  }

  saveCart();
  renderCart();
}

function getCartTotal() {
  return state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function renderCart() {
  const total = getCartTotal();
  const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);

  refs.cartCount.textContent = totalItems;
  refs.cartTotal.textContent = formatCurrency(total);
  refs.checkoutBtn.disabled = state.cart.length === 0;

  if (!state.cart.length) {
    refs.cartItems.innerHTML = `
      <div class="empty-state">
        <div>
          <h3>Your cart is empty</h3>
          <p>Add a few favorite finds to get started.</p>
        </div>
      </div>
    `;
    return;
  }

  refs.cartItems.innerHTML = state.cart
    .map(
      (item) => `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}" />
          <div>
            <h3>${item.name}</h3>
            <p>${item.category}</p>
            <div class="item-price">
              <strong>${formatCurrency(item.price * item.quantity)}</strong>
              <div class="quantity-control">
                <button class="qty-button" type="button" data-cart-action="decrease" data-id="${item.id}" aria-label="Decrease quantity">−</button>
                <span class="qty-value">${item.quantity}</span>
                <button class="qty-button" type="button" data-cart-action="increase" data-id="${item.id}" aria-label="Increase quantity">+</button>
              </div>
            </div>
          </div>
        </div>
      `
    )
    .join("");
}

function openCart() {
  refs.cartDrawer.classList.add("open");
}

function closeCart() {
  refs.cartDrawer.classList.remove("open");
}

function openCheckout() {
  if (!state.cart.length) {
    showToast("Your cart is empty");
    return;
  }

  refs.checkoutModal.classList.remove("hidden");
  refs.checkoutModal.setAttribute("aria-hidden", "false");
}

function closeCheckout() {
  refs.checkoutModal.classList.add("hidden");
  refs.checkoutModal.setAttribute("aria-hidden", "true");
  refs.checkoutForm.reset();
  refs.formMessage.textContent = "";
  refs.formMessage.classList.remove("success");
}

function validateCheckoutForm(form) {
  const fields = [
    { name: "fullName", rule: (value) => value.trim().length >= 2, message: "Please enter your full name." },
    { name: "email", rule: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()), message: "Please enter a valid email address." },
    { name: "address", rule: (value) => value.trim().length >= 10, message: "Please enter a shipping address with at least 10 characters." },
    { name: "city", rule: (value) => value.trim().length >= 2, message: "Please enter your city." },
    {
      name: "postalCode",
      rule: (value) => /^[A-Za-z0-9\s-]{4,10}$/.test(value.trim()),
      message: "Please enter a valid postal code.",
    },
  ];

  let isValid = true;

  fields.forEach(({ name, rule, message }) => {
    const input = form.elements[name];
    const value = input.value;

    if (!rule(value)) {
      input.setCustomValidity(message);
      input.reportValidity();
      isValid = false;
      return;
    }

    input.setCustomValidity("");
  });

  return isValid;
}

refs.searchInput.addEventListener("input", (event) => {
  state.query = event.target.value;
  renderProducts();
});

refs.sortSelect.addEventListener("change", (event) => {
  state.sort = event.target.value;
  renderProducts();
});

refs.categoryFilterBar.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");

  if (!button) {
    return;
  }

  state.category = button.dataset.category;
  renderCategoryFilters();
  renderProducts();
});

refs.productGrid.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-id]");

  if (!addButton) {
    return;
  }

  addToCart(addButton.dataset.id);
});

refs.cartToggle.addEventListener("click", () => {
  refs.cartDrawer.classList.toggle("open");
});

refs.closeCart.addEventListener("click", closeCart);
refs.checkoutBtn.addEventListener("click", openCheckout);
refs.closeCheckout.addEventListener("click", closeCheckout);

refs.cartItems.addEventListener("click", (event) => {
  const actionButton = event.target.closest("[data-cart-action]");

  if (!actionButton) {
    return;
  }

  const productId = Number(actionButton.dataset.id);
  const action = actionButton.dataset.cartAction;

  if (action === "increase") {
    updateCartQuantity(productId, 1);
  }

  if (action === "decrease") {
    updateCartQuantity(productId, -1);
  }
});

refs.checkoutForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const form = event.currentTarget;

  if (!validateCheckoutForm(form)) {
    refs.formMessage.textContent = "Please fix the highlighted fields and try again.";
    return;
  }

  refs.formMessage.textContent = "Order confirmed! A confirmation email is on its way.";
  refs.formMessage.classList.add("success");

  state.cart = [];
  saveCart();
  renderCart();
  closeCheckout();
  showToast("Order placed successfully");
});

refs.checkoutModal.addEventListener("click", (event) => {
  if (event.target === refs.checkoutModal) {
    closeCheckout();
  }
});

renderCategoryFilters();
renderProducts();
renderCart();
