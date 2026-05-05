import jwt from "jsonwebtoken"

export const protect = (req,res,next) => {
    try {
        const authHeader = req.headers.authorization;

        //check token exist
        if(!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({message:"Not authorized"})
        }

        //extract token
        const token = authHeader.split(" ")[1];

        //verify token
        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        //attach user to request
        req.user = decoded;

        next()
    } catch (error) {
        res.status(401).json({message:"Invalid token"})
    }
}