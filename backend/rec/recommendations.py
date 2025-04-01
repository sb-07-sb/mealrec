import os
from dotenv import load_dotenv
from langchain.vectorstores import Pinecone as LangChainPinecone
from langchain.embeddings import HuggingFaceEmbeddings
from pinecone import Pinecone
from langchain_google_genai import ChatGoogleGenerativeAI
import google.generativeai as genai
import json
# from recipe_filter import filter_allergens_in_variants, filter_and_sort_recipes
import ast

# Load environment variables
load_dotenv(override=True)

gemini_api_key = os.getenv('GOOGLE_API_KEY')

# Ensure your Google API key is set
genai.configure(api_key=gemini_api_key)

# Initialize Pinecone
pc = Pinecone(api_key=os.getenv('PINECONE_API_KEY'))
index_name = "recipes-fin"

# Load the embedding model (same as used for storing data)
embed_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

# Connect Pinecone to LangChain
vectorstore = LangChainPinecone(pc.Index(index_name), embed_model, text_key="text")

# Initialize ChatGoogleGenerativeAI for gemini-1.5-flash
llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash",
    temperature=0,
    max_tokens=None,
    timeout=None,
    max_retries=2,
)

# Function to generate responses
def generate_response(prompt):
    model = genai.GenerativeModel("gemini-1.5-flash")
    # Generate content based on the prompt
    response = model.generate_content(prompt)
    return response.text

# Function to filter and sort recipes
def filter_recipes(vectorstore, user_avoid_ingredients, user_dislikes, query, meal_category, size, protein_option, protein_category, top_k):
    pinecone_filter = {
        "meal_category": {"$eq": meal_category},  # Filter for specific meal type
        "size": {"$eq": size},  # Filter for specific size
        # "protein_option": {"$eq": protein_option},  # Filter for specific protein option
        "protein_category": {"$eq": protein_category},  # Filter for specific protein category
        "allergens": {"$nin": list(user_avoid_ingredients)},  # Exclude recipes containing allergens
        "ingredients": {"$nin": list(user_avoid_ingredients)}  # Exclude recipes containing allergens
    }
    # # Add `protein_category` filter only if it's not empty
    # if protein_category:
    #     pinecone_filter["protein_category"] = {"$eq": protein_category}


    # Fetch documents using similarity_search
    docs = vectorstore.similarity_search(
        query=query,
        k=top_k * 3 ,  # Get extra to account for duplicates
        filter=pinecone_filter
    )

    # Merge recipes by recipe_id and combine protein_options
    merged_recipes = {}

    
    for doc in docs:
        metadata = doc.metadata
        recipe_id = metadata.get("recipe_id")
        
        # Skip if no recipe_id exists
        if not recipe_id:
            continue
        
        # Initialize new entry if recipe_id not seen
        if recipe_id not in merged_recipes:
            merged_recipes[recipe_id] = {
                **metadata,  # Copy all metadata
                "protein_option": {metadata.get("protein_option")}  # Start as set
            }
        else:
            # Merge protein_options
            existing = merged_recipes[recipe_id]
            new_protein = metadata.get("protein_option")
            if new_protein:
                existing["protein_option"].add(new_protein)
    
    # Prepare final output (convert sets to lists)
    final_recipes = [
        {
            **data,
            "protein_option": list(data["protein_option"]) if data["protein_option"] else []
        }
        for data in merged_recipes.values()
    ]
    print("final",final_recipes[:top_k])
    return final_recipes[:top_k]

