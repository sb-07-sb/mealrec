import json

def filter_recipes(docs, user_allergens, user_dislikes):
    """
    Removes recipes that contain allergens or disliked ingredients.
    """
    filtered_docs = []

    for doc in docs:
        metadata = doc.metadata

        # Debug: Print metadata for inspection
        print("Metadata:", metadata)

        # Skip if metadata is missing or invalid
        if not metadata:
            continue

        # Extract ingredients & check for user dislikes
        recipe_ingredients = set(metadata.get("ingredients", []))
        if recipe_ingredients & user_dislikes:  # Skip recipe if it contains disliked ingredients
            print(f"Skipping recipe due to disliked ingredients: {recipe_ingredients & user_dislikes}")
            continue

        # Parse `variants` (convert from JSON string to Python list)
        recipe_variants = []
        if "variants" in metadata:
            try:
                # Replace single quotes with double quotes to make it valid JSON
                variants_str = metadata["variants"].replace("'", '"')
                recipe_variants = json.loads(variants_str)
                print("Parsed variants:", recipe_variants)
            except json.JSONDecodeError as e:
                print(f"Error parsing variants field: {e}. Skipping recipe.")
                continue

        # Extract allergens from all variants and check for user allergens
        all_recipe_allergens = set()
        for variant in recipe_variants:
            if isinstance(variant, dict) and "allergens" in variant:
                all_recipe_allergens.update(set(variant["allergens"]))

        if all_recipe_allergens & user_allergens:  # Skip if recipe contains any allergens
            print(f"Skipping recipe due to allergens: {all_recipe_allergens & user_allergens}")
            continue

        # If recipe passes both checks, keep it
        filtered_docs.append(doc)

    return filtered_docs

def filter_allergens_in_variants(docs, user_allergens):
    """
    Removes recipes that contain allergens or disliked ingredients.
    """
    filtered_docs = []

    for doc in docs:
        metadata = doc.metadata

        # Skip if metadata is missing or invalid
        if not metadata:
            continue


        # Parse `variants` (convert from JSON string to Python list)
        recipe_variants = []
        if "variants" in metadata:
            try:
                # Replace single quotes with double quotes to make it valid JSON
                variants_str = metadata["variants"].replace("'", '"')
                recipe_variants = json.loads(variants_str)
                # print("Parsed variants:", recipe_variants)
            except json.JSONDecodeError as e:
                print(f"Error parsing variants field: {e}. Skipping recipe.")
                continue

        # Extract allergens from all variants and check for user allergens
        all_recipe_allergens = set()
        for variant in recipe_variants:
            if isinstance(variant, dict) and "allergens" in variant:
                all_recipe_allergens.update(set(variant["allergens"]))

        if all_recipe_allergens & user_allergens:  # Skip if recipe contains any allergens
            # print(f"Skipping recipe due to allergens: {all_recipe_allergens & user_allergens}")
            continue

        # If recipe passes both checks, keep it
        filtered_docs.append(doc)
    print(len(filtered_docs))
    return filtered_docs

import json

def filter_and_sort_recipes(docs, user_allergens, user_dislikes, min_recipes=40):
    """
    Filters out recipes with allergens first, then sorts based on dislikes.
    Ensures that enough recipes remain after filtering.
    """

    filtered_docs = []
    backup_docs = []  # Stores recipes that contain allergens but are still valid candidates

    for doc in docs:
        metadata = doc.metadata
        if not metadata:
            continue

        # Parse `variants` safely
        recipe_variants = []
        if "variants" in metadata:
            try:
                variants_str = metadata["variants"].replace("'", '"')
                recipe_variants = json.loads(variants_str)
            except json.JSONDecodeError as e:
                print(f"Error parsing variants: {e}. Skipping recipe.")
                continue

        # Extract allergens from variants
        all_recipe_allergens = set()
        for variant in recipe_variants:
            if isinstance(variant, dict) and "allergens" in variant:
                all_recipe_allergens.update(set(variant["allergens"]))

        # Check if recipe contains allergens
        contains_allergen = bool(all_recipe_allergens & user_allergens)

        if contains_allergen:
            backup_docs.append(doc)  # Store in backup in case we run out of recipes
        else:
            filtered_docs.append(doc)  # Keep only if it passes strict allergen filtering

    print(f"Recipes after allergen filtering: {len(filtered_docs)}")

    # If we have enough recipes, apply sorting by disliked ingredients
    if len(filtered_docs) >= min_recipes:
        def count_dislikes(doc):
            recipe_ingredients = set(doc.metadata.get("ingredients", []))
            return len(recipe_ingredients.intersection(user_dislikes))

        filtered_docs.sort(key=count_dislikes)

    # If filtering left too few recipes, allow some recipes with allergens from the backup
    elif len(filtered_docs) < min_recipes:
        print("Not enough recipes after allergen filtering. Including some backup recipes.")
        
        # Combine strict and backup recipes, then sort
        all_docs_sorted = sorted(
            filtered_docs + backup_docs,
            key=lambda doc: len(set(doc.metadata.get("ingredients", [])).intersection(user_dislikes))
        )
        filtered_docs = all_docs_sorted[:min_recipes]  # Pick at least `min_recipes`

    print(f"Final number of recipes: {len(filtered_docs)}")
    return filtered_docs
