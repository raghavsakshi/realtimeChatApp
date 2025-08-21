import jwt from "jsonwebtoken"
const isAuth = async (req ,res ,next)=>{
    try {
        let token =req.cookies.token
        if(!token){
            return res.status(401).json({message:"unauthorized"})
        }
        let verifyToken =await jwt.verify(token,process.env.JWT_SECRET)
        // console.log(verifyToken)
        req.userId =verifyToken.userId
        next()
    } catch (error) {
        return res.status(401).json({message:"unauthorized ${error} "})
    }
}
export default isAuth
//400