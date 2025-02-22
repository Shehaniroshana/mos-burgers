const dishes = document.getElementById("dishes");
const tabButtons = document.querySelectorAll('.tabs button');
let search_div = document.getElementById("search-div");
let cartTotal = document.getElementById("cart-total");
let cart = {};
let OrderObject = [];

tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    tabButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    getAllData(button.textContent.toLowerCase());
  });
});

function getAllData(category) {
  dishes.innerHTML = '';
  fetch(`http://localhost:8080/mos/get_items_by_category/${category}`)
    .then(response => response.json())
    .then(data => {
      data.forEach(item => {
        const dishCardHTML = `
        <div class="dish-card">
          <img src="/burger img/img.jpg" alt="" class="dish-image"/>
          <div class="dish-details">
            <h3 class="dish-name">${item.name || 'Dish Name'}</h3>
            <p class="dish-qty">${item.qty} Bowls available</p>
            <div class="price-wrapper">
              <div class="price">$${item.price || '0.00'}</div>
              ${item.discount > 0 ? `<div class="discount">-${item.discount}% OFF</div>` : ''}
            </div>
            <button class="cart-button" onclick="add_cart(${item.id}, '${item.name}', '${item.code}', ${item.qty}, ${item.discount}, ${item.price})">Add to Cart</button>
          </div>
        </div>
      `;
        dishes.innerHTML += dishCardHTML;
      });
    })
    .catch(error => console.error("Error:", error));
}

window.onload = () => {
  tabButtons[0].classList.add('active');
  getAllData(tabButtons[0].textContent.toLowerCase());
};

function searchByItemName() {
  let search_text = document.getElementById("input-search").value;
  search_div.innerHTML = "";
  fetch(`http://localhost:8080/mos/item_search_by_name/${encodeURIComponent(search_text)}`)
    .then(response => response.json())
    .then(data => {
      data.forEach(item => {
        const dishCardHTML = `
        <div class="dish-card">
          <i class="bi bi-x close-button" onclick="removeDish()"></i>
          <img src="/burger img/img.jpg" alt="" class="dish-image"/>
          <div class="dish-details">
            <h3 class="dish-name">${item.name || 'Dish Name'}</h3>
            <p class="dish-qty">${item.qty} Bowls available</p>
            <div class="price-wrapper">
              <div class="price">$${item.price || '0.00'}</div>
              ${item.discount > 0 ? `<div class="discount">-${item.discount}% OFF</div>` : ''}
            </div>
            <button class="cart-button" onclick="add_cart(${item.id}, '${item.name}', '${item.code}', ${item.qty}, ${item.discount}, ${item.price})">Add to Cart</button>
          </div>
        </div>
      `;
        search_div.innerHTML += dishCardHTML;
      });
    })
    .catch(error => console.error(error));
}

function removeDish() {
  search_div.innerHTML = "";
}

function add_cart(id, itemName, itemCode, qty, discount, price) {
  if (cart[id]) {
    cart[id].quantity += 1;
  } else {
    cart[id] = {
      name: itemName,
      code: itemCode,
      quantity: 1,
      discount: discount,
      price: price
    };
  }
  updateCartUI();
}

function updateCartUI() {
  let cart_td = document.getElementById("cart-items");
  cart_td.innerHTML = "";
  let total = 0;
  
  Object.keys(cart).forEach(id => {
    let item = cart[id];
    let itemTotal = item.quantity * item.price * (1 - item.discount / 100);
    total += itemTotal;
    cart_td.innerHTML += `
      <tr>
        <td>${item.name}</td>
        <td>${item.quantity}</td>
        <td>$${item.price.toFixed(2)}</td>
        <td>$${itemTotal.toFixed(2)}</td>
        <td><button onclick="removeCartItem(${id})">Remove</button></td>
      </tr>
    `;
  });
  cartTotal.textContent = total.toFixed(2);
}

function removeCartItem(id) {
  delete cart[id];
  updateCartUI();
}

function loadCustomerId() {
  let customer_Ids_dropdown = document.getElementById("customer-id");
  fetch("http://localhost:8080/mos/get_all_customer_ids")
    .then(response => response.json())
    .then(customerIds => {
      customerIds.forEach(customerId => {
        customer_Ids_dropdown.innerHTML += `<option value="${customerId}">Customer ${customerId}</option>`;
      });
    })
    .catch(error => console.error(`Error fetching customer IDs:`, error));
}
loadCustomerId();

function place_order() {
  const customerId = document.getElementById("customer-id").value;

  // Validate customerId (it should be a number)
  if (!customerId || isNaN(customerId)) {
    alert("Please enter a valid Customer ID (numeric).");
    return;
  }

  // Map cart items into the order list
  const orderList = Object.keys(cart).map(itemId => {
    const item = cart[itemId];
    return {
      customerId: parseInt(customerId),
      itemId: parseInt(itemId),
      qty: parseInt(item.quantity),
      totalAmount: parseFloat(item.quantity * item.price * (1 - item.discount / 100)),
      orderDate: new Date().toISOString().split('T')[0],
    };
  });

  // Check if the cart is empty
  if (orderList.length === 0) {
    alert("Your cart is empty. Please add items to your cart.");
    return;
  }

  // Send the order list to the server
  sendOrdersToServer(orderList);
}

function sendOrdersToServer(orderList) {
  console.log(orderList);
  console.log("✅ Final Order List Sent to Backend:", JSON.stringify(orderList, null, 2));

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify(orderList);
  console.log("✅ Payload Sent in Fetch:", raw); // Log the actual JSON being sent

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };

  fetch("http://localhost:8080/mos/save_order", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log("✅ Server Response:", result))
    .catch((error) => console.error("❌ Fetch Error:", error));
}


function select_customer() {
  const customerId = document.getElementById("customer-id").value;

  if (customerId) {
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };

    fetch(`http://localhost:8080/mos/search_by_id/${encodeURIComponent(customerId)}`, requestOptions)
      .then((response) => response.json())  // Use .json() to parse the JSON response
      .then((result) => {
        // Check if result is valid
        if (result && result.name) {
          document.getElementById("customer-name").innerText = result.name;
        } else {
          console.error("No name found in response");
        }
      })
      .catch((error) => console.error('Error fetching customer details:', error));
  }
}

function setDate(){
  const today = new Date();
    
    const options = { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' };
    const formattedDate = today.toLocaleDateString('en-GB', options);
    
    document.getElementById("date").innerText=formattedDate;
}
setDate()

document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => {
      document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');

      let links = {
          "bi-bag-check-fill": "/html_Files/Order.html",
          "bi-person-lines-fill": "/html_Files/customer.html",
          "fa-hamburger": "/html_Files/Item.html"
      };

      let iconClass = item.querySelector('i').classList[1];
      if (links[iconClass]) {
          window.location.href = links[iconClass];
      }
  });
});
