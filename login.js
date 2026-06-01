document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("signupForm").addEventListener("submit", function (e) {
    e.preventDefault();

    let name     = document.getElementById("name").value.trim();
    let email    = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();
    let terms    = document.getElementById("terms").checked;
    let isValid  = true;

    document.getElementById("nameError").innerText     = "";
    document.getElementById("emailError").innerText    = "";
    document.getElementById("passwordError").innerText = "";
    document.getElementById("termsError").innerText    = "";

    if (name === "") { document.getElementById("nameError").innerText = "Please enter your name"; isValid = false; }
    if (email === "") { document.getElementById("emailError").innerText = "Please enter your email"; isValid = false; }
    else if (!email.includes("@")) { document.getElementById("emailError").innerText = "Enter valid email"; isValid = false; }
    if (password === "") { document.getElementById("passwordError").innerText = "Please enter password"; isValid = false; }
    else if (password.length < 8) { document.getElementById("passwordError").innerText = "Password must be at least 8 characters"; isValid = false; }
    if (!terms) { document.getElementById("termsError").innerText = "You must accept terms"; isValid = false; }

    if (isValid) {
      fetch('api/register.php', {
        method : 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body   : new URLSearchParams({ name, email, password })
      })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          localStorage.setItem('user_name',  data.name);
          localStorage.setItem('user_email', email);
          alert('Account created successfully!');
          window.location.href = "Dashboard.html";
        } else {
          document.getElementById("emailError").innerText = data.message;
        }
      })
      .catch(err => console.error(err));
    }
  });
});