document.getElementById("battery-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    // Get input values
    const charge = parseFloat(document.getElementById("charge").value);
    const voltage = parseFloat(document.getElementById("voltage").value);
    const temperature = parseFloat(document.getElementById("temperature").value);
    const cycles = parseInt(document.getElementById("cycles").value);

    // server mode is used whwn you want to process data using API
    const mode = "client"; // Change to "server" to use the backend API

    if (mode === "server") {
        // Backend API processing
        try {
            const response = await fetch("/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ charge, voltage, temperature, cycles }),
            });

            const results = await response.json();

            // Handle error response
            if (results.error) {
                alert("Error: " + results.error);
                return;
            }

            displayResults(results);
        } catch (error) {
            console.error("Error communicating with backend:", error);
            alert("Failed to connect to the backend.");
        }
    } else {
        // Client-side processing
        const results = {};

        // Monitor Battery Health
        const health = 100 - (cycles * 0.5 + temperature * 0.2);
        results["Monitor Battery Health"] = `Battery Health: ${health.toFixed(1)}%`;

        // Battery Charging Management
        results["Battery Charging Management"] = 
            charge < 100 ? "Charging needed. Ensure safe conditions for charging." : "Battery is fully charged.";

        // Predictive Battery Replacement
        results["Predictive Battery Replacement"] = 
            health < 50 ? "Recommendation: Replace battery soon to ensure optimal performance." : "Battery is in good condition.";

        // Low Battery Alert
        results["Low Battery Alert"] = 
            charge < 20 ? "Warning: Battery level critically low! Immediate action required." : "Battery level is sufficient.";

        // Flight Path Optimization
        results["Flight Path Optimization"] = 
            charge > 50 ? "Flight path optimized for efficiency." : "Adjusting flight path to conserve battery.";

        // Remote Battery Monitoring
        results["Remote Battery Monitoring"] = 
            `Real-time Data: Charge - ${charge}%, Voltage - ${voltage}V, Temperature - ${temperature}°C, Cycles - ${cycles}`;

        // Battery Cooling System
        results["Battery Cooling System"] = 
            temperature > 40 ? "Warning: High temperature detected! Activate cooling system." : "Temperature within safe limits.";

        // Emergency Battery Landing
        results["Emergency Battery Landing"] = 
            charge < 15 ? "Battery critically low! Initiating emergency landing protocol." : "Battery level sufficient for flight.";

        // Battery Life Estimation
        const remainingCycles = Math.max(0, (100 - health) / 0.5);
        results["Battery Life Estimation"] = `Estimated remaining cycles: ${remainingCycles.toFixed(0)}`;

        // Landing Zone Identification
        results["Landing Zone Identification"] = 
            charge < 20 ? "Identifying safe landing zone due to low battery." : "Battery level sufficient; no immediate landing required.";

        displayResults(results);
    }
});

// Helper function to display results
function displayResults(results) {
    const resultsContainer = document.getElementById("use-case-results");
    resultsContainer.innerHTML = ""; // Clear previous results
    Object.keys(results).forEach((key) => {
        const resultDiv = document.createElement("div");
        resultDiv.className = "use-case";
        resultDiv.innerHTML = `<strong>${key}</strong><p>${results[key]}</p>`;
        resultsContainer.appendChild(resultDiv);
    });

    // Show results section
    document.getElementById("results").classList.remove("hidden");
}
