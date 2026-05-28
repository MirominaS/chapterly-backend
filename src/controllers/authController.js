import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { findUserByEmail, createUser } from "../services/authService.js"
import pool from '../config/db_config.js'
import { verifyKindeToken } from "../middleware/kindeAuthMiddleware.js";

export const registerController = async (req,res) => {
    try {
        const {name, email, password} = req.body;

        //validate
        if(!name || !email || ! password) {
            return res.status(400).json({message:"All fileds required"})
        }

        //check existing user
        const existingUser = await findUserByEmail(email)
        if(existingUser) {
            return res.status(400).json({message:"User already exists"})
        }

        //hash password
        const hashedPassword = await bcrypt.hash(password,10)

        //create user
        const user = await createUser(name, email, hashedPassword,"local",null)

        const token = jwt.sign(
            {
                id: user.id,
                email:user.email
            },
            process.env.JWT_SECRET,
            {expiresIn:"7d"}
        )
        res.status(201).json({
            token,
            user : {
                id: user.id,
                name: user.name,
                email: user.email,
            }
        })
        
    } catch (error){
        res.status(500).json({error: error.message})
    }
}

export const loginController = async (req,res) => {
    try {
        const {email,password} = req.body;

        //validate
        if(!email || !password) {
            return res.status(400).json({message:"All fields reqired"})
        }

        const user = await findUserByEmail(email)
        console.log("USER:", user);

        if(!user){
            return res.status(400).json({message:"Invalid credentials"})
        }

        if (!user.password) {
            return res.status(400).json({
                message: "Use Google login",
            });
        }

        const isMatch =user ? await bcrypt.compare(password,user.password) : false;
        console.log("PASSWORD MATCH:", isMatch);

        if(!isMatch) {
            return res.status(400).json({message: "Invalid credentials."})
        }
        //create token
        const token = jwt.sign(
            {
                id:user.id,
                email:user.email,
            },
            process.env.JWT_SECRET,
            { expiresIn:"7d"}
        )

        res.json({
            token,
            user : {
                id: user.id,
                name: user.name,
                email: user.email,
            }
        })
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

export const getUserController = async (req,res) => {
    try {
        const userId = req.user.id;

        const result = await pool.query(
            "SELECT id,name,email FROM chapterly_users.users WHERE id = $1",
            [userId]
        );

        res.json(result.rows[0])
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}

export const googleAuthController = async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);

    const { token, user: googleUser } = req.body;

    if (!token) {
      return res.status(400).json({
        message: "Token is required",
      });
    }

    if (!googleUser) {
      return res.status(400).json({
        message: "Google user data missing",
      });
    }

    const email = googleUser.email;

    const name =
      googleUser.givenName ||
      googleUser.familyName ||
      email.split("@")[0];

    const googleId = googleUser.id;

    let user = await findUserByEmail(email);

    if (!user) {
      user = await createUser(
        name,
        email,
        null,
        "google",
        googleId
      );
    }

    const appToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      token: appToken,
      user,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: error.message,
    });
  }
};