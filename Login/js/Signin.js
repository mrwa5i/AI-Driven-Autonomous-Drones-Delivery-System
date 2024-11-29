// JavaScript for Sign In Page

document.addEventListener("DOMContentLoaded", () => {
    const signinForm = document.getElementById("signin-form");
    const messageDiv = document.getElementById("message");

    signinForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Collect form data
        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value;

        if (!username || !password) {
            showMessage("Both fields are required!", "error");
            return;
        }

        // Create a payload
        const payload = {
            username,
            password
        };

        try {
            // Send data to the backend
            const response = await fetch("/signin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok) {
                showMessage(data.message, "success");
                // Redirect to dashboard or homepage after successful login
                setTimeout(() => {
                    window.location.href = "/dashboard";
                }, 2000);
            } else {
                showMessage(data.message, "error");
            }
        } catch (error) {
            showMessage("Something went wrong. Please try again later.", "error");
        }
    });

    // Function to show messages
    function showMessage(message, type) {
        messageDiv.style.display = "block";
        messageDiv.textContent = message;
        messageDiv.className = `alert ${type === "success" ? "success" : "error"}`;
        setTimeout(() => {
            messageDiv.style.display = "none";
        }, 5000);
    }
});
