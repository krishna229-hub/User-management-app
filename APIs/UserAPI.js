import express from 'express'
import {register,authenticate} from '../services/authService.js'
import { verifyToken } from '../middlewares/verifyToken.js';
import {validUser} from '../middlewares/validUser.js'
import { ArticleModel } from '../models/ArticleModel.js';

export const userRoute = express.Router()


// register user
userRoute.post("/users",async(req,res)=>{
    // get user object from req
    let userObj = req.body;
    // call register function
    const newUserObj = await register({...userObj,role:"USER"});

    // send the res
    res.status(201).json({message:"user created",payload:newUserObj});

})


// read all articles (protected Route)
userRoute.get('/user/:uid/articles',verifyToken,validUser,async(req,res)=>{
    // read all the articles from the articles collection 
    let allArticles = await ArticleModel.find().populate("author comments.user");
    // send all the articles as response
    res.status(200).json({message:"All the articles",payload:allArticles});
})


// add comment to an article (protected Route)
userRoute.put('/user/:uid/article/:aid',verifyToken,validUser,async(req,res)=>{
    // getting the userid and article id where we have to comment 
    let {uid,aid} = req.params;
    // check if the article exist as the user is already checked
    let articeOfDB = await ArticleModel.findOne({_id:aid,isArticleActive:true});
    // now if the article is not there then can't comment 
    if(!articeOfDB){
        return res.status(404).json({message:"article not available"})
    }

    let newArticle = await ArticleModel.findOneAndUpdate(
        {_id:aid},
        {$push:{"comments":{user:uid,comment:req.body.comment}}},
        {new:true}
    )
    res.status(200).json({message:"comment added",payload:newArticle});
})