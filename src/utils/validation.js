// Validation utility functions
/**
 * Vérifie si un nom, prénom ou ville est valide.
 * Lettres, accents, trémas et tirets autorisés. Pas de chiffres ni caractères spéciaux.
 *
 * @param {string} name - Le nom à valider.
 * @returns {boolean} - `true` si valide, sinon `false`.
 */
export const isValidName = (name) => {
    return /^[a-zA-ZÀ-ÿ-]+$/.test(name) && name.trim() !== ""
}

/**
 * Vérifie si l'email est au format valide.
 *
 * @param {string} email - L'adresse email à valider.
 * @returns {boolean} - `true` si l'email est valide.
 */
export const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email)
}

/**
 * Vérifie si le code postal est un code français à 5 chiffres.
 *
 * @param {string} code - Le code postal à valider.
 * @returns {boolean} - `true` si le code est valide.
 */
export const isValidPostalCode = (code) => {
    return /^\d{5}$/.test(code)
}

/**
 * Vérifie si l'utilisateur a au moins 18 ans.
 *
 * @param {string} birthDate - La date de naissance (format YYYY-MM-DD).
 * @returns {boolean} - `true` si l'utilisateur a 18 ans ou plus.
 */
export const isValidAge = (birthDate) => {
    if (!birthDate) return false

    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const m = today.getMonth() - birth.getMonth()

    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--
    }

    return age >= 18
}
