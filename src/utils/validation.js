// validation.js

export const validateStep = (step, formData) => {
    const errors = {};

    switch (step) {
        case 1:
            // if (!formData.firstName) errors.firstName = 'First Name is required';
            // if (!formData.lastName) errors.lastName = 'Last Name is required';
            // if (!formData.email) errors.email = 'Email is required';
            // if (!formData.phoneNumber) errors.phoneNumber = 'Phone Number is required';
            break;
        // case 2:
        //     if (formData.user_pref.length === 0) errors.user_pref = 'At least one preferred dish is required';
        //     if (formData.user_likes.length === 0) errors.user_likes = 'At least one liked cuisine is required';
        //     break;
        // case 3:
        //     if (!formData.size) errors.size = 'Size is required';
        //     if (!formData.protein_option) errors.protein_option = 'Protein Option is required';
        //     if (!formData.protein_category) errors.protein_category = 'Protein Category is required';
        //     if (formData.meal_types.length === 0) errors.meal_types = 'At least one meal type is required';
        //     break;
        // case 4:
        //     if (formData.allergenTags.length === 0) errors.allergenTags = 'At least one allergen tag is required';
        //     if (formData.dislikeTags.length === 0) errors.dislikeTags = 'At least one dislike tag is required';
        //     break;
        default:
            break;
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};