# import os
# import json
# from dotenv import load_dotenv
# from langchain.vectorstores import Pinecone as LangChainPinecone
# from langchain.embeddings import HuggingFaceEmbeddings
# from pinecone import Pinecone
# from recipe_filter import filter_recipes
# from langchain_google_genai import ChatGoogleGenerativeAI
# import google.generativeai as genai


# # Load environment variables
# load_dotenv(override=True)

# gemini_api_key = os.getenv('GOOGLE_API_KEY')


# # Ensure your Google API key is set
# genai.configure(api_key=gemini_api_key)

# # Initialize Pinecone
# pc = Pinecone(api_key=os.getenv('PINECONE_API_KEY'))
# index_name = "recipes"

# # Load the embedding model (same as used for storing data)
# embed_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

# # Connect Pinecone to LangChain
# vectorstore = LangChainPinecone(pc.Index(index_name), embed_model, text_key="text")
# retriever = vectorstore.as_retriever(search_kwargs={"k": 30})  # Retrieve top 8 matches

# # Initialize ChatGoogleGenerativeAI for gemini-1.5-flash
# llm = ChatGoogleGenerativeAI(
#     model="gemini-1.5-flash",
#     temperature=0,
#     max_tokens=None,
#     timeout=None,
#     max_retries=2,
#     # other params...
# )

# # Function to generate responses
# def generate_response(prompt):
#     model = genai.GenerativeModel("gemini-1.5-flash")
    
#     # Generate content based on the prompt
#     response = model.generate_content(prompt)
#     return response.text

# # Format the filtered recipes into a structured prompt
# def format_meal_plan_prompt(filtered_docs, query):
#     """
#     Formats the filtered recipes into a structured meal plan prompt for the LLM.
#     """
#     prompt = """Generate a weekly meal plan based on the following user persona and recipe data:
#     Only use the recipes exactly as they are presented below. Do not modify the recipes, add any extra information, or create new recipes. 
#     Simply output the meal name for each day, using only the recipes provided. Do not alter or adapt the meals.
#         User Persona:
#          Name: John Doe
#          Age: 29
#          Gender: Male
#          Height: 180 cm
#          Weight: 75 kg
#          Activity Level: Moderately Active
#          Dietary Restrictions: Mustard, Nuts
#          Dislikes: Nuts
#          Likes: Quinoa
#          Health Goals: Weight Loss, Increase Muscle Mass
#          Meal Preferences: Non-Vegetarian, High Protein, Low Carb
#          Nutritional Preferences: High Protein, Low Carb, Moderate Fat
#          Meal Frequency: 3 meals per day
#          Meal Timing: Breakfast, Lunch, Dinner
#          Cuisine: Mediterranean
#         """
#     for i, doc in enumerate(filtered_docs, 1):
#         metadata = doc.metadata

#         prompt += f"Meal {i}:\n"
#         prompt += f" Dish Name: {metadata.get('dish_name', 'Unknown')}\n"
#         prompt += f" Description: {metadata.get('description', 'No description')}\n"
#         prompt += f" Ingredients: {', '.join(metadata.get('ingredients', []))}\n"
#         prompt += f" Spice Level: {metadata.get('spice_level', 'Not specified')}\n"
#         prompt += f" Cuisine: {metadata.get('cuisine', 'Unknown')}\n"
#         prompt += f" Meal Category: {metadata.get('meal_category', 'Unknown')}\n"
#         prompt += "-" * 40 + "\n"

#     return prompt

# # Query
# query = "Spice Level: Medium, high_protein, Mediterranean, Mushroom ..."

# # User preferences (replace with dynamic input if needed)
# ethnicity = "Asian"  # Example ethnicity
# meal_preference = "Vegetarian"  # Example meal preference (e.g., Vegetarian, Non-Vegetarian, Vegan, etc.)
# goal = "Weight Loss"  # Example goal (e.g., Weight Loss, Weight Gain, Maintenance)

# # User preferences (replace with dynamic input if needed)
# user_allergens = {"Mustard", "Nuts"}  # Example allergens
# user_dislikes = {"Olive", "Soy"}  # Example disliked ingredients

# # Retrieve documents from Pinecone
# docs = retriever.get_relevant_documents(query)

# # Filter out recipes that contain allergens or disliked ingredients
# filtered_docs = filter_recipes(docs, user_allergens, user_dislikes)

# # Pass the cleaned recipes to LLM
# if not filtered_docs:
#     print("⚠️ No suitable recipes found after filtering.")
# else:
#     filtered_texts = [doc.page_content for doc in filtered_docs]
#     final_prompt = "\n\n".join(filtered_texts) + f"\n\n{query}"
#     print("_______________________________________________")
#     print(filtered_texts)
#     print(len(filtered_texts))
#     print()
#     print()
#     # answer = generate_response(final_prompt)
#     # print(" Suggested Meal Plan:\n", answer)

#      # Format the structured meal plan prompt
#     final_prompt = format_meal_plan_prompt(filtered_docs, query)

#     print(" Final Prompt Sent to LLM:\n", final_prompt)  # Debugging step

#     # # Generate response using the LLM
#     # answer = generate_response(final_prompt)
    
