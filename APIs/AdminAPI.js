import express from 'express'
import { verifyToken } from '../middlewares/verifyToken.js';
import { ArticleModel } from '../models/ArticleModel.js';
import { UserTypeModel } from '../models/UserModel.js';
import { validateAdmin } from '../middlewares/validateAdmin.js';

export const adminRoute = express.Router()

// read all articles
adminRoute.get("/:aid/articles",verifyToken,validateAdmin,async(req,res)=>{
    // reading all the articles available
    let allArticles = await ArticleModel.find();
    //send res
    res.status(200).json({message:"all articles",payload:allArticles});
})


// block user
adminRoute.put("/:aid/block/:uid",verifyToken,validateAdmin,async(req,res)=>{
    let uid = req.params.uid; // getting the uid from the params which user has to be blocked
    // find the user if it exists 
    let user = await UserTypeModel.findOne({uid});
    if(user === undefined){
        res.status(404).json({message:"user not existing"});
    }
    // updating the user
    let blockedUSer = await UserTypeModel.findOneAndUpdate(
        {_id:uid},
        {$set:{isActive:false}},
        {new:true}
    )
    // send res
    res.status(200).json({message:"user blocked",payload:blockedUSer})
})


//  unblock user roles
adminRoute.put("/:aid/unblock/:uid",verifyToken,validateAdmin,async(req,res)=>{
    let uid = req.params.uid; // getting the uid from the params which user has to be blocked
    // find the user if it exists 
    let user = await UserTypeModel.findOne({uid});
    if(user === undefined){
        res.status(404).json({message:"user not existing"});
    }
    // updating the user
    let blockedUSer = await UserTypeModel.findOneAndUpdate(
        {_id:uid},
        {$set:{isActive:true}},
        {new:true}
    )
    // send res
    res.status(200).json({message:"user Unblocked",payload:blockedUSer})
})