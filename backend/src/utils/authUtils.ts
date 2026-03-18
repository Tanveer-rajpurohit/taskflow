import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Types } from "mongoose";

const SECRET = process.env.JWT_SECRET as string;
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export interface JwtPayload {
  userId: string;
  email: string;
}

export const signToken = (userId: Types.ObjectId, email: string): string => {

    if (!SECRET) throw new Error("JWT_SECRET is not defined");
    return jwt.sign({ userId: userId.toString(), email }, SECRET, { 
        expiresIn: EXPIRES_IN,
    } as jwt.SignOptions);
};

export const verifyToken = (token: string): JwtPayload => {
    if (!SECRET) throw new Error("JWT_SECRET is not defined");
    return jwt.verify(token, SECRET) as JwtPayload;
};


const SALT_ROUNDS = 12;
 
export const hashPassword = async (plain: string): Promise<string> => {
  return bcrypt.hash(plain, SALT_ROUNDS);
};
 
export const comparePassword = async (
  plain: string,
  hashed: string
): Promise<boolean> => {
  return bcrypt.compare(plain, hashed);
};
 