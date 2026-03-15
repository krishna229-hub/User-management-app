import {Schema,model} from 'mongoose'

// create user comment schema
const userCommentSchema = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref: "user"   // name of the model
    },
    comment:{
        type:String
    }
})
// create article schema

const articleSchema = new Schema({
    author:{
        type: Schema.Types.ObjectId,
        ref:"user",
        required:[true,"Author ID is required"]
    },
    title:{
        type:String,
        required:[true,"title is required"]
    },
    category:{
        type:String,
        // enum : ["programming","DSA","AI/ML","Web DEV"],
        required:[true,"category is required"]
    },
    content:{
        type:String,
        required:[true,"content is required"]
    },
    comments:[userCommentSchema],
    isArticleActive:{
        type:Boolean,
        default:true,
    }
},{
    strict:"throw",
    timestamps:true,
    versionKey:false,
})

// creating the model

export const ArticleModel = model("article",articleSchema);