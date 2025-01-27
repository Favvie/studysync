import { hash } from "bcrypt";

/**
 * Hashes a given password using a salt.
 *
 * @param password - The plain text password to be hashed.
 * @returns A promise that resolves to the hashed password.
 */
export const hashPassword = async (password: string): Promise<string> => {
    const salt = 10;
    return await hash(password, salt);
};
