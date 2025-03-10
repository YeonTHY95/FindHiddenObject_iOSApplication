require("dotenv").config();

const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const imageInfoSchema = new Schema ({
    imageID : String , //Schema.Types.UUID,
    imageName : String,
    HiddenObjectPixelLocation : Object,
    imageURL : String
});

const exclusiveImageInfoSchema = new Schema ({
    imageID : String , //Schema.Types.UUID,
    imageName : String,
    HiddenObjectPixelLocation : Object,
    imageURL : String
});

const imageInfoiOSSchema = new Schema ({
    imageID : String , //Schema.Types.UUID,
    imageName : String,
    HiddenObjectPixelLocation : Object,
    imageURL : String
});

const userInfoSchema = new Schema ({
    name : String,
    hashpassword : String,
    sex : String,
    email : String,
    age : Number
});

const imageModel = model("imageinfo",imageInfoSchema,"imageinfo") ;
const allImageModel = model("allimageinfo",imageInfoSchema,"allimageinfo") ;
const exclusiveImageModel = model("exclusiveimageinfo",exclusiveImageInfoSchema,"exclusiveimageinfo") ;
const imageiOSModel = model("imageinfoios",imageInfoiOSSchema,"imageinfoios") ;
const userInfoModel = model('userinfo', userInfoSchema,'userinfo');

module.exports = {userInfoModel,imageModel,imageiOSModel,exclusiveImageModel,allImageModel} ;