require('dotenv').config();

const express = require('express');

const mongoose = require("mongoose") ;

const {imageModel,userInfoModel,imageiOSModel, exclusiveImageModel,allImageModel} = require("./mongoDB/mongodb");

const jwt = require('jsonwebtoken');

const bcrypt = require("bcrypt");

const cors = require('cors');   

const jwtVerifyMiddleware = require("./jwtVerifyMiddleware");

const cookieParser = require('cookie-parser');

const { body, validationResult, matchedData } = require('express-validator');

var { createHandler } = require('graphql-http/lib/use/express') ;

var { buildSchema } = require('graphql');

/* ////////////////////

    Import and Initialization

*//////////////////////

CORS_WHITELISTS = ["http://frontend:80", "http://backend:6677", "http://backend_Mongo:6688"] ;

const CORS_Options = {
    origin : function ( origin, callback) {
        if( CORS_WHITELISTS.indexOf(origin) !== -1 ) {
            callback(null, true) ;
        }
        else callback(error, false) ;
    },
    optionsSuccessStatus: 200
} ;

const app = express(); 
app.use(express.json());
app.use( express.urlencoded( {extended: true}));
app.use(cookieParser());

//app.use(cors());
//app.set("trust proxy", true);

const MongoDBURL = `mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/hiddenObjectChallengeDB?authSource=admin`;

console.log("MongoDBURL is : ", MongoDBURL);
//const MongoDBURL = `mongodb://${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/hiddenObjectChallengeDB`;


mongoose.connect(MongoDBURL).then( ()=> {
    console.log("MongoDB is connected successfully")
}).catch(err => {
    console.log(err);
});

const listeningPort = process.env.SERVER_PORT || 6688 ;

app.listen(listeningPort, (request, response) => {
    console.log(`Backend Server listening on ${listeningPort}`);
    
});


/* ////////////////////

    Sign Up 

*//////////////////////

app.post('/signup', body("signup_username").custom( async username => {
    // Verify if the user name is already existed in DB
    const existingUser = await userInfoModel.findOne( { name : username}) ;
    if(existingUser) {
        throw new Error ("The user name is already used by others !!!") ;
        //return res.status(400).json( { errors : "The user name is already used by others !!!" });
    }
}), body("signup_password","The minimum size of Password must be 3").isLength( { min : 3} ) , async (req,res)=> {
    
    //console.log("req is : ");
    //console.log(req);
    //const { signup_username, signup_password } = req.body ;
    const { signup_username, signup_password } = matchedData(req) ;
    const validationError = validationResult(req);

    if ( !validationError.isEmpty()) { // mean there is validation error
        return res.status(400).json( { errors : validationError.array() });
    }
    
    console.log(`signup password is ${signup_password}`);

    bcrypt.hash(signup_password, 10, async function (err, encryptedPassword) {

        if (err) {
            console.log(err);
            res.status(400).send("Error with the password encr");
        }
        const user = await userInfoModel.insertMany( { name : signup_username, hashpassword : encryptedPassword });  
        console.log(`Created User ${user} Successfully`);
        res.sendStatus(201);
    });
    
});

/* //////////////////////////

    Login & JSON Web Token

*////////////////////////////

