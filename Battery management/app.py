from flask import Flask, request, jsonify, render_template
import csv
import os

app = Flask(__name__, template_folder="./Templates", static_folder="./Statics")

# File path for the CSV
DATA_FILE = "battery_data.csv"

# Helper functions to handle CSV operations
def write_battery_data(data):
    file_exists = os.path.isfile(DATA_FILE)
    with open(DATA_FILE, mode="a", newline="") as file:
        writer = csv.DictWriter(file, fieldnames=["charge", "voltage", "temperature", "cycles"])
        if not file_exists:
            writer.writeheader()  # Write header if file is new
        writer.writerow(data)

def read_battery_data():
    if not os.path.isfile(DATA_FILE):
        return []
    with open(DATA_FILE, mode="r") as file:
        reader = csv.DictReader(file)
        return list(reader)

# Home route to serve the HTML
@app.route("/")
def index():
    return render_template("battery.html")

# API to analyze battery details
@app.route("/analyze", methods=["POST"])
def analyze_battery():
    try:
        # Parse input data from request
        data = request.json
        charge = float(data["charge"])
        voltage = float(data["voltage"])
        temperature = float(data["temperature"])
        cycles = int(data["cycles"])

        # Write data to the CSV file
        write_battery_data(data)

        # Perform use case calculations
        results = {}

        # M8-UC1 Monitor Battery Health
        health = 100 - (cycles * 0.5 + temperature * 0.2)
        results["Monitor Battery Health"] = f"Battery Health: {health:.1f}%"

        # M8-UC2 Battery Charging Management
        results["Battery Charging Management"] = (
            "Charging needed. Ensure safe conditions for charging."
            if charge < 100 else
            "Battery is fully charged."
        )

        # M8-UC3 Predictive Battery Replacement
        results["Predictive Battery Replacement"] = (
            "Recommendation: Replace battery soon to ensure optimal performance."
            if health < 50 else
            "Battery is in good condition."
        )

        # M8-UC4 Low Battery Alert
        results["Low Battery Alert"] = (
            "Warning: Battery level critically low! Immediate action required."
            if charge < 20 else
            "Battery level is sufficient."
        )

        # M8-UC5 Flight Path Optimization
        results["Flight Path Optimization"] = (
            "Flight path optimized for efficiency."
            if charge > 50 else
            "Adjusting flight path to conserve battery."
        )

        # M8-UC6 Remote Battery Monitoring
        results["Remote Battery Monitoring"] = (
            f"Real-time Data: Charge - {charge}%, Voltage - {voltage}V, Temperature - {temperature}°C, Cycles - {cycles}"
        )

        # M8-UC7 Battery Cooling System
        results["Battery Cooling System"] = (
            "Warning: High temperature detected! Activate cooling system."
            if temperature > 40 else
            "Temperature within safe limits."
        )

        # M8-UC8 Emergency Battery Landing
        results["Emergency Battery Landing"] = (
            "Battery critically low! Initiating emergency landing protocol."
            if charge < 15 else
            "Battery level sufficient for flight."
        )

        # M8-UC9 Battery Life Estimation
        remaining_cycles = max(0, (100 - health) / 0.5)
        results["Battery Life Estimation"] = f"Estimated remaining cycles: {remaining_cycles:.0f}"

        # M8-UC10 Landing Zone Identification
        results["Landing Zone Identification"] = (
            "Identifying safe landing zone due to low battery."
            if charge < 20 else
            "Battery level sufficient; no immediate landing required."
        )

        return jsonify(results)

    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    app.run(debug=True)
