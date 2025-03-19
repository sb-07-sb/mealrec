import os
from dotenv import load_dotenv
from langchain.vectorstores import Pinecone as LangChainPinecone
from langchain.embeddings import HuggingFaceEmbeddings
from pinecone import Pinecone
# from main import generate_meal_plan  # Import the function from llm.py
from flask import Flask, request, jsonify
from pinecone_embeddings import format_and_push_to_pinecone
from recipes_fetch import fetch_api_data  # Import the fetch_api_data function
from recommendations import generate_meal_plan
import json

# Load environment variables
load_dotenv(override=True)

app = Flask(__name__)

gemini_api_key = os.getenv('GOOGLE_API_KEY')

# Initialize Pinecone
pc = Pinecone(api_key=os.getenv('PINECONE_API_KEY'))
index_name = "recipes-fin"

# Load the embedding model (same as used for storing data)
embed_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

# Connect Pinecone to LangChain
vectorstore = LangChainPinecone(pc.Index(index_name), embed_model, text_key="text")


@app.route('/save_to_pinecone', methods=['POST'])
def save_recipes():
    try:
        # Fetch recipes directly by calling fetch_api_data()
        recipes = fetch_api_data()
        
        if not recipes:
            return jsonify({"error": "No recipes fetched or found."}), 404

        # Save fetched recipes to Pinecone
        format_and_push_to_pinecone(recipes)
        
        return jsonify({"message": f"Successfully saved {len(recipes)} recipes to Pinecone."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@app.route('/generate-meal-plan', methods=['POST'])
def generate_meal_plan_api():
    data = request.get_json()

     # Extract parameters and ensure they match the function's expected format
    user_allergens = set(data.get('user_allergens', []))  # Default to empty list if not provided
    user_dislikes = set(data.get('user_dislikes', []))  # Default to empty list if not provided 

    query = data.get("query", "")
    user_likes = data.get("user_likes", "")
    user_pref = data.get("user_pref", "")
    size = data.get("size", "").lower()  # Convert to lowercase
    protein_option = data.get("protein_option", "")
    protein_category = data.get("protein_category", "").lower()  # Convert to lowercase
    meal_types = set(data.get("meal_types", []))  # Convert list to set


    # Call the function
    meal_plan, final_docs = generate_meal_plan(
        vectorstore,
        user_allergens,
        user_dislikes,
        query,
        user_likes,
        user_pref,
        size,
        protein_option,
        protein_category,
        meal_types
    )
   # Check if the meal_plan is empty or malformed
    if not meal_plan:
        return jsonify({"error": "Meal plan generation failed, no data returned"}), 400

    # Debugging: Print the raw meal plan string to the console
    print("Raw Meal Plan String: ", meal_plan)

    # Clean the meal plan string using the helper function
    meal_plan_cleaned = clean_meal_plan_string(meal_plan)

    # Debugging: Print the cleaned string before parsing
    print("Cleaned Meal Plan String: ", meal_plan_cleaned)

    # Try to parse the cleaned string into a valid JSON object
    try:
        meal_plan_json = json.loads(meal_plan_cleaned)  # Parse the meal plan if it's a string
        print("Parsed Meal Plan JSON: ", meal_plan_json)
    except json.JSONDecodeError as e:
        # Log the exact error
        print("JSONDecodeError:", e)
        return jsonify({"error": "Failed to decode the meal plan response", "details": str(e)}), 500

    # Return the parsed meal plan
    return jsonify({"meal_plan": meal_plan_json})

# Function to clean the meal plan string
def clean_meal_plan_string(meal_plan: str) -> str:
    """
    Clean the raw meal plan string by removing backticks, extra newline characters,
    and escape sequences.
    """
    # Remove ```json and closing ```
    cleaned_plan = meal_plan.strip().lstrip("```json").rstrip("```").strip()

    # Further cleaning of newline characters and escape sequences
    cleaned_plan = cleaned_plan.replace("\n", "").replace("\\", "")

    return cleaned_plan



if __name__ == "__main__":
    app.run(debug=True)