const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const userSchema = mongoose.Schema ({
    name : {
        type : String,
        required : true,
        trim : true,
        maxLength : 20
    },

    email : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        match : [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/],
    },

    password : {
        type : String,
        required : [true, "Please Fill Your Password"],
        minLength : 8,
        select : false,
    },

    role : {
        type : String,
        enum : ["user", "admin"],
        default : "user"
    },

    resetPasswordToken : String,
    resetPasswordExpire : Date,

}, {timestamps : true}) 

userSchema.pre('save',async function() {
    if(!this.isModified('password')){
        return;
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(this.password,salt);
    this.password = hash;
})

userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password,this.password);
};

userSchema.methods.generateToken = function() {
    return jwt.sign({
        id : this._id,
        email : this.email,
        role : this.role,
    }, process.env.JWT_SECRET, {expiresIn : '1h'});
};

userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model('user', userSchema);  

module.exports = User;