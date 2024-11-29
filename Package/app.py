from flask import Flask, render_template, request, redirect, url_for
import csv
from flask import jsonify

app = Flask(__name__, template_folder="./Template", static_folder="./Static")

def get_package_by_id(package_id):
    with open('packages.csv', mode='r') as file:
        for row in file.readlines():
            if row.split(",")[0] == package_id:
                return row.split(",")
    return None

def save_package(package):
    with open('packages.csv', mode='a', newline='') as file:
        writer = csv.DictWriter(file, fieldnames=["Package ID", "Package Name", "Delivery Address", "Recipient Name", "Contact Number", "Weight (kg)", "Status"])
        writer.writerow(package)

@app.route('/')
def index():
    return render_template('package_form.html')

@app.route('/submit-package', methods=['POST'])
def submit_package():
    package_name = request.form['package_name']
    delivery_address = request.form['delivery_address']
    recipient_name = request.form['recipient_name']
    contact_number = request.form['contact_number']
    weight = request.form['weight']

    with open('packages.csv', mode='r') as file:
        rows = list(csv.DictReader(file))
        next_package_id = str(len(rows) + 1)

    new_package = {
        "Package ID": next_package_id,
        "Package Name": package_name,
        "Delivery Address": delivery_address,
        "Recipient Name": recipient_name,
        "Contact Number": contact_number,
        "Weight (kg)": weight,
        "Status": "In Transit"
    }

    save_package(new_package)
    return redirect(url_for('package_detail', package_id=next_package_id))

@app.route('/package-detail', methods=['GET', 'POST'])
def package_detail():
    package_id = request.args.get('package_id') if request.method == 'GET' else request.form.get('package_id')
    package = get_package_by_id(package_id)

    if package:
        return render_template('package_detail.html', package=package)
    else:
        return render_template('package_detail.html', error="Package not found")


@app.route("/monitor-status", methods=["POST"])
def monitor_status():
    package_id = request.form["package_id"]
    
    # Read CSV and check for package ID
    package = get_package_by_id(package_id)

    if package:
        # Extract the current status from the CSV row
        current_status = package[6]  # Assuming the status is in the 7th column (index 6)
        
        # Return the package status as a response
        return jsonify({
            "package_id": package_id,
            "status": current_status
        })
    else:
        return jsonify({"error": "Package not found"})


if __name__ == '__main__':
    app.run(debug=True)
