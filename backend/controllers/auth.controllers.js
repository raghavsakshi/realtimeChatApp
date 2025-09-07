import genToken from "../config/token.js"
import User from "../models/user.model.js"
import Message from "../models/message.model.js"
import Conversation from "../models/conversation.model.js"
import bcrypt from "bcryptjs"

export const signUp = async (req ,res) =>{
    try {
        const { userName,email,password } =req.body
        console.log("Signup request received:", {userName, email});
        const checkUserByUserName = await User.findOne({userName})
        if(checkUserByUserName ){
            console.log("Username already exists");
            return res.status(400).json({message :"userName already exists"})
        }
        const checkUserByUserEmail = await User.findOne({email})
        if(checkUserByUserEmail){
            console.log("Email already exists");
            return res.status(400).json({message :"email already exists"})
        }

if (password.length<6){
    console.log("Password too short");
    return res.status(400).json({message:"password must be atleast 6 characters"})
}

const hashedPassword = await bcrypt.hash(password,10)
const user =await User.create({
    name: userName,  // Set name to userName initially
    userName,
    email,
    password:hashedPassword
})
console.log("User created:", user._id);
const token = await genToken(user._id)
res.cookie("token",token,{
    httpOnly:true,
    maxAge :7*24*60*60*1000,
    sameSite : "none",
    secure :true
})
return res.status(201).json(user)

    } catch (error) {
        console.log("Signup error:", error);
        return res.status(500).json({message:`signup error ${error}`})
    }
}

//login 
export const login = async (req ,res) =>{
    try {
        const{email,password } =req.body
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message :"user does not exists"})
        }
const isMatch =await bcrypt.compare(password,user.password)
if(!isMatch){
    return res.status(400).json({message:"incorrect password"})
}


const token = await genToken(user._id)
res.cookie("token",token,{
    httpOnly:true,
    maxAge :7*24*60*60*1000,
    sameSite : "none",
    secure :true
})
return res.status(200).json(user)

    } catch (error) {
        return res.status(500).json({message:`login error ${error}`})
    }
}


//logout
export const logOut = async (req ,res) =>{
   try {
    res.clearCookie("token")
    return res.status(200).json(
        {message:"log out successfully"}
    )
   } catch (error) {
    return res.status(500).json({message :`logout error ${error}`})
   }
}

//search users
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
