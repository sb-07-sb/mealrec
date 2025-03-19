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
def filter_recipes(vectorstore, user_allergens, user_dislikes, query, meal_category, size, protein_option, protein_category, top_k):
    pinecone_filter = {
        "meal_category": {"$eq": meal_category},  # Filter for specific meal type
        # "size": {"$eq": size},  # Filter for specific size
        # "protein_option": {"$eq": protein_option},  # Filter for specific protein option
        # "protein_category": {"$eq": protein_category},  # Filter for specific protein category
        "allergens": {"$nin": list(user_allergens)},  # Exclude recipes containing allergens
        "ingredients": {"$nin": list(user_allergens)}  # Exclude recipes containing allergens
    }
     # ✅ Add `size` filter only if it's not empty
    if size:
        pinecone_filter["size"] = {"$eq": size}

    # ✅ Add `protein_option` filter only if it's not empty
    if protein_category:
        pinecone_filter["protein_category"] = {"$eq": protein_category}

    # ✅ Add `protein_option` filter only if it's not empty
    if protein_option:
        pinecone_filter["protein_option"] = {"$eq": protein_option}
    # Retrieve documents from Pinecone with filtering for dislikes and allergens in ingredients



    docs = vectorstore.similarity_search(
        query=query,
        k=top_k,  # Fetch only the required number of results
        filter=pinecone_filter  # Apply the filter for dislikes and allergens in ingredients
    )

    print(f"Total Recipes Fetched: {len(docs)}")

    return docs


