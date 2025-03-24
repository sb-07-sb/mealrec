import requests

# URL of the API (replace with the actual URL)
api_url = 'https://apis.delicut.ae/api/v1/recipes/fetch-all-weekly'  # Replace with the actual API URL

def fetch_recipe_details():
    try:
        # Sending a GET request to the API
        response = requests.get(api_url)
        
        # Check if the response status is OK (200)
        if response.status_code == 200:
            # Parsing the JSON response
            data = response.json()

            # Ensure 'data' exists in the response
            if "data" in data:
                # Check if categories are in the 'data' or directly under 'data'
                all_recipes = data["data"]  # If categories are top-level, use this.

                # List to hold extracted recipe details
                recipe_details = []

                # Loop through each category and its recipes
                for category, recipes in all_recipes.items():
                    # Check if the category contains a list of recipes
                    if isinstance(recipes, list):
                        # Loop through all the recipes in the current category
                        for recipe in recipes:
                            # Extract the required details for each recipe
                            recipe_details.append({
                                "dish_name": recipe.get("dish_name", "N/A"),
                                "cuisine": recipe.get("cuisine", "N/A"),
                                "meal_category": recipe.get("meal_category", "N/A"),
                                "description": recipe.get("description", "N/A")
                            })
                
                return recipe_details
            else:
                return "No recipes found in the response."
        else:
            return f"Error: Unable to fetch data from API. Status code: {response.status_code}"
    except Exception as e:
        return f"An error occurred: {e}"


# # Fetch and return recipe details
# recipes = fetch_recipe_details()

# # Example of how you might use the returned recipes
# if isinstance(recipes, list):
#     for recipe in recipes:
#         print(recipe)
# else:
#     print(recipes)  # If there was an error message or no recipes
