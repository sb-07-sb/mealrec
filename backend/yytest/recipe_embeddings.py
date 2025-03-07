# import os
# import json
# from dotenv import load_dotenv
# from langchain.embeddings import HuggingFaceEmbeddings
# from pinecone import Pinecone, ServerlessSpec
# from recipe_proc import fetch_api_data

# # Load environment variables
# load_dotenv(override=True)

# # Initialize Pinecone
# pc = Pinecone(api_key=os.getenv('PINECONE_API_KEY'))
# index_name = "recipes-test"
# local_file_path = "yytest/recipes.json"  # Local storage file

# def initialize_pinecone():
#     if index_name not in pc.list_indexes().names():
#         pc.create_index(
#             name=index_name,
#             dimension=384,  # Match the embedding model output size
#             metric="cosine",
#             spec=ServerlessSpec(
#                 cloud="aws",
#                 region="us-east-1"
#             )
#         )
#     return pc.Index(index_name)

# index = initialize_pinecone()

# # Load embedding model
# embed_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

# # def save_to_local(recipes, file_path=local_file_path):
# #     """
# #     Saves the recipes to a local JSON file, ensuring the text field is included.
# #     """
# #     processed_recipes = []

# #     for recipe in recipes:
# #         vector, metadata = process_recipe_for_pinecone(recipe)
        
# #         # Include the text field in local storage
# #         recipe_with_text = recipe.copy()
# #         recipe_with_text["text"] = metadata["text"]  # Add the generated text field

# #         processed_recipes.append(recipe_with_text)

# #     # Save the processed recipes with text field
# #     with open(file_path, "w", encoding="utf-8") as file:
# #         json.dump(processed_recipes, file, indent=4, ensure_ascii=False)
    
# #     print(f"✅ Recipes saved locally to {file_path} with 'text' field.")


# def process_recipe_for_pinecone(recipe):
#     """
#     Converts a recipe into an embedding-friendly format and metadata.
#     """
#     # Format variants as text
#     variant_texts = [
#         f"Protein Category: {variant.get('protein_category', '')}, "
#         f"Kcal: {variant.get('kcal', '')}, "
#         f"Fat: {variant.get('fat', '')}, "
#         f"Carb: {variant.get('carb', '')}, "
#         f"Protein: {variant.get('protein', '')}, "
#         f"Allergens: {', '.join(variant.get('allergens', []))}."
#         for variant in recipe.get("variants", [])
#     ]
#     variants_text = " | ".join(variant_texts)

#     # Generate a text representation for embedding
#     text = f"Dish Name: {recipe.get('dish_name', '')}. " \
#            f"Description: {recipe.get('description', '')}. " \
#            f"Ingredients: {', '.join(recipe.get('ingredients', []))}. " \
#            f"Meal Category: {recipe.get('meal_category', '')}. " \
#            f"Cuisine: {recipe.get('cuisine', '')}. " \
#            f"Dish Type: {', '.join(recipe.get('dish_type', []))}. " \
#            f"Spice Level: {recipe.get('spice_level', '')}. " \
#            f"Variants: {variants_text}"

#     # Create embedding
#     vector = embed_model.embed_query(text)

#     # Convert `variants` to JSON string
#     variants_json = json.dumps(recipe.get("variants", []), ensure_ascii=False).replace('"', "'")

#     # Prepare metadata
#     metadata = {
#         "recipe_id": recipe.get("recipe_id", ""),
#         "meal_category": recipe.get("meal_category", ""),
#         "dish_name": recipe.get("dish_name", ""),
#         "cuisine": recipe.get("cuisine", ""),
#         "dish_type": recipe.get("dish_type", []),
#         "description": recipe.get("description", ""),
#         "ingredients": recipe.get("ingredients", []),
#         "variants": variants_json,
#         "spice_level": recipe.get("spice_level", ""),
#         "data": text
#     }

#     return vector, metadata

# def save_to_pinecone(recipes):
#     """
#     Converts recipes into embeddings and saves them to Pinecone.
#     """
#     # Save locally first
#     # save_to_local(recipes)

