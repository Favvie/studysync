import { hash } from "bcrypt";

export const hashPassword = async (password: string): Promise<string> => {
    const salt = 10;
    return await hash(password, salt);
};
