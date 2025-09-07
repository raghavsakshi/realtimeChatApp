import uploadOnCloudinary from "../config/cloudinary.js"
import User from "../models/user.model.js"

export const getCurrentUser = async (req ,res) =>{
    try {
        let userId = req.userId
        let user =await User.findById(userId).select("-password")
        if(!user){
        return res.status(400).json({message:"user not found"})
    }
    return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({message:`get user error ${error}`})
    }
}

export const editProfile = async (req, res) => {
    try {
        console.log("Profile update request received"); // Debug log
        console.log("User ID:", req.userId); // Debug log
        console.log("File received:", req.file); // Debug log
        let {name} = req.body
        console.log("Name from body:", name); // Debug log
        let updateData = { name };

        if(req.file){
            console.log("Uploading to cloudinary:", req.file.path); // Debug log
            try {
                updateData.image = await uploadOnCloudinary(req.file.path);
                if (!updateData.image) {
                    return res.status(500).json({message: "Image upload failed"})
                }
            } catch (error) {
                console.log("Cloudinary error:", error); // Debug log
                return res.status(500).json({message: `Image upload error: ${error.message}`})
            }
        }

        let user = await User.findByIdAndUpdate(req.userId, updateData, {new:true}).select("-password")
        if(!user){
            return res.status(400).json({message:"user not found"})
        }
        console.log("Profile updated successfully:", user); // Debug log
        return res.status(200).json(user)
    } catch (error) {
        console.log("Profile update error:", error); // Debug log
        return res.status(500).json({message:`profile error ${error}`})
    }
}
export const getOtherUsers = async (req ,res) =>{

    try {
        let users=await User.find({
            _id :{$ne :req.userId}
        }).select("-password")
       return  res.status(200).json(users)
    } catch (error) {
         return res.status(500).json({message:`get other users error  ${error}`})
    }
}

export const searchUsers = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ message: "Search query is required" });
        }

        const users = await User.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { userName: { $regex: query, $options: 'i' } }
            ]
        }).select("-password");

        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ message: `Search error ${error}` });
    }
}

