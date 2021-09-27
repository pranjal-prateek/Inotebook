const express=require('express');
const router=express.Router();
const User = require('../models/User')
const {body,validationResult} = require('express-validator');


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
        //crete a new user
     user=await User.create({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
    })
    // .then(user =>{
    //     res.json(user)
    // }).catch(err =>{console.log(err)
    // res.json({error:'Please enter a unique value for email',message:err.message})})

    res.send(req.body)
    }catch(error){
        console.error(error);
        res.status(500).send("some error")
    }

})
module.exports = router;