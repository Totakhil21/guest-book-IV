export function validateFormData(formData) {
    const errors = [];

    
    if (!formData.firstName || formData.firstName.trim() === '') {
        errors.push("First name is required.");
    } else if (/\d/.test(formData.firstName)) {
        errors.push("First name cannot contain numbers.");
    }

   
    if (!formData.lastName || formData.lastName.trim() === '') {
        errors.push("Last name is required.");
    } else if (/\d/.test(formData.lastName)) {
        errors.push("Last name cannot contain numbers.");
    }


    if (!formData.email || !/^[\w.-]+@[\w.-]+\.\w+$/.test(formData.email)) {
        errors.push("A valid email address is required.");
    }

    if (formData.linkedin && !/^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-_/]+$/.test(formData.linkedin)) {
        errors.push("Enter a valid LinkedIn URL.");
    }

    return errors;
}
