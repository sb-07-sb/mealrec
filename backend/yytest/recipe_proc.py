
import requests
import pandas as pd



def fetch_api_data():
    """
    Fetches recipe data directly from the API and processes it for Pinecone.
    """
    api_url = 'https://apis.delicut.ae/api/v1/recipes/fetch-all-weekly'

    try:
        response = requests.get(api_url)
        if response.status_code != 200:
            print(f"Error fetching API: {response.status_code}")
            return []

        data = response.json()
        recipes_by_category = data.get("data", {})

        all_recipes = []
        for category, recipes in recipes_by_category.items():
            if isinstance(recipes, list):
                for recipe in recipes:
                    recipe["meal_category"] = category  # Preserve category

                    # Remove unwanted fields
                    for field in ["category_type", "protein_category_info", "website_image",
                                  "cooking_complexity", "plating_complexity", "highly_perishable"]:
                        recipe.pop(field, None)

                    # Merge ingredients and remove duplicates
                    unique_ingredients = set()
                    for ingredient_group in recipe.get("ingredients", []):
                        unique_ingredients.update(ingredient_group.get("ingredients", []))
                    recipe["ingredients"] = list(unique_ingredients)

                    # Filter variants to retain only required fields
                    filtered_variants = []
                    for variant in recipe.get("variants", []):
                        filtered_variant = {
                            "protein_category": variant.get("protein_category"),
                            "kcal": variant.get("kcal"),
                            "fat": variant.get("fat"),
                            "carb": variant.get("carb"),
                            "protein": variant.get("protein"),
                            "allergens": variant.get("allergens", [])
                        }
                        filtered_variants.append(filtered_variant)
                    recipe["variants"] = filtered_variants

                    all_recipes.append(recipe)

        return all_recipes

    except requests.exceptions.RequestException as e:
        print(f"Error fetching API: {str(e)}")
        return []