app.post('/login', async (req,res)=> {
    
    const { login_username, login_password } = req.body ;

    const user = await userInfoModel.findOne( { name : login_username});  

    if (!user) {
        console.log("No such User exists in Database");
        res.status(401).send("Invalid User, No such User exists");
    }
    else {
        console.log(`login_password is ${login_password}`);
        console.log(`user.hashpassword is ${user.hashpassword}`);

        try {

            bcrypt.compare(login_password, user.hashpassword , function(err, result) {

                console.log("Inside passwordCompared callback function");
                // console.log(`result is ${result}`);
                // console.log(`err is ${err}`);
                if (err) {
                    console.log("Inside passwordCompared callback function Error");
                    throw err;
                }

                if (result) {   // Correct Password          
                    console.log("Inside login bcrypt valid, creating Token");
                    
                    // Create Token
                    const accessToken = jwt.sign( {name : user.name }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15s' });
                    const refreshToken = jwt.sign( {name : user.name }, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '30m' });
    
                    res.cookie('accessCookie', accessToken, { httpOnly: true,  }) ;  //secure: false
                    res.cookie('refreshCookie', refreshToken, { httpOnly: true, maxAge: 15 * 24 * 60 * 60 * 1000}) ; // 15 days
                    return res.sendStatus(200);
                } 
                else { // Incorrect Password
                    console.log("Inside login bcrypt invalid, sending 401");
                    return res.status(401).send("Unauthorized, Please submit with correct info");   
                    
                }
            });
            

            //console.log(`passwordCompare is ${Object.entries(passwordCompare)}, type is ${typeof passwordCompare}`);

            // if (passwordCompare) {             
            //     console.log("Inside login bcrypt valid, creating Token");
                
            //     // Create Token
            //     const accessToken = jwt.sign( {name : user.name }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15s' });
            //     const refreshToken = jwt.sign( {name : user.name }, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '30s' });

            //     res.cookie('accessCookie', accessToken, { httpOnly: true,  }) ;  //secure: false
            //     res.cookie('refreshCookie', refreshToken, { httpOnly: true, maxAge: 15 * 24 * 60 * 60 * 1000}) ; // 15 days
            //     return res.sendStatus(200);
            // } 

           
        } 

        catch (err) {
            console.log(err);
            //return res.status(401).send(`Unauthorized, Please submit with correct info : ${err}!`);

        }
    }
        
    
}
        
);

app.get("/refreshToken", async (request, response)=> {

    //const refreshToken = request.headers.authorization.split(' ')[1]; // Bearer Token
    const refreshToken = request.cookies.refreshCookie ;
    if(!refreshToken){
        console.log("no refreshToken Found in request cookie");
        return response.status(401).send("No Refresh Token");
    }
    else {
        console.log("Inside RefreshToken API");

        try {
            const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET );

            const user = await userInfoModel.findOne( { name : payload.name });
            if (!user) {
                console.log("Inside RefreshToken API, No such User");
                return response.status(401).send("Invalid Token, No such User");
            }
            else { // renew accessToken

                const renewedAccessToken = jwt.sign({name : user.name }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15s'});
                response.cookie('accessCookie', renewedAccessToken, { httpOnly: true });
                console.log("Successfully attach and renew accessToken");
                console.log("User name is ", user.name);
                response.status(200).send("Successfully attach Token");
            }
        }
        catch (err) {
            console.log("Inside the catch block of refreshToken");
            console.log(err);
            response.clearCookie("accessCookie",  { httpOnly: true,  }) ;  //secure: false
            response.clearCookie('refreshCookie',  { httpOnly: true }) ;
            return response.sendStatus(403) ; //Invalid Token
        }
    }
});

/* ////////////////////

    User Page 

*//////////////////////

app.patch('/updateUserInfo', jwtVerifyMiddleware, body("toBeUsername").custom( async (username, {req}) => {
    // Verify if the user name is already existed in DB
    console.log("Before Inside Username Validation");
    const existingUser = await userInfoModel.findOne( { name : username}) ;
    if(existingUser) {

        const previousUsername = req.body.username ;

        console.log("Inside Username Validation, previousUserName is ", previousUsername) ;
        console.log("toBeUsername is ", username) ;

        if( previousUsername === username) {
            console.log("Same Account");
            return true;
        }

        else {
            throw new Error ("Cannot Update the username because it is already used by others !!!") ;
        }

    }
}), async(request, response)=> {
    const { toBeUsername } = matchedData(request) ;
    const validationError = validationResult(request);

    if ( !validationError.isEmpty()) { // mean there is validation error
        console.log("Cannot Update the username because it is already used by others!");
        return response.status(400).json( { errors : validationError.array() });
        
    }
    console.log("After jwtVerification, request's body is ", request.body);
    console.log("After jwtVerification, request's headers is ", request.headers);
    console.log("After jwtVerification, request's data is ", request.data);
    const { toBeAge, toBeSex, toBeEmail ,username } = request.body ;

    console.log(`Username changed to ${toBeUsername}, previous username is ${username}`);
    var age = sex = email = undefined; 

    if (toBeAge !== undefined) {
        console.log("Age is not undefined, Value : ", toBeAge);
        age = toBeAge;
    } else { console.log("toBeAge is undefined : ",toBeAge );}

    if (toBeSex !== undefined) {
        console.log("Sex is not undefined, Value : ", toBeSex);
        sex = toBeSex;
    } else { console.log("toBeSex is undefined : ", toBeSex);}

    if (toBeEmail !== undefined) {
        console.log("Email is not undefined, Value : ", toBeEmail);
        email = toBeEmail;
    } else { console.log("toBeEmail is undefined : ", toBeEmail);}

    console.log(`After submit the form, age is ${age}, sex is ${sex}, email is ${email}`);

    try {
        const updateUser = await userInfoModel.updateOne( { name : username}, { name : toBeUsername , age : age ? age : null , sex : sex ? sex : null , email : email ? email : null})
        console.log("After updated, acknowleged : ", updateUser.acknowledged) ;
        console.log("After updated, modified : ", updateUser.modifiedCount) ;
        if (updateUser.acknowledged) {
            console.log("User Updated Successfully") ;

            // Need to update the access and refresh Token

            // Delete previous old Token first
            response.clearCookie("accessCookie",  { httpOnly: true,  }) ;  //secure: false
            response.clearCookie('refreshCookie',  { httpOnly: true }) ;

            const accessToken = jwt.sign( {name : toBeUsername }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15s' });
            const refreshToken = jwt.sign( {name : toBeUsername }, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '30m' });

            response.cookie('accessCookie', accessToken, { httpOnly: true,  }) ;  //secure: false
            response.cookie('refreshCookie', refreshToken, { httpOnly: true, maxAge: 15 * 24 * 60 * 60 * 1000}) ; // 15 days
            response.json({ name : toBeUsername , age : age ? age : null , sex : sex ? sex : null , email : email ? email : null}) ;
        }
        else {
            console.log("UserInfoModel Acknowledged Failed") ;
            response.status(500).send("Something wrong with the Database") ;
        }
    }
    catch(error) {
        console.log(error);
    }


});

