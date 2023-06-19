const express = require('express')
const bcrypt = require('bcrypt');
const { createToken } = require('../JWT/jwt')
const knex = require('../Database/database')

// ==================================== frontent Part rendering page on browser
// ------------------------------- register page
let registerPage = (req, res) => {
    res.render('../FrontEnd/page/registerPage.ejs');
}
// -------------------------------login page
let loginPage = (req, res) => {
    res.render('../FrontEnd/page/loginPage.ejs'); 
}
// ----------------------------- update page
let updatePage = (req, res) => {
    res.render('../FrontEnd/page/updatePage.ejs');
}
// --------------------------------- search page
let searchPage = (req, res) => {
    res.render('../FrontEnd/searchpage.ejs');
}
// -------------------------------- forget password page
let PasswordPage = (res,req)=>{
    res.render('../FrontEnd/forgetpassPage.ejs');
}

// ======================================================= Backent part Here
// --------------------------------------------- read all uaser data
let alluserData = async (req, res) => {
    try {
        const data = await knex('datas')
        if (!data.lenth > 0) {
            const responseData = data.map(item => {
                if (!item.Image.startsWith('http')) {
                    // Image column doesn't contain the base URL, prepend it
                    item.Image = `http://localhost:4000/image/${item.Image}`;
                }
                return item;
            });
            res.render('../FrontEnd/page/AllUserData.ejs', { Datas: responseData });
            // res.send({ 'All data here ': responseData}) // show all data on postman
        }
        else {
            res.send({ message: 'Not anyone data availeble ' })
        }
    }
    catch (err) {
        res.send(err.message);
    }
}

// --------------------------------------------- serach any data of user
let search = async (req, res) => {
    try {
        const search = req.body
        const what_search = search.Name || search.Email || search.Address || search.Phone_Number
        // console.log('what is seasrching :-',what_search);

        const data = await knex('*').from('datas');
        // console.log('All data here :',data);
        const searchData = data.filter((item) => {

            const name = item.Name;
            const email = item.Email;
            const address = item.Address;
            const phone = item.Phone_Number;

            return (
                name.includes(what_search) ||
                email.includes(what_search) ||
                address.includes(what_search) ||
                phone.includes(what_search)
            );
        })
        if (searchData.length > 0) {
            // res.send({ 'searching data here': searchData })     // serch any data on postman
            // console.log("searching data here :- ",searchData);
            res.render('../FrontEnd/searchpage.ejs', { Datas: searchData });
        }
        else {
            res.send({ message: 'user data not found. please type correctly...' })
        }
    }
    catch (err) {
        res.send(err.message);
    }
}

// ------------------------------------------------- search any data on browser 
let searchdata = async (req, res) => {
    try {
        const search = req.body
        const what_search = search.Name || search.Email || search.Address || search.Phone_Number
        // console.log('what is seasrching :-',what_search);

        const data = await knex('*').from('datas');
        // console.log('All data here :',data);
        // const searchData = data.filter((item) => {

        //     const name = item.Name;
        //     const email = item.Email;
        //     const address = item.Address;
        //     const phone = item.Phone_Number;

        //     return (
        //         name.includes(what_search) ||
        //         email.includes(what_search) ||
        //         address.includes(what_search) ||
        //         phone.includes(what_search)
        //     );
        // })
        // if (searchData.length > 0) {
        //     res.send({ 'searching data here': searchData })
        //     // console.log("searching data here :- ",searchData);
        //     res.render('../FrontEnd/searchpage.ejs', { Datas: data });        }
        // else {
        //     res.send({ message: 'user data not found. please type correctly...' })
        // }
        res.render('../FrontEnd/searchpage.ejs', { Datas: data });
    }
    catch (err) {
        res.send(err.message);
    }
}


// ---------------------------------------------- signup user
let insertUserData = async (req, res) => {
    try {
        let { Name, Email, Password, Address, Phone_Number } = req.body;
        Password = await bcrypt.hash(Password, 10); // password bcrypt here 
        // console.log('this is bcrypt password : ', Password);

        let data = await knex('datas').where({ Email })  // read here 
        // console.log('===============',data);
        if (data.length > 0) {
            res.send({
                message: 'You are allready done signUp Please go and login',
                "This is your data": data
            });
        }
        else {
            const d = await knex('datas').insert({ Name, Email, Password, Address, Phone_Number, Image: `http://localhost:4000/image/${req.file.filename}` })
            // res.send({ message: 'user data inserted successfully ', signup_user: req.body })
            res.redirect('http://localhost:4000/signup')
        };
    }
    catch (error) {
        // console.error(error);
        res.send(error.message);
    }
}

