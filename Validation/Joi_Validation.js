const Joi = require('joi');

const signup_Validation = (req, res, next)=>{
    const schema =Joi.object().keys({
        Name : Joi.string().required(),
        Email : Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com','org','edu'] } }),
        Password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,16}$'))
        .messages({'string.pattern.base':'Invalid Password. Type min 3 digit and max 16 digit'})
        .required(),
        Address : Joi.string().required(),
        // Address : Joi.array().items().required(),
        // Phone_Number : Joi.number().min(1000000000).max(9999999999).required()
        Phone_Number: Joi.string().pattern(new RegExp('^[0-9]{10,10}$'))
        .messages({'string.pattern.base':'Invalid phone number. Type min 10 digit and max 10 digit'})
        .required()
    })
    const {error} = schema.validate(req.body,{ abortEarly :false});
    if(error){
        res.status(200).json({error:error})
    }else{
        next()
    }
} 

const login_Validation = (req, res, next)=>{
    const schema =Joi.object().keys({
        Email : Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com','org','edu'] } }),
        Password : Joi.string().required(),
    })
    const {error} = schema.validate(req.body,{ abortEarly :false});
    if(error){
        res.status(200).json({error:error})
    }else{
        next()
    }
} 

module.exports = {signup_Validation,login_Validation}