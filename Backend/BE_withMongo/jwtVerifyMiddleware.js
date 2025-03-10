require('dotenv').config();
const jwt = require('jsonwebtoken');



function jwtVerifyMiddleware ( request, response, next) {

    //Since both accessToken and refreshToken use Cookie
    // Check request 's cookie
    //console.log(`Inside jwtVerifyMiddleWare, check the request is ${Object.entries(request)}`);
    console.log(`Inside jwtVerifyMiddleWare ~~~~~~`);
    const accessToken = request.cookies?.accessCookie ;//.accessCookie;
    console.log(`Inside jwtVerifyMiddleWare, accessToken is ${accessToken}`);

    if(!accessToken){
        console.log("no accessToken Found in jwtVerifyMiddleWare");
        return response.sendStatus(401);
    }
    else {

        try {
            const decoded_payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET ) ;
            console.log("Before assignment of decoded_payload.name, request's body is ", request.body);
            console.log("Before assignment of decoded_payload.name, request's cookies is ", request.cookies);
            console.log("Before assignment of decoded_payload.name, request's headers is ", request.headers);
            request.user = decoded_payload.name ;
            console.log(`Verification for accessToken is successful. The user is ${request.user}`);
            next();
        }

        catch (err) {
            console.log("Inside the catch block of jwtVerifyMiddleWare");
            console.log(err);
            console.log("Clear the accessCookie now");
            response.clearCookie("accessCookie",  { httpOnly: true,  }) ;  //secure: false
            //response.clearCookie('refreshCookie',  { httpOnly: true, maxAge: 15 * 24 * 60 * 60 * 1000}) ;
            return response.sendStatus(403) ; //Invalid Token
        }
        
    }
}

module.exports = jwtVerifyMiddleware;