// validation.js

export const validateStep = (step, formData) => {
    const errors = {};

    switch (step) {
        case 1:
            if (!formData.firstName) errors.firstName = 'Required*';
            // if (!formData.lastName) errors.lastName = 'Last Name is required';
            // if (!formData.email) errors.email = 'Email is required';
            break;
        case 2:
            if (formData.user_pref.length === 0) errors.user_pref = 'Required*';
            if (formData.user_likes.length === 0) errors.user_likes = 'Required*';
            break;
        case 3:
            if (!formData.size) errors.size = 'Required*';
            if (!formData.protein_option) errors.protein_option = 'Required*';
            if (!formData.protein_category) errors.protein_category = 'Required*';
            if (formData.meal_types.length === 0) errors.meal_types = 'Required*';
            break;
        case 4:
            // if (formData.allergenTags.length === 0) errors.allergenTags = 'Required*';
            // if (formData.dislikeTags.length === 0) errors.dislikeTags = 'Required*';
            break;
        default:
            break;
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};