#     # print(" Suggested Meal Plan:\n", answer)


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
def filter_recipes(vectorstore, user_allergens, user_dislikes, query):
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

    # Custom sorting based on the number of disliked ingredients
    def count_dislikes(doc):
        recipe_ingredients = set(doc.metadata.get("ingredients", []))
        return len(recipe_ingredients.intersection(user_dislikes))

    # Sort the documents by the number of disliked ingredients (ascending)
    docs_sorted = sorted(docs, key=count_dislikes)

    return docs_sorted

# Function to organize recipes by meal category
def organize_recipes_by_category(docs):
    breakfast_docs = [doc for doc in docs if doc.metadata.get("meal_category") == "breakfast"]
    meal_docs = [doc for doc in docs if doc.metadata.get("meal_category") == "meal"]
    snack_docs = [doc for doc in docs if doc.metadata.get("meal_category") == "snack"]

    return breakfast_docs, meal_docs, snack_docs

# Function to limit and select final recipes
def select_final_recipes(breakfast_docs, meal_docs, snack_docs):
    # Step 4: Select the desired number of recipes from each category
    selected_breakfasts = breakfast_docs[:4]  # Fetch 4 breakfast recipes
    selected_meals = meal_docs[:14]  # Fetch 14 meal recipes
    selected_snacks = snack_docs[:3]  # Fetch 3 snack recipes

    # Step 5: Combine the selected recipes into a final list
    final_docs = selected_breakfasts + selected_meals + selected_snacks

    # Ensure we don't exceed the limit
    if len(final_docs) < 15:
        # Limit each category to 10 if total docs are less than 15
        selected_breakfasts, selected_meals, selected_snacks = [docs[:10] for docs in [breakfast_docs, meal_docs, snack_docs]]
        final_docs = selected_breakfasts + selected_meals + selected_snacks

    return final_docs

# Function to format the filtered recipes into a structured meal plan prompt
def format_meal_plan_prompt(filtered_docs, query):
    prompt = """Generate a weekly meal plan based on the following user persona and recipe data:
    Only use the recipes exactly as they are presented below. Do not modify the recipes, add any extra information, or create new recipes. 
    Simply output the meal name for each day, using only the recipes provided. Do not alter or adapt the meals.
    May include those recipes that have disliked ingredients only if the recipes are not sufficient.
    For each meal, you will only check if any of the disliked ingredients (listed below) are explicitly **present in the ingredients list** of that meal. You **must not flag any ingredients that are not included** in the list of ingredients for each meal. If any disliked ingredients are found in the recipe's ingredients, append the following notation to the meal: ' * (contains <disliked ingredient>)'. Only **ingredients explicitly listed** in the recipe are considered.
    Try not repeating the meals.Also, mention the kcal for each meal *exactly as they appear in the provided NutritionalInfo* (do not create new kcal values). "dish_name (xxx kcal) *(contains <disliked_ingredient>)".
    **Select the variant that best matches the user's daily caloric intake (kcal) from the provided list of variants to meet the daily caloric intake.** You must select the variant with the appropriate kcal from the provided list of variants.
    Give response in json format only.
        User Persona:
         Dietary Restrictions: Mustard, Mushrooms
         Dislikes: Soy, Mushrooms, Oats
         Likes: Quinoa
         Age: 29
         Gender: Male
         Height: 180 cm
         Weight: 75 kg 
         Activity Level: Moderately Active
         Meal Frequency: 3 meals per day
         Meal Timing: Breakfast, Lunch, Dinner
         Likes: Quinoa, Mediterranean cuisine, High-Protein meals
         **Daily caloric intake: >1500 kcal**
         Health Goals: Weight Loss, Increase Muscle Mass
         Meal Preferences: Non-Vegetarian, High Protein, Low Carb
         Nutritional Preferences: High Protein, Low Carb, Moderate Fat
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

# Main function to generate the meal plan
def generate_meal_plan(vectorstore, user_allergens, user_dislikes, query):
    # Step 1: Filter for dislikes and allergens in ingredients using Pinecone
    docs_sorted = filter_recipes(vectorstore, user_allergens, user_dislikes, query)

    # Step 2: Organize the filtered recipes by meal category
    breakfast_docs, meal_docs, snack_docs = organize_recipes_by_category(docs_sorted)

    # Step 3: Select the final recipes based on categories
    final_docs = select_final_recipes(breakfast_docs, meal_docs, snack_docs)

    # Step 4: Format the structured meal plan prompt
    final_prompt = format_meal_plan_prompt(final_docs, query)

    # Step 5: Generate the response using LLM
    meal_plan = generate_response(final_prompt)
    print(meal_plan)
    return meal_plan

# Example usage
if __name__ == "__main__":
    # User preferences (replace with dynamic input if needed)
    user_allergens = {"Mustard", "Mushroom"}  # Example allergens
    user_dislikes = {"Soy", "Mushroom"}  # Example disliked ingredients
    query = "Spice Level: Medium, high_protein, Mediterranean..."  # Example query

    # Generate the meal plan
    meal_plan = generate_meal_plan(vectorstore, user_allergens, user_dislikes, query)

    print("Suggested Meal Plan:\n", meal_plan)