#     # Clear Pinecone index
#     index_stats = index.describe_index_stats()
#     if index_stats['total_vector_count'] > 0:
#         print("Index is not empty, clearing the index...")
#         index.delete(deleteAll=True)
#     else:
#         print("Index is already empty or does not exist.")

#     vectors_to_upsert = [
#         (recipe["recipe_id"], *process_recipe_for_pinecone(recipe))
#         for recipe in recipes
#     ]

#     if vectors_to_upsert:
#         index.upsert(vectors=vectors_to_upsert)
#         print(f"✅ Successfully saved {len(vectors_to_upsert)} recipes to Pinecone.")

# # Main execution
# if __name__ == "__main__":
#     recipes = fetch_api_data()  # Fetch from API
#     save_to_pinecone(recipes)  # Save locally & to Pinecone






# import os
# import json
# from dotenv import load_dotenv
# from langchain.embeddings import HuggingFaceEmbeddings
# from pinecone import Pinecone, ServerlessSpec
# from recipe_proc import fetch_api_data

# # Load environment variables
# load_dotenv(override=True)

# # Initialize Pinecone
# pc = Pinecone(api_key=os.getenv('PINECONE_API_KEY'))
# index_name = "recipes-test"
# local_file_path = "yytest/recipes.json"  # Local storage file

# def initialize_pinecone():
#     if index_name not in pc.list_indexes().names():
#         pc.create_index(
#             name=index_name,
#             dimension=384,  # Match the embedding model output size
#             metric="cosine",
#             spec=ServerlessSpec(
#                 cloud="aws",
#                 region="us-east-1"
#             )
#         )
#     return pc.Index(index_name)

# index = initialize_pinecone()

# # Load embedding model
# embed_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

# def flatten_allergens(recipe):
#     """
#     Flattens allergens from all variants into a single list of unique allergens.
#     """
#     allergens = set()
#     for variant in recipe.get("variants", []):
#         allergens.update(variant.get("allergens", []))  # Add allergens from each variant
    
#     # Return allergens as a sorted list
#     return list(sorted(allergens))

# def format_variants(variants):
#     # Removing extra characters and extracting the required fields (kcal, fat, carb, protein)
#     formatted_variants = []
    
#     for variant in variants:
#         formatted_variant = {
#             "kcal": variant.get("kcal"),
#             "carb": variant.get("carb"),
#             "fat": variant.get("fat"),
#             "protein": variant.get("protein"),
#         }
#         formatted_variants.append(formatted_variant)
    
#     # Converting list of formatted variants into a more compact string format for LLM use
#     formatted_variants_str = ", ".join([
#         f"kcal: {v['kcal']}, carb: {v['carb']}, fat: {v['fat']}, protein: {v['protein']}"
#         for v in formatted_variants
#     ])
    
#     return formatted_variants_str
    
# def process_recipe_for_pinecone(recipe):
#     """
#     Converts a recipe into an embedding-friendly format and metadata.
#     """
#     # Flatten allergens for the recipe
#     allergens_flat = flatten_allergens(recipe)
    
#     # Format variants as text
#     variant_texts = [
#         f"Protein Category: {variant.get('protein_category', '')}, "
#         f"Kcal: {variant.get('kcal', '')}, "
#         f"Fat: {variant.get('fat', '')}, "
#         f"Carb: {variant.get('carb', '')}, "
#         f"Protein: {variant.get('protein', '')}, "
#         f"Allergens: {', '.join(variant.get('allergens', []))}."
#         for variant in recipe.get("variants", [])
#     ]
#     variants_text = " | ".join(variant_texts)

#     # Generate a text representation for embedding
#     text = f"Dish Name: {recipe.get('dish_name', '')}. " \
#            f"Description: {recipe.get('description', '')}. " \
#            f"Ingredients: {', '.join(recipe.get('ingredients', []))}. " \
#            f"Meal Category: {recipe.get('meal_category', '')}. " \
#            f"Cuisine: {recipe.get('cuisine', '')}. " \
#            f"Dish Type: {', '.join(recipe.get('dish_type', []))}. " \
#            f"Spice Level: {recipe.get('spice_level', '')}. " \
#            f"Variants: {variants_text}"