# Function to format the filtered recipes into a structured meal plan prompt
def format_meal_plan_prompt(filtered_docs, query, user_allergens, user_likes, user_dislikes, user_pref, meal_types):
    prompt = f"""Generate a weekly meal plan based on the following user persona and recipe data:
    Only use the recipes exactly as they are presented below. Do not modify the recipes, add any extra information, or create new recipes. 
    Simply output the meal name for each day, using only the recipes provided. Do not alter or adapt the meals.
    May include those recipes that have disliked ingredients only if the recipes are not sufficient.
    If the available recipes are insufficient, you may include recipes that contain disliked ingredients. However, you must strictly follow these rules when checking for disliked ingredients:

    **Strict Rules for Meal Assignment:**
    - **Do NOT repeat the same recipe within a single week unless all unique recipes have been used.**
    - **Each recipe must be used at least once before any dish is repeated for either breakfast, morning_snack, evening_snack, lunch or dinner.**
    - **Ensure every meal slot is filled. Do NOT assign null or empty values.**
    - **If there are more dishes than required, prioritize using each at least once before repeating any.**
    - **Do NOT assign the same recipe more than once in a single week unless absolutely necessary.**
    - **Distribute meals evenly across all days to avoid repetition.**
    - **Strictly follow meal category assignments to ensure accuracy.**

    
    1. **ONLY check for disliked ingredients listed in the user's dislikes below. Do NOT flag any ingredient that is NOT in the dislikes list.**
    2. **You must NOT infer, assume, or guess the presence of any ingredient. Only check the explicit list of ingredients provided in the recipe.**
    3. **If a disliked ingredient (from the list below) is found in a meal, append the following notation to the meal: ' * (contains <disliked ingredient>)'.**
    4. **If a meal does not contain any disliked ingredients from the list below, do NOT append anything.**
    5. **Do NOT flag Butter, Cheddar Cheese, Yoghurt, Mascarpone Cheese, Mayonnaise, or any other ingredient unless they are explicitly listed in the dislikes section below and the ingredients list of the recipe.**
    6. **Ensure that the output is in JSON format only.**

    **Meals must be assigned to their respective categories: Breakfast for Breakfast, and Lunch and Dinner should be selected only from the Meal category, with evening_snacks and morning_snacks from Snacks.**
    **There are total 5 meal categories that include breakfast,morning_snack,lunch,evening_snack,dinner.Only include those meal categories that were mentioned by the user for each day of the week.Do not skip any meal type if it is present in the Meal Category**
    **Use only meals from the correct category:**
       - **Morning Snack:** Use recipes labeled `"snack"`.  
       - **Meals (Lunch/Dinner):** Use recipes labeled `"meal"`.  
       - **Evening Snack:** Use recipes labeled `"snack"`.
    **Do NOT repeat the same meal multiple times.**  
    Ensure the correct order of meals in the daily schedule:  
    1. **The output for each day must strictly follow this order (if selected):**  
    - **Morning Snack → Breakfast → Lunch → Dinner → Evening Snack**  
    2. **Do not skip any meal category that is in the user selection.**  


    Give response in json format only.
        User Persona:
         Dietary Restrictions: {user_allergens}
         Dislikes: {user_dislikes}
         Likes: {user_likes} 
         Spice Level: Medium 
         Popular Dishes: {user_pref}
         Meal Frequency: {len(meal_types)}
         Meal Categories: {meal_types}
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
        # prompt += f" Variants: {metadata.get('variants', 'Unknown')}\n"
    
    return prompt

# Main function to generate the meal plan
def generate_meal_plan(vectorstore, user_allergens, user_dislikes, query, user_likes, user_pref, size, protein_option, protein_category, meal_types):
    # Define mapping of meal types to their respective counts
    meal_counts = {
        "breakfast": 8,
        "snack": 8,  # Each snack type (morning/evening) adds 8
        "meal": 0  # Lunch and Dinner are combined into "meal"
    }

    # Initialize recipe counts
    total_snack_count = 0
    total_meal_count = 0  # To hold combined lunch + dinner count
    fetched_recipes = {}

    # Determine the total number of snack recipes needed
    if "morning_snack" in meal_types or "evening_snack" in meal_types:
        total_snack_count = meal_counts["snack"] * sum(1 for meal in meal_types if "snack" in meal)

    # If lunch or dinner is included, sum their counts into "meal"
    if "lunch" in meal_types:
        total_meal_count += 10
    if "dinner" in meal_types:
        total_meal_count += 10

    # Fetch recipes for each meal type
    for meal_type in meal_types:
        # if "snack" in meal_type or meal_type in ["lunch", "dinner"]:
        #     continue  # Skip individual snacks and meals; handle separately

        count = meal_counts.get(meal_type, 0)
        if count > 0:
            # Set size to "standard" for breakfast and snack
            meal_size = "standard" if meal_type in ["breakfast", "snack"] else size

            fetched_recipes[meal_type] = filter_recipes(
                vectorstore, user_allergens, user_dislikes, query, meal_type, meal_size, "", protein_category, count
            )

    # Fetch total meal recipes (combined lunch & dinner) with user-specified size
    if total_meal_count > 0:
        fetched_recipes["meal"] = filter_recipes(
            vectorstore, user_allergens, user_dislikes, query, "meal", size, protein_option, protein_category, total_meal_count
        )

    # Fetch total snack recipes (combined morning & evening snacks) with "standard" size
    if total_snack_count > 0:
        fetched_recipes["snack"] = filter_recipes(
            vectorstore, user_allergens, user_dislikes, query, "snack", "standard", "", protein_category, total_snack_count
        )

    # Debugging: Print fetched recipe counts
    # for meal_type, recipes in fetched_recipes.items():
    #     print(f"{meal_type.capitalize()} recipes: {len(recipes)}")
    

    # Check if the total number of recipes is less than expected
    total_recipes = sum(len(recipes) for recipes in fetched_recipes.values())
    # expected_total = sum(meal_counts.get(meal, 0) for meal in meal_types if meal != "snack") + total_snack_count + total_meal_count
    # expected_total = count + total_snack_count + total_meal_count
    expected_total = (
    max(0, count - 2) +
    max(0, total_snack_count - (2 if total_snack_count == 8 else 4 if total_snack_count == 16 else 0)) +
    max(0, total_meal_count - (2 if total_meal_count == 8 else 6 if total_meal_count == 20 else 0))
    )

    if total_recipes < expected_total:
        print("Not enough recipes found. Retrying without allergens filter.")
        user_allergens = {}  # Reset allergens and retry

        if total_meal_count > 0:
            fetched_recipes["meal"] = filter_recipes(
                vectorstore, user_allergens, user_dislikes, query, "meal", size, protein_option, protein_category, total_meal_count
            )

        if total_snack_count > 0:
            fetched_recipes["snack"] = filter_recipes(
                vectorstore, user_allergens, user_dislikes, query, "snack", "standard", "", protein_category, total_snack_count
            )

    # Print fetched recipe counts for each meal type
    print("Fetched recipes per meal type:")
    for meal_type, recipes in fetched_recipes.items():
        print(f"{meal_type.capitalize()}: {len(recipes)}")

    
    
    # Combine all selected recipes into the final list
    final_docs = [recipe for recipes in fetched_recipes.values() for recipe in recipes]
   
     # Step 3: Format the structured meal plan prompt
    final_prompt = format_meal_plan_prompt(final_docs, query, user_allergens, user_likes, user_dislikes, user_pref, meal_types)

    # Step 4: Generate the response using LLM
    meal_plan = generate_response(final_prompt)

    print(meal_plan)
    return meal_plan, final_docs

# Example usage
if __name__ == "__main__":
    # User preferences (replace with dynamic input if needed)
    user_allergens = {}  # Example allergens
    # user_dislikes = {
    #     "Cod (white fish)", "Cod Fish", "Cuttlefish", "Fish Sauce",
    #     "Gochujang Paste", "Gochujang Sauce", "Local Wild Fish",
    #     "Nile Perch", "Salmon", "Sea Bass", "Squid", "Tuna",
    #     "White Fish", "Worcestershire Sauce"
    # }  # Example disliked ingredients
    
    # query = "Spice Level: Medium, Cuisine: Mediterranean,European,Comfort Food. Popular Dishes: Classic Chicken Salad, Crudites & Sour Cream Dip, Mini Quiches, Omega Egg Protein Pot"

    # Generate the meal plan
    # generate_meal_plan(vectorstore, user_allergens, user_dislikes, query, user_likes, user_pref)