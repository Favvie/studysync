import { hash } from "bcrypt";
export const hashPassword = async (password) => {
    const salt = 10;
    return await hash(password, salt);
};
