document.getElementById("battery-form").addEventListener("submit", function (event) {
    event.preventDefault();

    // Get input values
    const charge = parseFloat(document.getElementById("charge").value);
    const voltage = parseFloat(document.getElementById("voltage").value);
    const temperature = parseFloat(document.getElementById("temperature").value);
    const cycles = parseInt(document.getElementById("cycles").value);

    // Select the results container
    const resultsContainer = document.getElementById("use-case-results");
    resultsContainer.innerHTML = "";

    // Monitor Battery Health
    const health = 100 - (cycles * 0.5 + temperature * 0.2);
    addResult("Monitor Battery Health", `Battery Health: ${health.toFixed(1)}%`);

    // Battery Charging Management
    addResult(
        "Battery Charging Management",
        charge < 100 ? "Charging needed. Ensure safe conditions for charging." : "Battery is fully charged."
    );

    // Predictive Battery Replacement
    addResult(
        "Predictive Battery Replacement",
        health < 50 ? "Recommendation: Replace battery soon to ensure optimal performance." : "Battery is in good condition."
    );

    // Low Battery Alert
    addResult(
        "Low Battery Alert",
        charge < 20 ? "Warning: Battery level critically low! Immediate action required." : "Battery level is sufficient."
    );

    // Flight Path Optimization
    addResult(
        "Flight Path Optimization",
        charge > 50 ? "Flight path optimized for efficiency." : "Adjusting flight path to conserve battery."
    );

    // Remote Battery Monitoring
    addResult(
        "Remote Battery Monitoring",
        `Real-time Data: Charge - ${charge}%, Voltage - ${voltage}V, Temperature - ${temperature}°C, Cycles - ${cycles}`
    );

    // Battery Cooling System
    addResult(
        "Battery Cooling System",
        temperature > 40 ? "Warning: High temperature detected! Activate cooling system." : "Temperature within safe limits."
    );

    // Emergency Battery Landing
    addResult(
        "Emergency Battery Landing",
        charge < 15 ? "Battery critically low! Initiating emergency landing protocol." : "Battery level sufficient for flight."
    );

    // Battery Life Estimation
    const remainingCycles = Math.max(0, (100 - health) / 0.5);
    addResult("Battery Life Estimation", `Estimated remaining cycles: ${remainingCycles.toFixed(0)}`);

    // Landing Zone Identification
    addResult(
        "Landing Zone Identification",
        charge < 20
            ? "Identifying safe landing zone due to low battery."
            : "Battery level sufficient; no immediate landing required."
    );

    // Show results section
    document.getElementById("results").classList.remove("hidden");
});

// Helper function to add a result
function addResult(title, message) {
    const resultsContainer = document.getElementById("use-case-results");
    const resultDiv = document.createElement("div");
    resultDiv.className = "use-case";
    resultDiv.innerHTML = `<strong>${title}</strong><p>${message}</p>`;
    resultsContainer.appendChild(resultDiv);
}
