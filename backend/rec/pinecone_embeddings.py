import os
import json
from dotenv import load_dotenv
from langchain.embeddings import HuggingFaceEmbeddings
from pinecone import Pinecone, ServerlessSpec

# Load environment variables
load_dotenv(override=True)

# Initialize Pinecone
pc = Pinecone(api_key=os.getenv('PINECONE_API_KEY'))
index_name = "recipes-fin"
# local_file_path = "yytest/recipes.json"  # Local storage file

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

# Load HuggingFace Embedding Model
embed_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

def generate_embedding(text):
    """
    Generate embeddings using HuggingFace sentence transformer.
    """
    return embed_model.embed_query(text)  # Convert text to embedding vector

def format_and_push_to_pinecone(recipes):
    """
    Processes multiple recipes and pushes each variant as a separate vector to Pinecone.
    """
    vectors = []
    total_variants = 0  # Count the number of variants processed

    for recipe in recipes:
        recipe_variants = recipe.get("variants", [])  # Get variants
        total_variants += len(recipe_variants)  # Count variants
        
        print(f"🔍 Processing Recipe: {recipe.get('dish_name', 'Unknown')} - Found {len(recipe_variants)} variants")

        for variant in recipe_variants:
            # Combine main ingredients + variant ingredients (keep unique values)
            all_ingredients = list(set(recipe["ingredients"] + variant.get("variant_ingredients", [])))

            # Construct the text field for embedding
            text = f"Dish Name: {recipe.get('dish_name', '')}. " \
                   f"Description: {recipe.get('description', '')}. " \
                   f"Ingredients: {', '.join(all_ingredients)}. " \
                   f"Meal Category: {recipe.get('meal_category', '')}. " \
                   f"Cuisine: {recipe.get('cuisine', '')}. " \
                   f"Dish Type: {', '.join(recipe.get('dish_type', []))}. " \
                   f"Spice Level: {recipe.get('spice_level', '')}. " \
                   f"Protein Category: {variant.get('protein_category', '')}. " \
                   f"Protein Option: {variant.get('protein_option', '')}. " \
                   f"Size: {variant.get('size', '')}. " \
                   f"Calories: {variant.get('kcal', '')}. " \
                   f"Fat: {variant.get('fat', '')}. " \
                   f"Carbohydrates: {variant.get('carb', '')}. " \
                   f"Protein: {variant.get('protein', '')}. " \
                   f"Allergens: {', '.join(variant.get('allergens', []))}. "

            metadata = {
                "recipe_id": recipe["recipe_id"],
                "meal_category": recipe["meal_category"],
                "dish_name": recipe["dish_name"],
                "cuisine": recipe["cuisine"],
                "dish_type": recipe["dish_type"],
                "description": recipe["description"],
                "ingredients": all_ingredients,  # Unique combined ingredients
                "spice_level": recipe["spice_level"],
                "protein_category": variant["protein_category"],  # Variant-specific
                "protein_option": variant["protein_option"],      # Variant-specific
                "size": variant["size"],                          # Variant-specific
                "kcal": variant["kcal"],                          # Variant-specific
                "fat": variant["fat"],                            # Variant-specific
                "carb": variant["carb"],                          # Variant-specific
                "protein": variant["protein"],                    # Variant-specific
                "allergens": variant["allergens"],                # Variant-specific
                "text": text  # Text field for embedding
            }

            # Generate a unique vector ID (e.g., "669785453d6d34934a276cb8_balance_standard")
            vector_id = f"{recipe['recipe_id']}_{variant['protein_category']}_{variant['protein_option']}_{variant['size']}"

            # Generate embedding for this variant
            embedding = generate_embedding(text)

            # Prepare vector data
            vector_data = {
                "id": vector_id,
                "values": embedding,  # Embedding vector
                "metadata": metadata
            }

            vectors.append(vector_data)

    print(f"\n Total Recipes Processed: {len(recipes)}")
    print(f" Total Variants Processed: {total_variants}")  
    print(f" Total Vectors Ready to Upload: {len(vectors)}")  # Should match variants

    # Debugging: Print the metadata for all recipes
    for vector in vectors:
        print(json.dumps(vector['metadata'], indent=2))

    # Clear Pinecone index
    index_stats = index.describe_index_stats()
    if index_stats['total_vector_count'] > 0:
        print("Index is not empty, clearing the index...")
        index.delete(deleteAll=True)
    else:
        print("Index is already empty or does not exist.")

    # Push all vectors to Pinecone
    index.upsert(vectors)


