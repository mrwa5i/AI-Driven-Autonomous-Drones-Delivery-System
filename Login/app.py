from flask import Flask, render_template, request, redirect, url_for, jsonify
import csv
import re

app = Flask(__name__ , template_folder="./Template" , static_folder="./static")

# Set up a secret key for session management
app.secret_key = 'your_secret_key'

# Validate email format
def validate_email(email):
    email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(email_regex, email)

# Check if username or email already exists in the "database"
def user_exists(username, email):
    with open('users.csv', mode='r') as file:
        reader = csv.DictReader(file)
        for row in reader:
            if row['Username'] == username or row['Email'] == email:
                return True
    return False

# Save new user to the CSV file
def save_user(user):
    with open('users.csv', mode='a', newline='') as file:
        writer = csv.DictWriter(file, fieldnames=["Full Name", "Username", "Email", "Password", "Address"])
        writer.writerow(user)

# Home route - Sign In Page
@app.route('/signin')
def signin():
    return render_template('signin.html')

# Sign Up route
@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()

    fullname = data.get('fullname')
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    address = data.get('address')

    # Validate input
    if not fullname or not username or not email or not password or not address:
        return jsonify({"message": "All fields are required!"}), 400
    
    if not validate_email(email):
        return jsonify({"message": "Invalid email format!"}), 400
    
    if user_exists(username, email):
        return jsonify({"message": "Username or Email already exists!"}), 400
    
    # Save user data to CSV
    user = {
        "Full Name": fullname,
        "Username": username,
        "Email": email,
        "Password": password,  # In a real app, you should hash the password before saving
        "Address": address
    }

    save_user(user)

    return jsonify({"message": "Account created successfully!"}), 200

# Run the app
if __name__ == '__main__':
    app.run(debug=True)
