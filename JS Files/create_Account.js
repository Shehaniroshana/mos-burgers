document.addEventListener('DOMContentLoaded', function() {
  // Add event listener to the form submission
  const form = document.querySelector('form');
  
  form.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission
    
    // Collecting input values
    const email = document.getElementById('email').value;
    const name = document.getElementById('name').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    // Basic validation for required fields
    if (!email || !name || !password || !role) {
      // SweetAlert for missing fields
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill in all the fields!',
      });
      return;
    }

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      name: name,
      email: email,
      password: password,
      role: role
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch("http://localhost:8080/mos/save_user", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          // Success alert with SweetAlert
          Swal.fire({
            icon: 'success',
            title: 'Account Created',
            text: 'Your account has been created successfully!',
          }).then(() => {
            // Optionally, redirect to login page after success
            window.location.href = '/login';
          });
        } else {
          // Error alert with SweetAlert
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: result.message || 'An error occurred. Please try again.',
          });
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An unexpected error occurred. Please try again later.',
        });
      });
  });
});
