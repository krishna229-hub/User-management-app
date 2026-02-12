
import jwt from "jsonwebtoken"

export const verifyToken = async(req,res,next) =>{
    // read the token from req
    let token = req.cookies?.token;
    // console.log("token",token)
    // verify the validity of the token (decoding the token)
    if(token===undefined){
        res.status(400).json({message:"Unauthorized req. please login"})
    }
    let decodedToken = jwt.verify(token,process.env.JWT_SECRET)
    // console.log(decodedToken)
    // console.log(`${decodedToken.email}`)
    // forward the req to next middleare/route
    next();
}