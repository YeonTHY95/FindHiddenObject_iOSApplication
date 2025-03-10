require('dotenv').config();

const express = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const PORT = process.env.PORT || 7000 ;

const app = express();

let initialTime ;

app.use(express.static('public'));
//app.use(express.json());
app.use(express.urlencoded({ extended: false}));
//app.use(cors());

app.listen(PORT, (error) => {
    if (error) throw new Error(error);
    console.log(`Backend Server Listening on Port ${PORT}`);
});


let images ;
async function main() {
    images = await prisma.imageinfo.findMany();

}

main().then( async ()=> {
    await prisma.$disconnect();
}).catch( async e => {
    console.log(e);
    await prisma.$disconnect();
});


app.get('/api/images', (request, response)=> {

    console.log(`Inside api images, images is ${typeof images}`);
    response.json(images);
});

app.get('/api/images/:imageName', async (request, response)=> {

    console.log(`Inside imageName, imageName is ${request.params.imageName}`);

    const image = await prisma.imageinfo.findFirst(
        {
            where : {
                imageName : request.params.imageName
            }

        }
    );

    console.log(`Inside imageName, image from Prisma is ${JSON.stringify(image)}`);
    response.json(image);
});

app.get('/api/startTimer', (request, response)=>{
    console.log(`Received Timer Request from client, received time is ${Date.now()}`);
    const startTime = Date.now(); //in milliseconds
    //const delta = startTime - initialTime ;
    response.send({ startTime : startTime });
} );

app.get('/api/endTimer', (request, response)=>{
    console.log(`Received EndTimer Request from client, received time is ${Date.now()}`);
    const endTime = Date.now(); //in milliseconds
    //const delta = startTime - initialTime ;
    response.send({ endTime });
} );

app.get("/", async (request, response) => {
    console.log("Inside Test GET Backend Main API");
    //console.log(request);
    response.send("Test GET BackEnd Main Response API");
});