const dishes = document.getElementById("dishes");
const tabButtons = document.querySelectorAll('.tabs button');
let search_div = document.getElementById("search-div");
let item_code = document.getElementById("item-code");
let item_name = document.getElementById("item-name");
let item_category = document.getElementById("selector");
let item_price = document.getElementById("item-price");
let item_discount = document.getElementById("item-discount");
let item_qty = document.getElementById("item-qty");
let item_id;


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
            <button class="cart-button" onclick="edit_item(${item.id}, '${item.name}', '${item.code}', ${item.qty}, ${item.discount}, ${item.price},'${item.category}')">Edit Item</button>
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
      if (data.length === 0) {
        Swal.fire("Not Found!", "No items matched your search. ", "warning");
        return;
      }

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
            <button class="cart-button" onclick="edit_item(${item.id}, '${item.name}', '${item.code}', ${item.qty}, ${item.discount}, ${item.price},'${item.category}')">Edit Item</button>
          </div>
        </div>
      `;
        search_div.innerHTML += dishCardHTML;
      });

      Swal.fire("Success!", "Items loaded successfully! ", "success");
    })
    .catch(error => {
      console.error(error);
      Swal.fire("Error!", "Failed to fetch items. ", "error");
    });
}


function removeDish() {
  search_div.innerHTML = "";
}

function edit_item(id, itemName, itemCode, qty, discount, price, category) {
  item_code.value = itemCode;
  item_discount.value = parseFloat(discount);
  item_price.value = parseFloat(price);
  item_id = id;
  item_name.value = itemName;
  item_qty.value = qty;
   
  console.log(category);
  
  if (category && item_category.querySelector(`option[value="${category}"]`)) {
    item_category.value = category;
  } else {
    item_category.value = ""; 
  }
}


function saveItem() {
  if (!item_code.value || !item_name.value || !item_category.value || !item_price.value || !item_discount.value || !item_qty.value) {
    Swal.fire("Warning!", "All fields are required!", "warning");
    return;
  }

  if (isNaN(item_price.value) || item_price.value <= 0) {
    Swal.fire("Error!", "Please enter a valid price!", "error");
    return;
  }

  if (isNaN(item_discount.value) || item_discount.value < 0 || item_discount.value > 100) {
    Swal.fire("Error!", "Discount must be between 0 and 100!", "error");
    return;
  }

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    "code": item_code.value,
    "name": item_name.value,
    "category": item_category.value,
    "qty": parseInt(item_qty.value),
    "price": parseFloat(item_price.value),
    "discount": parseFloat(item_discount.value)
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };

  fetch("http://localhost:8080/mos/save_item", requestOptions)
    .then(response => {
      if (!response.ok) {
        throw new Error("Failed to save item!");
      }
      return response.text();
    })
    .then(result => {
      Swal.fire("Success!", "Item saved successfully! ", "success");
      console.log(result);
    }).then(()=>{
      setTimeout(() => window.location.reload(), 3000);
    })
    .catch(error => {
      Swal.fire("Error!", "Failed to save item. ", "error");
      console.error(error);
    });
}


document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    item.classList.add('active');

    let links = {
      "bi-bag-x": "/html_Files/Order_update,delete.html",
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


function updateItem(){

  if (!item_code.value || !item_name.value || !item_category.value || !item_price.value || !item_discount.value || !item_qty.value) {
    Swal.fire("Warning!", "All fields are required!", "warning");
    return;
  }

  if (isNaN(item_price.value) || item_price.value <= 0) {
    Swal.fire("Error!", "Please enter a valid price!", "error");
    return;
  }

  if (isNaN(item_discount.value) || item_discount.value < 0 || item_discount.value > 100) {
    Swal.fire("Error!", "Discount must be between 0 and 100!", "error");
    return;
  }

const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

console.log(item_id);


const raw = JSON.stringify({
  "id": item_id,
  "code": item_code.value,
  "name": String(item_name.value),
  "category": String(item_category.value),
  "qty":parseInt(item_qty.value),
  "price":parseFloat(item_price.value),
  "discount":parseFloat(item_discount.value)
});

const requestOptions = {
  method: "PUT",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("http://localhost:8080/mos/update_item", requestOptions)
  .then((response) => response.text())
  .then((result) => {
    
    Swal.fire("Success!", "Item updated successfully! ", "success");
  }).then(()=>{
    setTimeout(() => window.location.reload(), 3000);
  })
  .catch((error) =>{
     console.error(error)
     Swal.fire("Error!", "Failed to update item. ", "error");
});

}

function deleteItem() {
  if (!item_id || item_id === "") {
    Swal.fire("Error!", "Invalid item! ❌ Please select an item before deleting.", "error");
    return;
  }

  Swal.fire({
    title: "Are you sure?",
    text: `Are you sure you want to delete this item (ID: ${item_id})? This action cannot be undone! ⚠️`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel"
  }).then((result) => {
    if (result.isConfirmed) {
      const requestOptions = {
        method: "DELETE",
        redirect: "follow"
      };

      fetch(`http://localhost:8080/mos/delete_item/${encodeURIComponent(item_id)}`, requestOptions)
        .then((response) => response.text())
        .then((result) => {
          console.log(result);
          Swal.fire("Deleted!", "Item deleted successfully! ", "success");
        }).then(()=>{
          setTimeout(() => window.location.reload(), 3000);
        })
        .catch((error) => {
          console.error(error);
          Swal.fire("Error!", "Failed to delete item. ", "error");
        });
    }
  });
}


function setDate(){
  const today = new Date();
    
    const options = { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' };
    const formattedDate = today.toLocaleDateString('en-GB', options);
    
    document.getElementById("date").innerText=formattedDate;
}
setDate()