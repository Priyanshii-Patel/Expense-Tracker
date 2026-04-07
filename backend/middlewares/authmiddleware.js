const jwt = require('jsonwebtoken');
const User = require('../models/user');

const protect = async (req,res,next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
        console.log("token from middle", token)
    }

    if(!token) {
        return res.status(401).json({
            success : false,
            msg : "Not authorized",
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = await User.findById(decoded.id).select('-password');

        if(! req.user){
            return res.status(401).json ({
                success: false,
                msg: "user not Found",
            })
        }

        next();
        
    } catch (error) {
        res.status(500).json({
            success : false,
            msg : error.message,
        })
        
    }
}

module.exports = protect;