document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("signinForm").addEventListener("submit", function (e) {
    e.preventDefault();

    let email    = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();
    let valid    = true;

    document.getElementById("emailError").innerText    = "";
    document.getElementById("passwordError").innerText = "";

    if (email === "") { document.getElementById("emailError").innerText = "Email is required"; valid = false; }
    else if (!email.includes("@")) { document.getElementById("emailError").innerText = "Enter valid email"; valid = false; }
    if (password === "") { document.getElementById("passwordError").innerText = "Password is required"; valid = false; }
    else if (password.length < 8) { document.getElementById("passwordError").innerText = "Minimum 8 characters required"; valid = false; }

    if (valid) {
      fetch('api/login.php', {
        method : 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body   : new URLSearchParams({ email, password })
      })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          localStorage.setItem('user_id',    data.id);
          localStorage.setItem('user_name',  data.name);
          localStorage.setItem('user_email', data.email);
          window.location.href = "Dashboard.html";
        } else {
          document.getElementById("emailError").innerText = data.message;
        }
      })
      .catch(err => console.error(err));
    }
  });
});