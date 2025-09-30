import * as bcrypt from 'bcrypt';

export const getPasswordHash = async (password: string) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

export const verifyPassword = async (
    password: string,
    hashed: string,
): Promise<boolean> => {
    return await bcrypt.compare(password, hashed);
};

export const generateCode = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
