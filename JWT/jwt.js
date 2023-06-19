const jwt =require('jsonwebtoken');

let createToken = (id)=>{
    let token = jwt.sign(id,"amit");
    return token;
}

const veryfitoken = (req,res,next)=>{
    if(req.headers.cookie){
        const token = req.headers.cookie.split("=")[1]
        // console.log('token',token);
        jwt.verify(token, "amit",(err,id)=>{
            if(err){
                console.log('token expire.......');
            }
            else{
                req.id = id
                // console.log('ID veryfy here:-',req.id); // id on terminal 
                next()
            }
        }) 
    }
    else(
        next()
    )
}

module.exports = {veryfitoken,createToken}