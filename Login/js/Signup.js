document.getElementById('signup-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const fullname = document.getElementById('fullname').value;
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const address = document.getElementById('address').value;

    if (password !== confirmPassword) {
        showMessage("Passwords do not match", "error");
        return;
    }

    const userData = {
        fullname,
        username,
        email,
        password,
        address
    };

    fetch('/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            showMessage(data.message, "success");
        }
    })
    .catch(err => showMessage('An error occurred.', "error"));
});

function showMessage(message, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.style.display = 'block';
    messageDiv.className = type === "success" ? "alert success" : "alert error";
    messageDiv.innerText = message;
}
