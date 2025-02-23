let search_div = document.getElementById("search-div");
let customerName=document.getElementById("name");
let contact=document.getElementById("contact");
let points=document.getElementById("points");
let id;

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

function setDate(){
  const today = new Date();
    
    const options = { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' };
    const formattedDate = today.toLocaleDateString('en-GB', options);
    
    document.getElementById("date").innerText=formattedDate;
}
setDate()

function loadAllCustomers() {
  let customerTableBody = document.getElementById("customerTableBody");

  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };

  fetch("http://localhost:8080/mos/customers", requestOptions)
    .then((response) => response.json())  
    .then((result) => {
      customerTableBody.innerHTML = "";

      result.forEach((customer) => {  
        const row = ` 
          <tr onclick="getRowData(this)">
            <td>${customer.id}</td>
            <td>${customer.name}</td>
            <td>${customer.contact}</td>
            <td>${customer.loyaltyPoints}</td>
          </tr>`;

        customerTableBody.innerHTML += row;
      });
    })
    .catch((error) => console.error("Error loading customers:", error));
}

loadAllCustomers();  

function getRowData(row) {
  let selectedId = row.cells[0].textContent;
  let selectedName = row.cells[1].textContent;
  let selectedContact = row.cells[2].textContent;
  let selectedPoints = row.cells[3].textContent;


  id=selectedId;
  customerName.value=selectedName;
  contact.value=selectedContact;
  points.value=selectedPoints;

}

function saveCustomer() {

  if (!customerName.value || !contact.value) {
    Swal.fire({
      icon: "error",
      title: "Error!",
      text: "Please enter a valid name and contact number.",
    });
    return;
  }

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    "name": String(customerName.value),
    "contact": String(contact.value),
    "loyaltyPoints": parseInt(points.value)
    });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };

  fetch("http://localhost:8080/mos/save_customer", requestOptions)
    .then((response) => response.text())
    .then((result) => {
      console.log(result);
      Swal.fire({
        icon: "success",
        title: "Customer Saved!",
        text: "The customer has been successfully saved.",
      });
    }).then(()=>{
      setTimeout(() => window.location.reload(), 3000);
    })
    .catch((error) => {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Something went wrong. Please try again.",
      });
    });

}


function updateCustomer(){

  // Ensure 'id' is defined and valid before proceeding
  if(!id || !customerName.value || !contact.value) {
    Swal.fire({
      icon: "error",
      title: "Error!",
      text: "Please select a customer and enter a valid name and contact number.",
    });
    return;
  }

  // Prepare headers for the request
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  // Prepare the body of the request
  const raw = JSON.stringify({
    "id": parseInt(id), // Assuming 'id' is defined elsewhere in your code
    "name": String(customerName.value),
    "contact": String(contact.value),
    "loyaltyPoints": parseInt(points.value)
  });

  // Prepare request options
  const requestOptions = {
    method: "PUT",  // Method to update data
    headers: myHeaders,
    body: raw,  // Send the data as JSON
    redirect: "follow"
  };

  // Make the fetch request to the server
  fetch("http://localhost:8080/mos/update_customer", requestOptions)
    .then((response) => {
      // If status code isn't OK (e.g., 400 or 500), we should handle that
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.text();
    })
    .then((result) => {
      console.log(result);  // You can add additional logic here
      Swal.fire({
        icon: "success",
        title: "Customer Updated!",
        text: "The customer information has been successfully updated. ✅",
      });
    }).then(()=>{
      setTimeout(() => window.location.reload(), 3000);
    })
    .catch((error) => {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "There was a problem updating the customer. ❌",
      });
    });
}

function deleteCustomer() {
  if (!id) {
    Swal.fire({
      icon: "error",
      title: "Error!",
      text: "Please select a customer to delete.",
    });
    return;
  }

  const requestOptions = {
    method: "DELETE",
    redirect: "follow"
  };

  fetch(`http://localhost:8080/mos/delete_customer/${encodeURIComponent(id)}`, requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.text();
    })
    .then((result) => {
      console.log(result);
      Swal.fire({
        icon: "success",
        title: "Customer Deleted!",
        text: "The customer has been successfully deleted.",
      });
    }).then(() => {
      setTimeout(() => window.location.reload(), 3000);
    })
    .catch((error) => {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "There was a problem deleting the customer.",
      });
    });
}


