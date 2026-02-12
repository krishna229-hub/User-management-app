import express from 'express'
import {register,authenticate} from '../services/authService.js'
import { ArticleModel } from '../models/ArticleModel.js';
import {validAuthor} from '../middlewares/validateAuthor.js'
import { verifyToken } from '../middlewares/verifyToken.js';
export const authorRoute = express.Router()


// register author
authorRoute.post("/users",async(req,res)=>{
    // get user object from req
    let authorObj = req.body;
    // call register function
    let newAuthorObj = await register({...authorObj,role:"AUTHOR"});
    // send the res
    res.status(201).json({message:"Author created",payload:newAuthorObj});

})

// create article (private or protected)
authorRoute.post("/articles",verifyToken,validAuthor,async(req,res)=>{
    // get the article from req
    let articleObj = req.body;
    // create the article document 
    let articleDoc = new ArticleModel(articleObj);
    // save the article
    let article = await articleDoc.save();
    // send res
    res.status(201).json({message:"article created",payload:article});
})

// read articles (private or protected)
authorRoute.get("/articles/:authorid",verifyToken,validAuthor,async(req,res)=>{
    // get the author id
    let authorId = req.params.authorid;
   
    // read the articles by the author
    let allArticles = await ArticleModel.find({author:authorId,isArticleActive:true}).populate("author","firstName email");
    // res
    res.status(200).json({message:"author articles",payload:allArticles})
})

// edit article by author  (private or protected)
authorRoute.put("/articles",verifyToken, validAuthor, async(req,res)=>{
    // get the modified article from req
    let {articleId,author,category,title,content} = req.body;
    // find and update the article
    let articleOfDB = await ArticleModel.findOne({_id:articleId,author:author});
    if(!articleOfDB){
        return res.status(401).json({message:"Article not found"})
    }

    let updatedArticle = await ArticleModel.findByIdAndUpdate(
        articleId,
        {
            $set:{title,category,content}
        },
        {new:true}
    )
    // res
    res.status(200).json({message:"article updated",payload:updatedArticle});
})

// delete (soft delete)  (private or protected)
authorRoute.put('/author/:authorid/article/:articleid',verifyToken,validAuthor,async(req,res)=>{
    // get the article id
    let aid = req.params.articleid;
    let author = req.params.authorid;
    // find the article
    let articleOfDB = await ArticleModel.findOne({_id:aid,author:author});
    if(!articleOfDB){
        res.status(401).json({message:"article not found or not belong to you"})
    }

    // make the article status to false (isArticleActive)
    let updatedArticle = await ArticleModel.findOneAndUpdate(
        {_id:aid},
        {$set:{isArticleActive:false}},
        {new:true}
    )
    // send res
    res.status(200).json({message:"deleted the article softly",payload:updatedArticle})

})