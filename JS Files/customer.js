let search_div = document.getElementById("search-div");

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

  console.log("Selected Customer Data:");
  console.log("ID:", selectedId);
  console.log("Name:", selectedName);
  console.log("Contact:", selectedContact);
  console.log("Loyalty Points:", selectedPoints);

}
