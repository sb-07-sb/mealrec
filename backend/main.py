import os
from dotenv import load_dotenv
from flask import Blueprint, Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import bcrypt
from bson import ObjectId
from admin_recipes import fetch_recipe_details
import time
from rec import recommendation_bp
from datetime import datetime

load_dotenv()

app = Flask(__name__)
CORS(app)

# Register the blueprint with a URL prefix
app.register_blueprint(recommendation_bp, url_prefix='/recommendation')

# MongoDB connection
client = MongoClient(os.getenv('MONGODB_URL'))
db = client['meal-recommendation']
login_collection = db['user-login']
form_collection = db['user-data']
meal_plans_collection = db['meal-plan']

# User Registration
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    # Check if user already exists
    if login_collection.find_one({'email': email}):
        return jsonify({'error': 'User already exists'}), 400

    # Hash password
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    # Insert into login collection with role
    user_id = login_collection.insert_one({
        'email': email,
        'password': hashed_password,
        'role': 'user'  # Add role field
    }).inserted_id

    return jsonify({'success': True, 'message': 'User registered successfully', 'user_id': str(user_id)}), 201

# User Login
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    # Find user in login collection
    user = login_collection.find_one({'email': email})
    if not user:
        return jsonify({'error': 'User not found'}), 404

    # Verify password
    if bcrypt.checkpw(password.encode('utf-8'), user['password']):
        return jsonify({
            'message': 'Login successful',
            'user_id': str(user['_id']),
            'role': user['role']  # Include role in the response
        }), 200    
    else:
        return jsonify({'error': 'Invalid password'}), 401

# Save Form Data
@app.route('/save-form', methods=['POST'])
def save_form():
    data = request.json
    user_id = data.get('user_id')

    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400

    try:
        user_id_obj = ObjectId(user_id)
    except Exception:
        return jsonify({'error': 'Invalid User ID format'}), 400

    # Check if the user exists in the login collection
    if not login_collection.find_one({'_id': user_id_obj}):
        return jsonify({'error': 'User not found'}), 404

    # Update form data if it exists, otherwise insert a new document
    form_collection.update_one(
        {'user_id': user_id},
        {'$set': data},
        upsert=True
    )

    return jsonify({'message': 'Form data saved successfully'}), 200

# Get User Form Data
@app.route('/get-form-data', methods=['GET'])
def get_form_data():
    user_id = request.args.get('user_id')

    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400

    try:
        # user_id = ObjectId(user_id)
        user_id = user_id

    except Exception:
        return jsonify({'error': 'Invalid User ID format'}), 400

    # Fetch user form data
    user_form_data = form_collection.find_one({'user_id': user_id}, {'_id': 0, 'user_id': 0})
    
    if user_form_data:
        return jsonify({'message': 'User data found', 'data': user_form_data}), 200
    else:
        default_values = { 'message': 'No data found. Returning default values.', 'data': {} }
        return jsonify(default_values), 200
    
from bson import ObjectId

@app.route('/api/admin/users', methods=['GET'])
def get_all_users():
    try:
        # Fetch all users from the user-login collection
        users = list(login_collection.find({}))

        # Fetch form data for each user from the user-data collection
        user_data = []
        for user in users:
            user_id = str(user['_id'])  # Convert ObjectId to string
            form_data = form_collection.find_one({'user_id': user_id}, {'_id': 0, 'user_id': 0})
            
            # If form_data exists, merge it with the user data
            if form_data:
                user_data.append({
                    '_id': user_id,  # Use the string version of user_id
                    'email': user['email'],
                    'role': user['role'],
                    **form_data  # Spread the form data into the user object
                })
            else:
                # If no form data exists, return default values
                user_data.append({
                    '_id': user_id,  # Use the string version of user_id
                    'email': user['email'],
                    'role': user['role'],
                    'firstName': '',
                    'lastName': '',
                    'user_pref': [],
                    'user_likes': [],
                    'size': '',
                    'spice_level': '',
                    'protein_category': '',
                    'meal_types': [],
                    'allergenTags': [],
                    'dislikeTags': []
                })

        return jsonify(user_data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# Define a route for the Flask API to get recipe details
@app.route('/api/recipes', methods=['GET'])
def get_recipes():
    recipes = fetch_recipe_details()
    
    if isinstance(recipes, list):
        return jsonify(recipes)  # Return the list of recipes as JSON
    else:
        return jsonify({"error": recipes})  # Return the error message if something went wrong


@app.route('/delete_user/<user_id>', methods=['DELETE'])
def delete_user(user_id):
    try:
        # Convert user_id to ObjectId
        object_id = ObjectId(user_id)

        # Delete from login_collection
        login_result = login_collection.delete_one({"_id": object_id})

        # Delete from form_collection using the string version of user_id
        form_result = form_collection.delete_many({"user_id": user_id})

        if login_result.deleted_count == 0:
            return jsonify({"error": "User not found in login_collection"}), 404

        return jsonify({
            "message": "User deleted successfully",
            "login_deleted": login_result.deleted_count,
            "form_deleted": form_result.deleted_count
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/update-profile', methods=['POST'])
def update_profile():
    try:
        data = request.json
        if not data or 'user_id' not in data:
            return jsonify({'error': 'User ID is required'}), 400
        
        user_id = data.get('user_id')
        if not user_id:
            return jsonify({'error': 'User ID is required'}), 400

        try:
            user_id_obj = ObjectId(user_id)
        except Exception as e:
            print("Invalid User ID:", str(e))  # Debugging line
            return jsonify({'error': 'Invalid User ID format'}), 400

        # Check if the user exists
        if not login_collection.find_one({'_id': user_id_obj}):
            return jsonify({'error': 'User not found'}), 404

        # Update profile data
        result = form_collection.update_one(
            {'user_id': user_id},
            {'$set': data},
            upsert=True
        )

        if result.modified_count > 0:
            return jsonify({'message': 'Profile updated successfully'}), 200
        else:
            return jsonify({'message': 'No changes made to the profile'}), 200

    except Exception as e:
        # In case of an error, return a JSON error response
        print("Error:", str(e))
        return jsonify({'error': 'Something went wrong'}), 500


@app.route('/save_meal_plan', methods=['POST'])
def save_meal_plan():
    try:
        data = request.json  
        
        if not data or 'mealPlan' not in data or 'user_id' not in data:
            return jsonify({"error": "Invalid request. 'user_id' and 'mealPlan' are required"}), 400

        meal_plan_entry = {
            "mealPlan": data["mealPlan"],
            "created_at": datetime.utcnow()
        }

        # Update if user_id exists, else insert a new record (upsert=True)
        result = meal_plans_collection.update_one(
            {"user_id": data["user_id"]},  # Filter by user_id
            {"$set": meal_plan_entry},  # Update meal plan & timestamp
            upsert=True
        )
        
        return jsonify({
            "message": "Meal plan saved successfully",
            "updated": result.matched_count > 0  # True if an existing document was updated
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    

@app.route('/get_meal_plan/<user_id>', methods=['GET'])
def get_meal_plan(user_id):
    try:
        meal_plan_entry = meal_plans_collection.find_one({"user_id": user_id})
        
        if not meal_plan_entry:
            return jsonify({"message": "No meal plan found"}), 404

        return jsonify({
            "mealPlan": meal_plan_entry["mealPlan"]
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
