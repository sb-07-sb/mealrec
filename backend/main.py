import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import bcrypt
from bson import ObjectId


load_dotenv()

app = Flask(__name__)
CORS(app)

# MongoDB connection
client = MongoClient(os.getenv('MONGODB_URL') )
db = client['meal-recommendation']
login_collection = db['user-login']
form_collection = db['user-data']

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

    # Insert into login collection
    user_id = login_collection.insert_one({
        'email': email,
        'password': hashed_password
    }).inserted_id

    return jsonify({'message': 'User registered successfully', 'user_id': str(user_id)}), 201

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
        return jsonify({'message': 'Login successful', 'user_id': str(user['_id'])}), 200
    else:
        return jsonify({'error': 'Invalid password'}), 401

# Save Form Data
@app.route('/save-form', methods=['POST'])
def save_form():
    data = request.json
    
    # Hardcode the user_id here (replace with an actual user _id from the `user-login` collection)
    user_id = "67dbb8b0365a4efca98c9a36"  # Replace this with the actual _id from MongoDB

    try:
        # Convert string user_id to ObjectId if it's a valid MongoDB ObjectId
        user_id = ObjectId(user_id)
    except Exception as e:
        return jsonify({'error': 'Invalid User ID format'}), 400

    # Check if the user exists in the login collection
    user = login_collection.find_one({'_id': user_id})
    if not user:
        return jsonify({'error': 'User not found'}), 404

    # Insert the form data into the user-data collection
    form_collection.insert_one({
        'user_id': user_id,
        **data  # Spread the rest of the form data
    })

    return jsonify({'message': 'Form data saved successfully'}), 201


if __name__ == '__main__':
    app.run(debug=True)