# Function to format the filtered recipes into a structured meal plan prompt
def format_meal_plan_prompt(merged_recipes, query, user_avoid_ingredients, user_likes, user_dislikes, user_pref, meal_types, num_days):

        # Normalize meal types by stripping whitespace and converting to lowercase
    normalized_meal_types = {meal.strip().lower() for meal in meal_types}
    
    # Define the standard meal type order (customize as needed)
    STANDARD_ORDER = ['morning_snack', 'breakfast', 'lunch', 'dinner', 'evening_snack']
    
    # Filter and order the meal types based on standard order
    ordered_meal_types = [meal for meal in STANDARD_ORDER 
                         if meal in normalized_meal_types]
    
    prompt = f"""Generate a {num_days} day meal plan in JSON format using ONLY the provided recipes. Follow these rules exactly:

1. Recipe Usage:
- Use recipes exactly as provided - do not modify or create new ones
- Format each meal as: "<Dish Name> - <Selected Protein> - <Cuisine> - <Dish Type>"
- Use ONLY the dish_type field for the last component (never meal_category)
- For recipes with multiple protein options:
    * Ensure protein variety across the week (don't serve chicken 3 days in a row)

3. Meal Diversity:
- Alternate between:
  * Light vs heavy meals (e.g. salad → hearty stew)
  * Different cuisines (don't repeat back-to-back)
  * Cooking methods (grilled, baked, fried, etc.)
- Ensure no two consecutive meals have:
  * The same primary ingredient
  * Similar textures/flavor profiles

2. Meal Assignment:
- Never repeat recipes before all are used once
- Fill all selected meal slots - no empty values
- **Strictly follow meal categories:**
    * Breakfast: only 'breakfast' recipes having meal_category as breakfast
    * Lunch/Dinner: only 'meal' recipes having meal_category as meal
    * evening_snavk/morning_snack: only 'snack' recipes i.e. recipes having meal_category as snack
- Include only these meal types: {meal_types}

3. Daily Structure:
- You MUST include these meal types in EXACTLY this order: {ordered_meal_types}
- Never skip or rearrange these meal types
- Never include meal types not in this list
- Maintain consistent meal types across all days

Output Format: Present the meal plan as a JSON object where each day contains meal types as keys and the formatted meal string as values, like this example for Monday: {{\"Monday\": {{\"breakfast\": \"Dish Name - Protein - Cuisine - Dish Type\", \"lunch\": \"...\"}}}}User Preferences:
- Allergens: {user_avoid_ingredients}
- Likes: {user_likes}
- Dislikes: {user_dislikes}
- Preferred Dishes: {user_pref}
- Selected Meal Types: {meal_types}

Available Recipes:"""
    

    for i, recipe in enumerate(merged_recipes, 1):
        prompt += f"Meal {i}:\n"
        prompt += f" Dish Name: {recipe.get('dish_name', 'Unknown')}\n"
        prompt += f" Description: {recipe.get('description', 'No description')}\n"
        prompt += f" Protein Options: {', '.join(recipe.get('protein_option', []))}\n"  # Changed to handle list
        prompt += f" Dish Type: {', '.join(recipe.get('dish_type', []))}\n"  # Changed to handle list
        prompt += f" Ingredients: {', '.join(recipe.get('ingredients', []))}\n"
        prompt += f" Spice Level: {recipe.get('spice_level', 'Not specified')}\n"
        prompt += f" Cuisine: {recipe.get('cuisine', 'Unknown')}\n"
        prompt += f" Meal Category: {recipe.get('meal_category', 'Unknown')}\n"
    return prompt

