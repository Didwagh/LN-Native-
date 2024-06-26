const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
   name:{
       type:String,
       required:true,
   },
   email:{
       type:String,
       required:true,
       unique:true,
   },
   password:{
       type:String,
       required:true,
   },
   verified:{
       type:Boolean,
       default:false
   },

   status:{
    type:String,
    required:true,
},
privacy:{
    type:String,
    required:true,
},



   verificationToken:String,
   profileImage:String,
   userDescription:{
       type:String,
       default:"https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/510px-Default_pfp.svg.png"
   },
   connections:[
       {
           type:mongoose.Schema.Types.ObjectId,
           ref:"User"
       }
   ],
   connectionRequests:[
       {
           type:mongoose.Schema.Types.ObjectId,
           ref:"User"
       }
   ],
   sentConnectionRequests:[
       {
           type:mongoose.Schema.Types.ObjectId,
           ref:"User"
       }
   ],
   posts:[
       {
           type:mongoose.Schema.Types.ObjectId,
           ref:"Post"
       }
   ],
   createdAt:{
       type:Date,
       default:Date.now
   }
});

const User = mongoose.model("User",userSchema);

module.exports = User;