export const getCurrentUser = async (req , res) => {
    try {
        if(!req.user) return res.status(400).json({ message: "User not found!"});
        return res.status(201).json(req.user);
    } catch (error) {
        console.log("Error in getting user : " , error);
        return res.status(400).json({ message: "There's a issue in getting user"});
        
    }
}