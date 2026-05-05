import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { findUserByEmail, createUser } from "../services/authService.js"

export const register = async (req,res) => {
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
        const user = await createUser(name, email, hashedPassword)

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

export const login = async (req,res) => {
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