import { verifyToken } from "../services/auth.services.js";

export const verifyAuthentication = async (req , res , next) => {
    try {
        const token = req.cookies.accessToken;
        req.user = null;
        if(!token) return res.status(400).json({ message: "Token not found!"});
        // console.log("token : " , token);
        

        const decodedToken = await verifyToken(token);
        if(!decodedToken) return res.status(400).json({ message: "Token not verified!"});
        req.user =  decodedToken;
        // console.log("decodedToken : " , decodedToken);
        
        next();
    } catch (error) {
        console.log("Token verification error" , error);
       return res.status(400).json({ message: "Token not verified!"}); 
    }
}