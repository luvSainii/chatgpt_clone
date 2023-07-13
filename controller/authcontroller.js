const errorHandler = require("../middleware/errorMiddleware");
const errorResponse = require("../utility/errorResponse");

const userModel = require('../models/userModel');
exports.sendToken = (user,) =>{
    const token = user.getSignedToken(res)
        res.status(statusCode).json({
            success:true,
            token,
        })
}

//Registratioin
exports.registerController = async ()=>{
    try{
        const {username,email,password} = req.body
        //existing user
        const existingEmail = await userModel.findOne({email})
        if(existingEmail){
            return next(new errorResponse('Email is already  register', 500));
        }
        const user = await userModel.create({username,email,password})
        sendToken(user,201,res)
    }catch(error){
        console.log(error);
        next(error)
    }
};

//Login
exports.loginController = async (req,res,next)=>{
    try{
        const {email,password} = req.body
        //validation
        if(!email || !password){
            return next(new errorResponse('Please provide email or password'));
        }
        const user = await userModel.findOne({email})
        if(!user){
            return next(new errorResponse('Invalid Crenditial',401))
        }
        const isMatch = await userModel.matchPassword(password)
        if(!isMatch){
            return next(new errorHandler('Invalid Credential',401))
        }
        //response
        this.sendToken(user,200,res);
    }catch(error){
        console.log(error);
        next(error);
    }
};

//logout
exports.logoutController = async ()=>{
    res.clearCookie('refreshToken')
    return res.status(200).json({
        success:true,
        message:'Logout Successfully'
    })
};
