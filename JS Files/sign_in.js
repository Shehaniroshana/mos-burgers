let user_name = document.getElementById("username");
let password = document.getElementById("password");
let boolean_Is_here = false; 

function btn_sign_in(event) {
  event.preventDefault(); // Prevent form from submitting
  sign_In(user_name.value, password.value);
}

function sign_In(userName, password) {
  fetch(`http://localhost:8080/mos/authenticate_user/${encodeURIComponent(userName)}/${encodeURIComponent(password)}`)
    .then((response) => response.text())
    .then((result) => {
      // Check if the result is a successful login
      boolean_Is_here = result.trim() === "true"; 
      if (boolean_Is_here) {
        alert("✅ Login Successful!");
        window.location.href = "/html_Files/Order.html";
        alert("❌ Invalid Username or Password!");  // Show invalid login message
      }
    })
    .catch((error) => {
      console.error(error);
      alert("⚠️ Error connecting to server!");  // Handle any fetch errors
    });
}