/* ////////////////////

    API 

*////////////////////// 

//cors(CORS_Options)
app.get('/getImages' , async (req,res)=> {

    console.log("Inside Get Image");
    const output = await imageModel.find();
    res.json(output);
    
});

app.get('/getExclusiveImages', jwtVerifyMiddleware , async (req,res)=> {
    
    console.log("Inside Exclusive Get Image");
    const output = await exclusiveImageModel.find();
    res.json(output);
    
});

app.get('/ios/getImages' , async (req,res)=> {

    console.log("Inside Get Images");
    const output = await imageiOSModel.find();
    res.json(output);
    
});

app.get('/getImage/:imageName', async (req,res)=> {

    console.log("Inside Get Image for ", req.params.imageName);
    try {
        const output = await allImageModel.find({imageName:req.params.imageName}, {_id:false});
        const parseOutput = output[0].HiddenObjectPixelLocation;
        console.log(parseOutput);
        ///

        const HiddenObjectPixelLocationInArray = Object.entries(parseOutput);
        console.log(`HiddenObjectPixelLocationInArray is `);
        console.log(HiddenObjectPixelLocationInArray);
        const itemInfoInArray = HiddenObjectPixelLocationInArray.map((array) => { 
            console.log(array[0]);
            console.log(array[1]);
            //return { array[0]: array[1]}; 
            const returnItem = {};
            returnItem[array[0]]= array[1];
            return returnItem;
        });
        console.log(`itemInfoInArray is $`)
        console.log(itemInfoInArray);
        ///
        console.log(JSON.stringify(output));
        res.json(output);

    }
    catch(err) {
        console.log(err) ;
    }
    
    
});

app.get('/getUserInfo', jwtVerifyMiddleware, async (request, response) => {
    console.log("Inside Get UserInfo");
    const output = await userInfoModel.find({name:request.query.username}, {_id:false, hashpassword:false});
    console.log(JSON.stringify(output));
    response.json(output);
});

/* ////////////////////

    Log Out 

*////////////////////// 

app.post("/logout", async (request, response) => {

    response.clearCookie("accessCookie",  { httpOnly: true,  }) ;  //secure: false
    response.clearCookie('refreshCookie',  { httpOnly: true }) ;
    response.sendStatus(204);
});

app.post("/deleteAccount", jwtVerifyMiddleware, async (request, response) => {

    console.log("Inside Delete Account.");

    const deleteAccountName = request.query.username ;

    const deletedResult = await userInfoModel.deleteOne( {name : deleteAccountName}) ;

    if (deletedResult.deletedCount > 0) {
        console.log("Deleted Account Successfully.");
        response.clearCookie("accessCookie",  { httpOnly: true,  }) ;  //secure: false
        response.clearCookie('refreshCookie',  { httpOnly: true, }) ;
        response.sendStatus(204);
    }
    else {
        console.log("Something wrong with the deletion of Account");
        response.status(500).send("Something wrong with the deletion of Account with relation to Database") ;
    }

    
});