// ----------------------------------------------- login user
let loginUser = async (req, res) => {
    try {
        let { Email, Password } = req.body

        let data = await knex('datas').where({ Email });
        // console.log('============', data);
        if (!data) {
            res.send({ message: 'Please signUp frist' });
        }
        else {
            const phoneMatch = await bcrypt.compare(Password, data[0].Password);
            // console.log('++++++++++++++++++',phoneMatch);

            let id = data[0].Employee_ID   // here I got the id from the login user
            // console.log('id',id);
            const token = await createToken(id)  // generatetoken here
            // console.log('token',token);
            res.cookie('token', token);
            // res.send({'login user data': data,"token": token }) // show data on postman
            res.render('../FrontEnd/page/loginUserData.ejs', { Datas: data })
            // res.redirect('http://localhost:4000/loginUserData')
        }
    }
    catch (error) {
        console.log(error.message);
        res.send({ message: 'Please check Email or password is wrong.' })
    }
}

// -------------------------------------------- forgetpassword signup user's password
let forgetpassword = async (req, res) => {
  try {
    let { Email, Password } = req.body;
    let user = await knex('datas').where({ Email }).first();
    console.log(user);
    if (!user) {
      res.json({ error: 'Invalid Email...' });
    } else {
        console.log('---------------------------------');
      const hashedPassword = await bcrypt.hash(Password, 10);
      const data = await knex('datas').where({ Email }).update({ Password: hashedPassword });
    //   res.json({ "user id": Email, 'update user data successfully': req.body });
    res.render('../FrontEnd/forgetpassword.ejs')
    }
  } catch (error) {
    console.log(error);
    res.json({ message: 'Please login first' });
  }
};

// ----------------------------------------------- show login user data
let loginUserData = async (req, res) => {
    try {
        let id = req.id;
        // console.log('verfi login Id.................... ',id);
        const data = await knex('datas').where({ Employee_ID: id });
        // console.log('......... login user data :',data[0]);

        if (data.length > 0) {
            // res.send({ 'show login user data successfully ': data }) // show data on postman
            res.render('../FrontEnd/page/loginUserData.ejs', { Datas: data });
        } else {
            res.json({ errorMessage: 'Please log in first.' });
        }
    } catch (err) {
        res.json({ errorMessage: 'User not login. Plesae go to the login first .' });
    }
}

// -------------------------------------------- update login user
let updateUserData = async (req, res) => {
    try {
        const id = req.id       // find id with jwt logn user data
        // console.log(id);
        let user = await knex('datas').where({ Employee_ID: id });
        if (!user) {
            res.json({ error: 'Invalid username or password' });
        };

        let { Name, Email, Password, Address, Phone_Number } = req.body;
        const image = `http://localhost:4000/image/${req.file.filename}`;
        Password = await bcrypt.hash(Password, 10);

        let rows = await knex('datas').where({ Email })
        if (rows.length > 0) {
            res.json({ message: 'login first' });
        }
        else {
            const data = await knex('datas').where({ Employee_ID: id }).update({ Name, Email, Password, Address, Phone_Number, Image: image });
            // res.json({ "user id": id, 'update user data successfully ': req.body }); // show data on postman
            res.redirect('http://localhost:4000/loginUserData')
        }
    }
    catch (error) {
        console.log(error);
        res.json({ message: 'Please login first' })

    }
}

// ---------------------------------------------- delete login user
let deleteUserData = async (req, res) => {
    try {
        const id = req.id  // find id with jwt login user data
        const rows = await knex('datas').where({ Employee_ID: id });
        if (rows.length > 0) {
            const data = await knex('datas').where({ Employee_ID: id }).del(id)
            // res.send({ Delete_user_info: 'data delete successfuly....', "this is your data": rows }) // show data on postman
            res.redirect('http://localhost:4000/signup')  // after delere data go to the signup page
        } else {
            res.send({ message: 'sorry data not found.....', info: 'login first' })
        }
    }
    catch {
        res.send({ message: 'user data not find...' })
    }
}

// ------------------------------------------ delete all user
let deleteAll_Data = async (req, res) => {
    try {
        const data = await knex('datas').truncate();
        // res.send({ message: 'Delete all user' })     // show data on postman 
        res.redirect('http://localhost:4000/alldata')   // after delete all data gor to the show all data page on browser
    }
    catch {
        res.send('user data not find...')
    }
}

// ------------------------------------------ logout login user
let logoutUserData = async (req, res) => {
    try {
        const id = req.id  // find id with jwt login user data
        const data = await knex('datas').where({ Employee_ID: id })
        if (data.length > 0) {
            res.clearCookie('token')
            // res.send({ "Login User ID": id, 'Logout User Name': data[0]['Name'] }) // logout details show on postman
            // console.log('login user id :-', id);
            res.redirect('http://localhost:4000/loginPage')
        }
        else {
            res.send({ message: 'User Not Found...' })
        }
    }
    catch {
        res.send({ message: 'Login First...' })
    }
}


module.exports = {PasswordPage,forgetpassword,searchdata, searchPage, updatePage, loginPage, registerPage, alluserData, search, insertUserData, loginUser, loginUserData, updateUserData, deleteUserData, deleteAll_Data, logoutUserData }