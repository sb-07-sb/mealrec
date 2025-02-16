import traceback

import os
from dotenv import load_dotenv

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask import Flask, session, request, redirect, url_for, render_template
from datetime import timedelta
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
from bson import ObjectId  # Import ObjectId from bson

load_dotenv()

app = Flask(__name__)
CORS(app, supports_credentials=True)  # Allow cross-origin requests (e.g., from React)

app.secret_key = 'voXaxHr9NprGGHTHgTTGTr_5nwiUNtF8'
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=30)

# MongoDB Client Setup
uri =  os.getenv('MONGODB_URL')  
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
        session['user_id'] = str(user['_id'])
        session.permanent = True
        return jsonify({"message": "Login successful", "userId": str(user['_id'])   
})
    
    return jsonify({"error": "Invalid email or password"}), 401


@app.route('/check-session', methods=['GET'])
def check_session():
    if 'user_id' in session:
        # User is logged in
        return jsonify({"success": True, "userId": session['user_id']}), 200
    else:
        # User is not logged in
        return jsonify({"success": False, "message": "Not logged in"}), 401

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
            session['user_id'] = str(user['_id'])
            session.permanent = True
            return jsonify({"message": "Admin login successful", "userId": str(user['_id'])})
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
        # Fetch the corresponding user data from user_data_collection to get fullName
        user_data = user_data_collection.find_one({'user_id': str(user['_id'])})
        
        # Check if user_data is found, and retrieve the fullName (if it exists)
        full_name = user_data['fullName'] if user_data else 'user'
        
        # Append user info with fullName
        users_list.append({
            'id': str(user['_id']),
            'email': user['email'],
            'role': user['role'],
            'fullName': full_name  # Add fullName from user_data_collection
        })
    
    return jsonify({'success': True, 'users': users_list})


@app.route('/admin/get_user_data/<user_id>', methods=['GET'])
def get_user_data(user_id):
    user_data = user_data_collection.find_one({'user_id': user_id})  # Fetch user data by user_id
    
    if user_data:
        # Extract only the 'value' from the 'activityLevel' field and other fields dynamically
        user_data_filtered = {key: value['value'] if isinstance(value, dict) and 'value' in value else value
                              for key, value in user_data.items()}
        # Convert ObjectId to string for '_id'
        user_data_filtered['_id'] = str(user_data['_id'])
        
        return jsonify({'success': True, 'user_data': user_data_filtered})
    else:
        return jsonify({'success': False, 'message': 'User not found'}), 404

@app.route('/admin/update_user_data/<user_id>', methods=['PUT'])
def update_user_data(user_id):
    try:
        # Get the request body
        data = request.get_json()

        if not data:
            return jsonify({'success': False, 'message': 'No data received'}), 400

        # Filter out invalid fields and ensure _id is not part of the update
        valid_data = {key: value for key, value in data.items() if key != '_id' and value not in [None, "", "null", "undefined"]}

        if not valid_data:
            return jsonify({'success': False, 'message': 'No valid fields to update'}), 400

        # Search using `user_id` as a string
        result = user_data_collection.update_one(
            {'user_id': user_id},  # Correct query: search by `user_id` field
            {'$set': valid_data}
        )

        if result.modified_count > 0:
            return jsonify({'success': True, 'message': 'User data updated successfully'})
        else:
            return jsonify({'success': False, 'message': 'No changes made '}), 404

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'success': False, 'message': 'Error updating user data'}), 500


@app.route('/admin/delete_user/<user_id>', methods=['DELETE'])
def delete_user(user_id):
    try:
        # First, try to delete the user data from user_data_collection
        user_data_result = user_data_collection.delete_one({'user_id': user_id})
        
        # If user data doesn't exist (no deletion happened), we can still proceed with deleting the user profile
        if user_data_result.deleted_count == 0:
            print(f"User data not found for user_id: {user_id}, skipping deletion from user_data_collection.")
        
        # Now, delete the user from user_profile_collection
        user_profile_result = user_profile_collection.delete_one({'_id': ObjectId(user_id)})

        # Check if the user profile was deleted successfully
        if user_profile_result.deleted_count == 0:
            return jsonify({'success': False, 'message': 'User not found in user_profile collection'}), 404

        return jsonify({'success': True, 'message': 'User deleted successfully'})

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'success': False, 'message': 'Error deleting user'}), 500

@app.route('/logout', methods=['POST'])
def logout():
    session.clear()  # Remove session data
    return jsonify({"message": "Logged out successfully"}), 200


if __name__ == "__main__":
    app.run(debug=True)