/* ////////////////////

    GraphQL API

*////////////////////// 

var graphQLSchema = buildSchema(`
    type Query{
        imageinfo(imageName: String): ImageInfo
    }

    type ImageInfo {
        imageID: String,
        imageName: String,
        HiddenObjectPixelLocation: [ItemInfo],
        imageURL: String
    }

    type ItemInfo{
        item: String,
        itemLocation : [ItemLocationCoordinates]
    }

    type ItemLocationCoordinates {
        x: String,
        y: String
    }

    type Mutation{
        signupNewAccount(signup_username: String, signup_password: String): SignUpResponse
    }
    
    type User{
        username: String
        password: String
    }

    type SignUpResponse{
        status: Int
        response: ResponseErrorData
    }

    type ResponseErrorData {
        data: [ErrorDetails]
    }

    type ErrorDetails{
        type: String 
        path: String 
        msg: String
    }
`);

var graphQLResolver = {
    //Query: {
        imageinfo: async ({imageName})=> {
            const output = await allImageModel.find({imageName}, {_id:false});
            const outputFromMongoDB = output[0];
            const HiddenObjectPixelLocationInArray = Object.entries(outputFromMongoDB.HiddenObjectPixelLocation);
            const itemInfoInArray = HiddenObjectPixelLocationInArray.map(array => { 
                const returnArray = {};
                returnArray["item"]=array[0];
                returnArray["itemLocation"]=array[1];
                return returnArray;
             });
            
            return { imageID : outputFromMongoDB.imageID, imageName : outputFromMongoDB.imageName, HiddenObjectPixelLocation: itemInfoInArray, imageURL : outputFromMongoDB.imageURL}
    
        },
        // Mutation: {
            async signupNewAccount({signup_username, signup_password}){
                const existingUser = await userInfoModel.findOne( { name : signup_username}) ;
                var isErrorExisted = false;
                var ErrorDetailsArray = [] ;

                console.log("Inside Mutation SignUpNewAccount");
                

                if(existingUser) {
                    //throw new Error ("The user name is already used by others !!!") ;
                    console.log("Inside Mutation SignUpNewAccount existingUser Issue");
                    ErrorDetailsArray.push({
                        "type": "field",
                        "path": "signup_username" ,
                        "msg": "The user name is already existed !!!"
                    });
                    
                    isErrorExisted = true ;
                    console.log("Set Error Existed to True");
                }

                // For Password The minimum size of Password must be 3
                if (signup_password.length < 3) {
                    console.log("Inside Mutation SignUpNewAccount password Issue");
                    ErrorDetailsArray.push({
                        type: "field",
                        path: "signup_password" ,
                        msg: "The minimum size of Password must be 3 !!!"
                    });
                    console.log("Set Error Existed to True");
                    isErrorExisted = true ;
                }

                // Either username or password invalid
                if(isErrorExisted){
                    console.log("Inside Mutation SignUpNewAccount to send error out");
                    return {
                        status : 400,
                        response : {
                            data : ErrorDetailsArray
                        }

                    }
                }
                else {
                    console.log("Inside Mutation SignUpNewAccount before hashing password");
                    bcrypt.hash(signup_password, 10, async function (err, encryptedPassword) {

                        if (err) {
                            console.log("Inside Hashing Error");
                            console.log(err);
                            return {
                                status : 400,
                                response : {
                                    data : [
                                        {
                                            type: "field",
                                            path: "Password Error" ,
                                            msg: err.message
                                        }
                                    ]
                                }
        
                            }
                        }
                        const user = await userInfoModel.insertMany( { name : signup_username, hashpassword : encryptedPassword });  
                        console.log("After inserMany");
                        console.log(`Created User ${user} Successfully`);

                        
                        
                    });

                    
                    return {
                        status : 201,
                        response : {
                            data : 
                                [{
                                    type: "",
                                    path: "" ,
                                    msg: `Created User Successfully`
                                }]
                            
                        }
    
                    }
                }

            },
        // }
        
    //}
    
}

app.all('/graphql', createHandler({
    schema : graphQLSchema,
    rootValue : graphQLResolver

}));