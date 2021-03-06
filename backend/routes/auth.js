const express=require('express');
const router=express.Router();
const User = require('../models/User')
const {body,validationResult} = require('express-validator');
const bcrypt=require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'babyucanthackme';
//Create a user using :POST "/api/auth/createuser". Does't require Auth
router.post('/createuser',[
    body('name','Enter a valid Name').isLength({min:3}),
    body('password','Password not strong').isLength({min:7}),
    body('email','Enter a valid Email Address').isEmail(),

],async(req, res)=>{
    //if there are errors return bad request and errors
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({error:errors.array()})
    }
    //Check wetere the user exist already(user with the same email)
    try{ 
    let user=await User.findOne({email:req.body.email});
        if(user)
        {
            res.status(400).json({error:"Sorry the user already exist"})
        }
        const salt=await bcrypt.genSalt(10);
        const hashpassword = await bcrypt.hash(req.body.password,salt)
        //crete a new user
     user=await User.create({
        name:req.body.name,
        email:req.body.email,
        password:hashpassword,
    }) 
    // .then(user =>{
    //     res.json(user)
    // }).catch(err =>{console.log(err)
    // res.json({error:'Please enter a unique value for email',message:err.message})})
      const data={
          user:{
              id:user.id
          }
      }
    const authtoken = jwt.sign(data,JWT_SECRET);
       console.log(authtoken);
    // res.send(user)
    res.json({authtoken:authtoken})
    }catch(error){
        console.error(error);
        res.status(500).send("some error")
    }

})

//Authenticate a user POST "api/auth/login"
router.post('/login',[ 
    body('email','Enter a valid Email Address').isEmail(),
    body('password',"password cannot be blank").exists()],
async (req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({error:errors.array()})
    }
    const {email,password}=req.body;
    try{
        let user=await  User.findOne({email});
        if(!user){
            return res.status(400).json({error:"Please try to login with correct credentials"});
        }
        const passwordCompare = await bcrypt.compare(password,user.password);
            if(!passwordCompare){
                return res.status(400).json({error:"Please try to login with correct credentials"})
            }
            const data={
                user:{
                    id:User.id,
                }
                
            }
            const authtoken=jwt.sign(data,JWT_SECRET);
            res.json(authtoken);
    }catch(error){
        console.error(error.message)
        res.status(500).send('Internal server error ')
    }
})
module.exports = router;