#     # Create embedding
#     vector = embed_model.embed_query(text)

#     # Convert `variants` to JSON string
#     variants_json = json.dumps(recipe.get("variants", []), ensure_ascii=False).replace('"', "'")

#     # # Convert `variants` to a string with single quotes and preserve the structure
#     # variants = recipe.get("variants", [])

#     # # Convert to string representation with single quotes (instead of JSON format)
#     # variants_str = str(variants).replace('"', "'")

#     # # Now the variants_str will have the desired format

#     # Prepare metadata
#     metadata = {
#         "recipe_id": recipe.get("recipe_id", ""),
#         "meal_category": recipe.get("meal_category", ""),
#         "dish_name": recipe.get("dish_name", ""),
#         "cuisine": recipe.get("cuisine", ""),
#         "dish_type": recipe.get("dish_type", []),
#         "description": recipe.get("description", ""),
#         "ingredients": recipe.get("ingredients", []),
#         "variants": variants_json,
#         "spice_level": recipe.get("spice_level", ""),
#         "text": text,
#         "allergens": allergens_flat  # Add flattened allergens to metadata
#     }

#     return vector, metadata

# def save_to_pinecone(recipes):
#     """
#     Converts recipes into embeddings and saves them to Pinecone.
#     """
#     # Save locally first
#     # save_to_local(recipes)

#     # Clear Pinecone index
#     index_stats = index.describe_index_stats()
#     if index_stats['total_vector_count'] > 0:
#         print("Index is not empty, clearing the index...")
#         index.delete(deleteAll=True)
#     else:
#         print("Index is already empty or does not exist.")

#     vectors_to_upsert = [
#         (recipe["recipe_id"], *process_recipe_for_pinecone(recipe))
#         for recipe in recipes
#     ]

#     if vectors_to_upsert:
#         index.upsert(vectors=vectors_to_upsert)
#         print(f"✅ Successfully saved {len(vectors_to_upsert)} recipes to Pinecone.")

# # Main execution
# if __name__ == "__main__":
#     recipes = fetch_api_data()  # Fetch from API
#     save_to_pinecone(recipes)  # Save locally & to Pinecone




import os
import json
from dotenv import load_dotenv
from langchain.embeddings import HuggingFaceEmbeddings
from pinecone import Pinecone, ServerlessSpec
from recipe_proc import fetch_api_data

# Load environment variables
load_dotenv(override=True)

# Initialize Pinecone
pc = Pinecone(api_key=os.getenv('PINECONE_API_KEY'))
index_name = "recipes-index"
local_file_path = "yytest/recipes.json"  # Local storage file

def initialize_pinecone():
    if index_name not in pc.list_indexes().names():
        pc.create_index(
            name=index_name,
            dimension=384,  # Match the embedding model output size
            metric="cosine",
            spec=ServerlessSpec(
                cloud="aws",
                region="us-east-1"
            )
        )
    return pc.Index(index_name)

index = initialize_pinecone()

# Load embedding model
embed_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

def flatten_allergens(recipe):
    """
    Flattens allergens from all variants into a single list of unique allergens.
    """
    allergens = set()
    for variant in recipe.get("variants", []):
        allergens.update(variant.get("allergens", []))  # Add allergens from each variant
    
    # Return allergens as a sorted list
    return list(sorted(allergens))

def format_variants(variants):
    """
    Removes duplicate variants based on nutritional values (kcal, carb, fat, protein)
    and formats the unique variants for storage.
    """
    # Remove duplicates based on the nutritional values (kcal, carb, fat, protein)
    unique_variants = []
    seen = set()

    for variant in variants:
        # Create a tuple of the nutritional values to identify unique variants
        variant_tuple = (variant.get('kcal'), variant.get('carb'), variant.get('fat'), variant.get('protein'))
        
        if variant_tuple not in seen:
            seen.add(variant_tuple)
            unique_variants.append(variant)

    # Format the unique variants into a string (kcal, carb, fat, protein)
    formatted_variants = [
        f"kcal: {v['kcal']}, carb: {v['carb']}, fat: {v['fat']}, protein: {v['protein']}"
        for v in unique_variants
    ]
    
    # Join all formatted variants into a single string for storing in Pinecone
    formatted_variants_str = " | ".join(formatted_variants)
    
    return formatted_variants_str

    
