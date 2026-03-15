
import express from "express";
import {authenticate} from '../services/authService.js'
import {hash,compare} from "bcryptjs"
import { verifyToken } from "../middlewares/verifyToken.js";
import { UserTypeModel } from "../models/UserModel.js";

export const commonRouter = express.Router();

// login
commonRouter.post("/login", async (req, res) => {
  // get the email and password
  let { email, password } = req.body;
  // call the authenticate function
  let { token, user } = await authenticate(email, password);
  // save token as httpOnly cookie
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
  });
  // send res
  res.status(200).json({ message: "login success", payload: user });
});
// logout

// logout request
commonRouter.get('/logout',(req,res)=>{
    // clear the cookie 
    res.clearCookie('token',{
        httpOnly:true,
        secure:false,
        sameSite:'lax'
    })
    res.status(200).json({message:"logged out successfully"})
})


// change the password
commonRouter.put("/change-password",verifyToken,async(req,res)=>{
    // get the current password and new password along with email
    let { email, oldPassword, newPassword} = req.body;
    // first let's find if there is any user with the mail
    let user = await UserTypeModel.findOne({email:email});
    // compare the old password
    if(!user){
      return res.status(401).json({message:"no user with this email! plz try with correct email"})
    }
    console.log(user)
    
    let comparePass = await compare(user.password,oldPassword)
    if(!comparePass){
      return res.status(401).json({message:"Sorry Wrong password"})
    }
    // console.log("Hello")
    // if the password is same then replace with new 
    newPassword = await hash(newPassword,12)
    let userWithUpdatedPass = await UserTypeModel.findOneAndReplace(
      {email:email},
      {$set:{password:newPassword}},
      {new:true}
    )
    // res    
    res.status(200).json({message:"chenged the password successfully",payload: userWithUpdatedPass})
})
