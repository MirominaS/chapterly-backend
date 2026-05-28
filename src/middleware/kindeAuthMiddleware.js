import jwt from "jsonwebtoken";

export const verifyKindeToken = async (token) => {

  try {

    const decoded = jwt.decode(token);
    if (!decoded) {
      throw new Error("Invalid token");
    }
    return decoded;

  } catch (error) {
    throw new Error("Invalid token");
  }
};