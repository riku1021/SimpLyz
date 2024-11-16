export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,}$/;

/**
 * Validate email format
 * @param email - string to validate
 * @returns boolean
 */
export const validateEmail = (email: string): boolean => emailRegex.test(email);

/**
 * Validate password format
 * @param password - string to validate
 * @returns boolean
 */
export const validatePassword = (password: string): boolean => passwordRegex.test(password);
