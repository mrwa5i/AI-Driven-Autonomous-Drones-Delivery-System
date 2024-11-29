document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('package-form');
    const messageBox = document.getElementById('message');
    const packageIdInput = document.getElementById('package-id');

    // Auto-generate Package ID
    async function generatePackageId() {
        try {
            const response = await fetch('/generate-package-id');
            const result = await response.json();
            if (response.ok) {
                packageIdInput.value = result.package_id;
            } else {
                console.error(result.message);
            }
        } catch (error) {
            console.error('Error generating Package ID:', error);
        }
    }

    // Generate Package ID on page load
    generatePackageId();

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Collect package details
        const packageId = packageIdInput.value;
        const packageName = document.getElementById('package-name').value;
        const deliveryAddress = document.getElementById('delivery-address').value;
        const recipientName = document.getElementById('recipient-name').value;
        const contactNumber = document.getElementById('contact-number').value;
        const weight = document.getElementById('weight').value;

        try {
            const response = await fetch('/submit-package', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    package_id: packageId,
                    package_name: packageName,
                    delivery_address: deliveryAddress,
                    recipient_name: recipientName,
                    contact_number: contactNumber,
                    weight: weight,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                messageBox.style.display = 'block';
                messageBox.textContent = result.message;
                messageBox.style.backgroundColor = 'green';
                form.reset();
                generatePackageId(); // Generate a new ID after successful submission
            } else {
                messageBox.style.display = 'block';
                messageBox.textContent = result.message;
                messageBox.style.backgroundColor = '#f44336';
            }
        } catch (error) {
            console.error('Error:', error);
            messageBox.style.display = 'block';
            messageBox.textContent = 'An error occurred. Please try again.';
            messageBox.style.backgroundColor = '#f44336';
        }
    });
});
