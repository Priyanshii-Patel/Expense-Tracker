const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

const register = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        let userExist = await User.findOne({ email })
        if (userExist) {
            return res.status(400).json({
                success: false,
                msg: "User Exist Try Login"
            })
        }

        let user = await User.create({
            name,
            email,
            password,
            role: role || "user",
        })


        //console.log("user from reg",user);
        const token = user.generateToken();
        //console.log("Register of Token ",token)

        res.status(201).json({
            success: true,
            token,
            user
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: error.message,
        })
    }
}

const login = async (req, res) => {

    const { email, password } = req.body;

    try {
        let userExist = await User.findOne({ email }).select('+password');

        if (!userExist) {
            return res.status(401).json({
                success: false,
                msg: "Not a User try Register",
            })
        }

        const isMatch = await userExist.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                sucess: false,
                msg: "Password is not Match",
            })
        }

        const token = userExist.generateToken();

        res.status(200).json({
            success: true,
            token,
            userExist,
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: error.message,
        })
    }
}

const getUser = async (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user,
    })
}


const forgetPassword = async (req,res)=>{
  let user;

  try {
    const {email} = req.body;
    user = await User.findOne({email});
    if(!user){
      return res.status(404).json({
        success:false,
        msg : "Not an user try register",
      })
    }

    const resetToken = user.getResetPasswordToken();
    console.log("Reset Token from Forget Password",resetToken);

  
    await user.save({validateBefore:false});


    //For testing with postman
    // const resetUrl = `http://localhost:3000/api/auth/resetpassword/${resetToken}`;

    //COnnecting with React
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    const message = `This email is reference to change your password ${resetUrl}`;

    await sendEmail({
      email: user.email,
      subject : 'This is Password Reset Token',
      message,
    })

    res.status(200).json({
      success: true,
      msg : "Mail Sent"
    })

  } catch (error) {
    console.log(error.message);
    if (user) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBefore: false });
    }
    res.status(500).json({
      success: false,
      msg: error.message,
    })
  }
}


const resetPassword = async(req,res)=>{
  try {
    const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex')

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire : {$gt : Date.now()},
  })

  if(!user){
    return res.status(400).json({
      success : false,
      msg : "Token modification or expired",
    })
  }

  user.password = req.body.password,
  user.resetPasswordToken = undefined,
  user.resetPasswordExpire  = undefined,

  await user.save();

  res.status(200).json({
    success : true,
    msg : "Password Changed"
  })

  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      msg: error.message,
    })
  }
}

module.exports = { register, login, getUser, forgetPassword, resetPassword };
