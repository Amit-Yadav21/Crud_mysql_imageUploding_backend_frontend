const express = require("express")
const {genratetoken, veryfitoken} = require('../JWT/jwt')
const {PasswordPage,forgetpassword,searchdata,searchPage,updatePage,loginPage,registerPage,alluserData, search, insertUserData, loginUser,loginUserData, updateUserData, deleteUserData,deleteAll_Data, logoutUserData} = require("../Controller/logic");
const {signup_Validation,login_Validation} = require("../Validation/Joi_Validation");

const updated = require('../Multer/multer')

const router =express.Router();
router.use('/image',express.static('Images'))                 // show image on localhost

// router.get('/password',PasswordPage)                                 // forgetpassPage 
// router.post('/forgetpassword', forgetpassword) 
 
router.get('/signup',registerPage)                            // signup page 
router.post('/signup',updated.product.single('Image'),signup_Validation,insertUserData)     // signup user 

router.get('/search',search )                                 // search any data on postman
// router.get('/searchpage',searchPage )                      // search page
router.post('/searchdata',searchdata )                        // search any data on browser

router.post('/login',login_Validation, loginUser)             // login user
router.get('/loginpage',loginPage)

router.get('/alldata', alluserData)                            // all user data show
router.get('/loginUserData',veryfitoken, loginUserData)        // show login user data 

router.get('/updateloginUser', updatePage)                     // update current login user data 
router.post('/updatedata',updated.product.single('Image'),veryfitoken, updateUserData)           // update current login user data 
// router.get('/updatedata',updated.product.single('Image'),veryfitoken, updateUserData)           // update current login user data 

router.get('/deleteuser',veryfitoken,deleteUserData)           // delete login user on browser
router.delete('/delete',veryfitoken,deleteUserData)            // delete login user data 

router.delete('/deleteAll',deleteAll_Data)                     // delete all data 
router.get('/deleteAll',deleteAll_Data)                        // delete all data from browser

router.get('/logout',veryfitoken, logoutUserData)              // logout current login user data

module.exports =router
