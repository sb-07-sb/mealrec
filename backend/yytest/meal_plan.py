import os
from dotenv import load_dotenv
from langchain.vectorstores import Pinecone as LangChainPinecone
from langchain.embeddings import HuggingFaceEmbeddings
from pinecone import Pinecone
from langchain_google_genai import ChatGoogleGenerativeAI
import google.generativeai as genai
import json
from recipe_filter import filter_allergens_in_variants, filter_and_sort_recipes
import ast

# Load environment variables
load_dotenv(override=True)

gemini_api_key = os.getenv('GOOGLE_API_KEY')

# Ensure your Google API key is set
genai.configure(api_key=gemini_api_key)

# Initialize Pinecone
pc = Pinecone(api_key=os.getenv('PINECONE_API_KEY'))
index_name = "recipes-index"

# Load the embedding model (same as used for storing data)
embed_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

# Connect Pinecone to LangChain
vectorstore = LangChainPinecone(pc.Index(index_name), embed_model, text_key="text")
# retriever = vectorstore.as_retriever(search_kwargs={"k": 30})  # Retrieve top 30 matches initially

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

# Format the filtered recipes into a structured prompt
def format_meal_plan_prompt(filtered_docs, query):
    """
    Formats the filtered recipes into a structured meal plan prompt for the LLM.
    """
    prompt = """Generate a weekly meal plan based on the following user persona and recipe data:
    Only use the recipes exactly as they are presented below. Do not modify the recipes, add any extra information, or create new recipes. 
    Simply output the meal name for each day, using only the recipes provided. Do not alter or adapt the meals.
    May include those recipes that have disliked ingredients if the recipes are not sufficient, by adding '^' after such recipes.
    Try not repeating the meals.Also, mention the kcal for each meal *exactly as they appear in the provided NutritionalInfo* (do not create new kcal values).
    **Select the variant that best matches the user's daily caloric intake (kcal) from the provided list of variants to meet the daily caloric intake.** You must select the variant with the appropriate kcal from the provided list of variants.
    Give response in json format only.
        User Persona:
         Dietary Restrictions: Mustard, Mushrooms
         Dislikes: Soy, Mushrooms
         Likes: Quinoa
         Meal Frequency: 3 meals per day
         Meal Timing: Breakfast, Lunch, Dinner
         Likes: Quinoa, Mediterranean cuisine, High-Protein meals
         **Daily caloric intake: >1500 kcal**
        """
    for i, doc in enumerate(filtered_docs, 1):
        metadata = doc.metadata

        prompt += f"Meal {i}:\n"
        prompt += f" Dish Name: {metadata.get('dish_name', 'Unknown')}\n"
        prompt += f" Description: {metadata.get('description', 'No description')}\n"
        prompt += f" Ingredients: {', '.join(metadata.get('ingredients', []))}\n"
        prompt += f" Spice Level: {metadata.get('spice_level', 'Not specified')}\n"
        prompt += f" Cuisine: {metadata.get('cuisine', 'Unknown')}\n"
        prompt += f" Meal Category: {metadata.get('meal_category', 'Unknown')}\n"
        prompt += f" Variants: {metadata.get('variants', 'Unknown')}\n"

    
    return prompt

"""
Name: John Doe
Age: 29
Gender: Male
Height: 180 cm
Weight: 75 kg
Activity Level: Moderately Active
Dietary Restrictions: Dairy, Mushrooms
Dislikes: Milk, Soy, Mushrooms
Likes: Quinoa
Health Goals: Weight Loss, Increase Muscle Mass
Meal Preferences: Non-Vegetarian, High Protein, Low Carb
Nutritional Preferences: High Protein, Low Carb, Moderate Fat
Meal Frequency: 3 meals per day
Meal Timing: Breakfast, Lunch, Dinner
Cuisine: Mediterranean
"""

# Query
query = "Spice Level: Medium, high_protein, Mediterranean..."

# User preferences (replace with dynamic input if needed)
user_allergens = {"Mustard", "Mushroom"}  # Example allergens
user_dislikes = {"Soy", "Mushroom"}  # Example disliked ingredients

# Step 1: Filter for dislikes and allergens in ingredients using Pinecone
pinecone_filter = {
    "allergens": {"$nin": list(user_allergens)},  # Exclude recipes containing allergens
    "ingredients": {"$nin": list(user_allergens)}  # Exclude recipes containing allergens
}

# Retrieve documents from Pinecone with filtering for dislikes and allergens in ingredients
docs = vectorstore.similarity_search(
    query=query,
    k=30,  # Fetch top 30 recipes (can be adjusted)
    filter=pinecone_filter  # Apply the filter for dislikes and allergens in ingredients
)
# print(docs)
# Step 3: Custom sorting based on the number of disliked ingredients
def count_dislikes(doc):
    recipe_ingredients = set(doc.metadata.get("ingredients", []))
    return len(recipe_ingredients.intersection(user_dislikes))

# Sort the documents by the number of disliked ingredients (ascending)
# docs_sorted = sorted(docs, key=count_dislikes)

# # Step 4: Take the top N (e.g., 40) sorted results
# final_docs = docs_sorted[:20]

# Step 2: Separate the recipes by their meal category
breakfast_docs = [doc for doc in docs if doc.metadata.get("meal_category") == "breakfast"]
meal_docs = [doc for doc in docs if doc.metadata.get("meal_category") == "meal"]
snack_docs = [doc for doc in docs if doc.metadata.get("meal_category") == "snack"]

# Step 3: Sort each category by disliked ingredients (ascending) again
# This is already sorted by the `count_dislikes` function but adding a secondary sort if needed
breakfast_docs_sorted = sorted(breakfast_docs, key=count_dislikes)
meal_docs_sorted = sorted(meal_docs, key=count_dislikes)
snack_docs_sorted = sorted(snack_docs, key=count_dislikes)

# Step 4: Select the desired number of recipes from each category
# Fetch 4 breakfast recipes
selected_breakfasts = breakfast_docs_sorted[:4]  

# Fetch 3 meal recipes
selected_meals = meal_docs_sorted[:14]

# Fetch 14 snack recipes
selected_snacks = snack_docs_sorted[:3]

# Step 5: Combine the selected recipes into a final list
final_docs = selected_breakfasts + selected_meals + selected_snacks
if len(final_docs) < 15:
    # Limit each category to 10 if total docs are less than 15
    selected_breakfasts, selected_meals, selected_snacks = [docs[:10] for docs in [breakfast_docs_sorted, meal_docs_sorted, snack_docs_sorted]]
    # Recompute the final_docs with the adjusted selection
    final_docs = selected_breakfasts + selected_meals + selected_snacks

print(len(selected_breakfasts))
print(len(selected_meals))
print(len(selected_snacks))

print(len(final_docs))  # This should be 40 or less, depending on available results


# Format the structured meal plan prompt
final_prompt = format_meal_plan_prompt(final_docs, query)
print(final_prompt)
# Generate response using the LLM
answer = generate_response(final_prompt)

print(" Suggested Meal Plan:\n", answer)