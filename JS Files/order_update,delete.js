let cust_Id = document.getElementById("id");
let order_date = document.getElementById("orderDate");
let orderStatus = document.getElementById("orderStatus");
let amount = document.getElementById("amount");

function loadAllOrders() {
  let orderTableBody = document.getElementById("OrderTableBody");

  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };

  fetch("http://localhost:8080/mos/get_all_orders", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      orderTableBody.innerHTML = "";

      result.forEach((order) => {
        const row = `<tr onclick="getRowData(this)"> 
          <td>${order[0]}</td>
          <td>${order[1]}</td>
          <td>${order[2]}</td>
          <td>${order[3]}</td>
        </tr>`;

        orderTableBody.innerHTML += row;
      });
    })
    .catch((error) => console.error(error));
}

loadAllOrders();

function getRowData(row) {
  cust_Id.value = row.cells[0].textContent;
  order_date.value = row.cells[1].textContent;
  orderStatus.value = row.cells[2].textContent;
  amount.value = row.cells[3].textContent;
}

function updateStatus() {
  const requestOptions = {
    method: "PUT",
    redirect: "follow"
  };

  fetch(`http://localhost:8080/mos/update_by_customerId/${encodeURIComponent(cust_Id.value)}/${orderStatus.value}`, requestOptions)
    .then((response) => response.text())
    .then((result) => {
      console.log(result);
      Swal.fire({
        title: "Success!",
        text: "Order status updated successfully!",
        icon: "success",
        confirmButtonText: "OK"
      });
    }).then(()=>{
      setTimeout(() => window.location.reload(), 3000);
    })
    .catch((error) => console.error(error));
}

function deleteOrder() {
  Swal.fire({
    title: "Are you sure?",
    text: "You won’t be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!"
  }).then((result) => {
    if (result.isConfirmed) {
      const requestOptions = {
        method: "DELETE",
        redirect: "follow"
      };

      fetch(`http://localhost:8080/mos/delete_by_customer_id/${encodeURIComponent(cust_Id.value)}/${order_date.value}`, requestOptions)
        .then((response) => response.text())
        .then((result) => {
          console.log(result);
          Swal.fire({
            title: "Deleted!",
            text: "The order has been deleted.",
            icon: "success",
            confirmButtonText: "OK"
          });
        }).then(()=>{
          setTimeout(() => window.location.reload(), 3000);
        })
        .catch((error) => console.error(error));
    }
  });
}

function setDate() {
  const today = new Date();
  const options = { weekday: "long", day: "numeric", month: "short", year: "numeric" };
  const formattedDate = today.toLocaleDateString("en-GB", options);

  document.getElementById("date").innerText = formattedDate;
}
setDate();

document.querySelectorAll(".nav-item").forEach((item) => {
  item.addEventListener("click", () => {
    document.querySelectorAll(".nav-item").forEach((nav) => nav.classList.remove("active"));
    item.classList.add("active");

    let links = {
      "bi-bag-x": "/html_Files/Order_update,delete.html",
      "bi-bag-check-fill": "/html_Files/Order.html",
      "bi-person-lines-fill": "/html_Files/customer.html",
      "fa-hamburger": "/html_Files/Item.html"
    };

    let iconClass = item.querySelector("i").classList[1];
    if (links[iconClass]) {
      window.location.href = links[iconClass];
    }
  });
});