def process_recipe_for_pinecone(recipe):
    """
    Converts a recipe into an embedding-friendly format and metadata.
    """
    # Flatten allergens for the recipe
    allergens_flat = flatten_allergens(recipe)
    
    # Format the variants as a compact string (including kcal, carb, fat, protein)
    formatted_variants_str = format_variants(recipe.get("variants", []))

    # # Format variants as text
    # variant_texts = [
    #     f"Protein Category: {variant.get('protein_category', '')}, "
    #     f"Kcal: {variant.get('kcal', '')}, "
    #     f"Fat: {variant.get('fat', '')}, "
    #     f"Carb: {variant.get('carb', '')}, "
    #     f"Protein: {variant.get('protein', '')}, "
    #     f"Allergens: {', '.join(variant.get('allergens', []))}."
    #     for variant in recipe.get("variants", [])
    # ]
    # variants_text = " | ".join(variant_texts)

    # Generate a text representation for embedding
    text = f"Dish Name: {recipe.get('dish_name', '')}. " \
           f"Description: {recipe.get('description', '')}. " \
           f"Ingredients: {', '.join(recipe.get('ingredients', []))}. " \
           f"Meal Category: {recipe.get('meal_category', '')}. " \
           f"Cuisine: {recipe.get('cuisine', '')}. " \
           f"Dish Type: {', '.join(recipe.get('dish_type', []))}. " \
           f"Spice Level: {recipe.get('spice_level', '')}. " \
           f"Variants: {formatted_variants_str}"  # Use the formatted variants string here

    # Create embedding
    vector = embed_model.embed_query(text)

    # # Convert `variants` to JSON string
    # variants_json = json.dumps(recipe.get("variants", []), ensure_ascii=False).replace('"', "'")

    # # Convert `variants` to a string with single quotes and preserve the structure
    # variants = recipe.get("variants", [])

    # # Convert to string representation with single quotes (instead of JSON format)
    # variants_str = str(variants).replace('"', "'")

    # # Now the variants_str will have the desired format

    # Prepare metadata
    metadata = {
        "recipe_id": recipe.get("recipe_id", ""),
        "meal_category": recipe.get("meal_category", ""),
        "dish_name": recipe.get("dish_name", ""),
        "cuisine": recipe.get("cuisine", ""),
        "dish_type": recipe.get("dish_type", []),
        "description": recipe.get("description", ""),
        "ingredients": recipe.get("ingredients", []),
        "variants": formatted_variants_str,  # Store the formatted variants as a string
        "spice_level": recipe.get("spice_level", ""),
        "text": text,
        "allergens": allergens_flat  # Add flattened allergens to metadata
    }

    return vector, metadata

def save_to_pinecone(recipes):
    """
    Converts recipes into embeddings and saves them to Pinecone.
    """
    # Save locally first
    # save_to_local(recipes)

    # Clear Pinecone index
    index_stats = index.describe_index_stats()
    if index_stats['total_vector_count'] > 0:
        print("Index is not empty, clearing the index...")
        index.delete(deleteAll=True)
    else:
        print("Index is already empty or does not exist.")

    vectors_to_upsert = [
        (recipe["recipe_id"], *process_recipe_for_pinecone(recipe))
        for recipe in recipes
    ]

    if vectors_to_upsert:
        index.upsert(vectors=vectors_to_upsert)
        print(f"✅ Successfully saved {len(vectors_to_upsert)} recipes to Pinecone.")

# Main execution
if __name__ == "__main__":
    recipes = fetch_api_data()  # Fetch from API
    save_to_pinecone(recipes)  # Save locally & to Pinecone
