from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
from bson import ObjectId  # Import ObjectId from bson

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests (e.g., from React)

# MongoDB Client Setup
uri =  "mongodb+srv://sbadmin:admin@sb.pxhni.mongodb.net/?retryWrites=true&w=majority&appName=SB"   
client = MongoClient(uri)

db = client["meal-plan"]
user_profile_collection = db["user-profile"]
user_data_collection = db["user-data"]

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    user = user_profile_collection.find_one({"email": email})
    
    if user and check_password_hash(user['password'], password):
        return jsonify({"message": "Login successful"})
    
    return jsonify({"error": "Invalid email or password"}), 401

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    semail = data.get('semail')
    spassword = data.get('spassword')

    if not semail or not spassword:
        return jsonify({"error": "Email and password are required"}), 400

    existing_user = user_profile_collection.find_one({"email": semail})
    if existing_user:
        return jsonify({"error": "User already exists"}), 400

    hashed_password = generate_password_hash(spassword)

    # Insert user into the user_profile collection
    result = user_profile_collection.insert_one({
        "email": semail,
        "password": hashed_password,
        "role": "user"
    })

    # Get the inserted user's ID
    user_id = result.inserted_id

    return jsonify({"message": "Signup successful", "user_id": str(user_id)}), 201

@app.route('/save_user_data', methods=['POST'])
def save_user_data():
    data = request.get_json()
    email = data.get('email')

    # Validate user is logged in or exists
    user = user_profile_collection.find_one({"email": email})
    if not user:
        return jsonify({"error": "User not found"}), 404

    user_id = str(user['_id'])  # Extract the user_id from the user_profile collection


# Remove unwanted fields (semail, spassword, email, password)
    keys_to_remove = ['semail', 'spassword', 'email', 'password']
    filtered_data = {key: value for key, value in data.items() if key not in keys_to_remove}

    # Prepare the user data to be saved, including the user_id
    user_data = {
        "user_id": user_id,
        "fullName": data.get("fullName"),
        "gender": data.get("gender"),
        "age": data.get("age"),
        "height": data.get("height"),
        "currentWeight": data.get("currentWeight"),
        "targetWeight": data.get("targetWeight"),
        "bodyType": data.get("bodyType"),
        "healthConditions": data.get("healthConditions"),
        "allergies": data.get("allergies"),
        "chronicConditions": data.get("chronicConditions"),
        "bloodSugar": data.get("bloodSugar"),
        "currentMedications": data.get("currentMedications"),
        "ethnicity": data.get("ethnicity"),
        "dietType": data.get("dietType"),
        "foodPreferences": data.get("foodPreferences"),
        "mealFrequency": data.get("mealFrequency"),
        "nutrientSensitivities": data.get("nutrientSensitivities"),
        "activityLevel": data.get("activityLevel"),
        "injuries": data.get("injuries"),
        "exerciseType": data.get("exerciseType"),
        "exerciseFrequency": data.get("exerciseFrequency"),
        "exerciseDuration": data.get("exerciseDuration"),
        "fitnessGoal": data.get("fitnessGoal"),
        "caloricIntake": data.get("caloricIntake"),
        "macronutrientPreference": data.get("macronutrientPreference"),
        "mealTiming": data.get("mealTiming"),
        "supplements": data.get("supplements")
    }
# Check if user data already exists
    existing_user_data = user_data_collection.find_one({"user_id": user_id})

    if existing_user_data:
        # Update the existing user data
        user_data_collection.update_one(
            {"user_id": user_id},    # Find the user data based on email
            {"$set": user_data}       # Update the existing fields with the new data
        )
        return jsonify({"message": "User data updated successfully"}), 200
    else:
        # Insert new user data if it doesn't exist
        user_data_collection.insert_one(user_data)
        return jsonify({"message": "User data saved successfully"}), 201

# Admin Login Route
@app.route('/admin-login', methods=['POST'])
def admin_login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    # Check if user exists in the user-profile collection
    user = user_profile_collection.find_one({"email": email})

    if user:
        # Check if the user is an admin
        if user['role'] == 'admin' and check_password_hash(user['password'], password):
            return jsonify({"message": "Admin login successful"})
        else:
            return jsonify({"error": "You are not authorized to log in as admin"}), 403
    else:
        return jsonify({"error": "Invalid email or password"}), 401

 
# Example route in Flask to get users
@app.route('/admin/get_users', methods=['GET'])
def get_users():
    users = user_profile_collection.find()  # Fetch all users from MongoDB
    users_list = []
    for user in users:
        users_list.append({
            'id': str(user['_id']),
            'email': user['email'],
            'role': user['role']
        })
    return jsonify({'success': True, 'users': users_list})

@app.route('/admin/get_user_data/<user_id>', methods=['GET'])
def get_user_data(user_id):
    # Fetch the user profile from the user_profile_collection
    user  = user_profile_collection.find_one({"_id": ObjectId(user_id)})

    if not user:
        return jsonify({'success': False, 'message': 'User not found'}), 404
    
    # Fetch additional user data from user_data_collection (assuming a 'user_id' field)
    user_data = user_data_collection.find_one({'user_id': user['_id']})

    if not user_data:
        return jsonify({'success': False, 'message': 'User data not found'}), 404

    # Combine the user profile data and user data
    user_details = {
        'user': {
            'id': str(user['_id']),
            'email': user['email'],
            'role': user['role']
        },
        'user_data': user_data  # Add the user data fetched from the user_data_collection
    }

    return jsonify({'success': True, 'user_details': user_details})


if __name__ == "__main__":
    app.run(debug=True)