# Main function to generate the meal plan
def generate_meal_plan(vectorstore, user_avoid_ingredients, user_dislikes, query, user_likes, user_pref, size, protein_option, protein_category, meal_types, num_days):
    # Define mapping of meal types to their respective counts
    meal_counts = {
        "breakfast": num_days,
        "snack": num_days,  # Each snack type (morning/evening) adds 8
        "meal": 0    # Lunch and Dinner are combined into "meal"
    }

    # Initialize counts
    total_snack_count = 0
    total_meal_count = 0
    fetched_recipes = {}

    # Calculate needed recipes
    if "morning_snack" in meal_types or "evening_snack" in meal_types:
        total_snack_count = meal_counts["snack"] * sum(1 for meal in meal_types if "snack" in meal)

    if "lunch" in meal_types:
        total_meal_count += num_days
    if "dinner" in meal_types:
        total_meal_count += num_days

    # Initial fetch (with allergens)
    for meal_type in meal_types:
        count = meal_counts.get(meal_type, 0)
        if count > 0:
            meal_size = "standard" if meal_type in ["breakfast", "snack"] else size
            fetched_recipes[meal_type] = filter_recipes(
                vectorstore, user_avoid_ingredients, user_dislikes, query, 
                meal_type, meal_size, "", protein_category, (count+3)
            )

    if total_meal_count > 0:
        fetched_recipes["meal"] = filter_recipes(
            vectorstore, user_avoid_ingredients, user_dislikes, query,
            "meal", size, protein_option, protein_category, (total_meal_count+3)
        )

    if total_snack_count > 0:
        fetched_recipes["snack"] = filter_recipes(
            vectorstore, user_avoid_ingredients, user_dislikes, query,
            "snack", "standard", "", protein_category, (total_snack_count+3)
        )

    # # Calculate expected minimums
    # expected_breakfast = max(0, meal_counts.get("breakfast", 0) - 4) if "breakfast" in meal_types else 0
    # expected_snack = max(0, total_snack_count - (3 if total_snack_count == 8 else 6 if total_snack_count == 16 else 0)) if any("snack" in mt for mt in meal_types) else 0
    # expected_meal = max(0, total_meal_count - (2 if total_meal_count == 8 else 7 if total_meal_count == 20 else 0)) if ("lunch" in meal_types or "dinner" in meal_types) else 0
    # print("fetched",fetched_recipes)    
    
    expected_breakfast = max((min(num_days, 4) + min(1, num_days)) - (0 if num_days <= 2 else 1 if num_days <= 5 else min(2, (min(num_days, 4) + min(1, num_days)) // 3)), 1) if "breakfast" in meal_types else 0
    expected_snack = max(total_snack_count - (0 if num_days <= 3 else 1 if num_days <= 5 else min(2, total_snack_count // 3)), 1) if any("snack" in mt for mt in meal_types) else 0
    expected_meal = max(total_meal_count - (0 if num_days <= 3 else 1 if num_days <= 5 else min(2, total_meal_count // 3)), 1) if ("lunch" in meal_types or "dinner" in meal_types) else 0    
    
    print("fetched",fetched_recipes)


    # Selective retry (only replaces deficient categories)
    if "breakfast" in meal_types and len(fetched_recipes.get("breakfast", [])) < expected_breakfast:
        print(f"Breakfast shortage ({len(fetched_recipes.get('breakfast', []))}/{expected_breakfast}), retrying without filters...")
        fetched_recipes["breakfast"] = filter_recipes(
            vectorstore, set(), user_dislikes, query,
            "breakfast", "standard", "", protein_category, meal_counts["breakfast"]+3
        )

    if any("snack" in mt for mt in meal_types) and len(fetched_recipes.get("snack", [])) < expected_snack:
        print(f"Snack shortage ({len(fetched_recipes.get('snack', []))}/{expected_snack}), retrying without filters...")
        fetched_recipes["snack"] = filter_recipes(
            vectorstore, set(), user_dislikes, query,
            "snack", "standard", "", protein_category, total_snack_count+3
        )

    if ("lunch" in meal_types or "dinner" in meal_types) and len(fetched_recipes.get("meal", [])) < expected_meal:
        print(f"Meal shortage ({len(fetched_recipes.get('meal', []))}/{expected_meal}), retrying without filters...")
        fetched_recipes["meal"] = filter_recipes(
            vectorstore, set(), user_dislikes, query,
            "meal", size, protein_option, protein_category, total_meal_count+3
        )
    print("fetched",fetched_recipes)

    # Debug output
    print("\nFinal recipe counts:")
    for category in ["breakfast", "snack", "meal"]:
        if category in fetched_recipes:
            print(f"{category.capitalize()}: {len(fetched_recipes[category])}")

    # Generate meal plan
    final_docs = [recipe for recipes in fetched_recipes.values() for recipe in recipes]
    final_prompt = format_meal_plan_prompt(final_docs, query, user_avoid_ingredients, user_likes, user_dislikes, user_pref, meal_types, num_days)
    meal_plan = generate_response(final_prompt)

    return meal_plan, final_docs


def generate_query(user_pref, user_likes, spice_level="Low"):
    # Format the cuisine and spice level part of the query
    query = f"Spice Level: {spice_level}, Cuisine: {user_pref}. Popular Dishes: {user_likes}"

    return query



# Example usage
if __name__ == "__main__":
    # User preferences (replace with dynamic input if needed)
    user_avoid_ingredients = {}  # Example allergens
    # user_dislikes = {
    #     "Cod (white fish)", "Cod Fish", "Cuttlefish", "Fish Sauce",
    #     "Gochujang Paste", "Gochujang Sauce", "Local Wild Fish",
    #     "Nile Perch", "Salmon", "Sea Bass", "Squid", "Tuna",
    #     "White Fish", "Worcestershire Sauce"
    # }  # Example disliked ingredients
    
    # query = "Spice Level: Medium, Cuisine: Mediterranean,European,Comfort Food. Popular Dishes: Classic Chicken Salad, Crudites & Sour Cream Dip, Mini Quiches, Omega Egg Protein Pot"

    # Generate the meal plan
    # generate_meal_plan(vectorstore, user_avoid_ingredients, user_dislikes, query, user_likes, user_pref)