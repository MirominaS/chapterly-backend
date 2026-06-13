import User from "../models/User.js";

export const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

export const findUserById = async (id) => {
  return await User.findById(id);
};

export const createUser = async (
  name,
  email,
  password = null,
  auth_provider = "local",
  google_id = null,
) => {
  const user = await User.create({
    name,
    email,
    password,
    auth_provider,
    google_id,
  });

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
  };
};
