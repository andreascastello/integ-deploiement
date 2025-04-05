// Validation utility functions
export const isValidName = (name) => {
    // Accept letters, accents, and hyphens, but not numbers or special characters
    // Escape the hyphen in the character class by placing it at the end
    return /^[a-zA-ZÀ-ÿ-]+$/.test(name) && name.trim() !== ""
}

export const isValidEmail = (email) => {
    // Basic email validation
    return /\S+@\S+\.\S+/.test(email)
}

export const isValidPostalCode = (code) => {
    // Postal code: 5 digits
    return /^\d{5}$/.test(code)
}

export const isValidAge = (birthDate) => {
    if (!birthDate) return false

    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const m = today.getMonth() - birth.getMonth()

    // Adjust age if birthday hasn't occurred yet this year
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--
    }

    return age >= 18
}

