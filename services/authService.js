import jwt from 'jsonwebtoken'
import {hash, compare} from 'bcryptjs'
import {UserTypeModel} from '../models/UserModel.js'

export const register = async(userObj) => {
    // create document
    let userDoc = new UserTypeModel(userObj);
    // validate the user Doc
    await userDoc.validate();
    // hash the password of this document
    userDoc.password = await hash(userDoc.password,12);
    // saving it
    let createdUserDoc = await userDoc.save();
    // now we need to convert the user doc to the object 
    let createdUserObj = createdUserDoc.toObject();
    // remove password
    delete createdUserObj.password;
    // returning the new user object without password
    return createdUserObj;
}

// Authenticating the user now
export const authenticate = async(email,password) => {
    // check the user email and role are existing or not 
    let user = await UserTypeModel.findOne({email});
    // if not user then throw the error
    if(!user){
        let err = new Error("Invalid email!");
        err.status = 401;
        throw err;
    }
    // if user valid but blocked by admin
    // if()
    // compare password
    let isMatch = await compare(password,user.password);
    if(!isMatch){
        let err = new Error("Invalid password!");
        err.status = 401;
        throw err;
    }
    if(user.isActive === false){
        let err = new Error("Your Account has been blocked please contact admin");
        err.status = 403;
        throw err;
    }
    // generate the token
    let signedToken = jwt.sign({userId:user._id,role:user.role,email:user.email},process.env.JWT_SECRET,{expiresIn:"1h"});

    let userObj = user.toObject();
    delete userObj.password;
    return {token:signedToken,user:userObj};
};