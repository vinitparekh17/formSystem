const express = require("express");
const app = express();
const cloudinary = require('cloudinary').v2;
const fileupload = require('express-fileupload');
const ejs = require('ejs');
require('dotenv').config()
const { CLOUD_NAME, CLOUD_KEY, CLOUD_SECRET } = process.env
cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: CLOUD_KEY,
    api_secret: CLOUD_SECRET
})

app.use(express.json())
// for locally getting an image
app.use(fileupload({
    useTempFiles: true,
    tempFileDir: 'tmp'
}))
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs')

app.get('/getform', (req, res) => {
    res.render('getform')
})

app.get('/postform', (req, res) => {
    res.render('postform')
})

app.get('/myget', (req, res) => {
    res.send('req.body')
})

app.post('/mypost', async (req, res) => {
    const { firstname, lastname } = req.body
    let files = new Array(req.files.file)
    let result;
    let imageArray = [];
    console.log("file: ",files);
    console.log("Length: ", files.length);
    if (files) {
        for (let i = 0; i < files.length; i++) {
            result = await cloudinary.uploader.upload(files[i].tempFilePath, {
                folder: 'users'
            })
            imageArray.push({
                public_id: result.public_id,
                secure_url: result.secure_url
            })
        }
    }
    console.log(imageArray);
    details = {
        firstname,
        lastname,
        result,
        imageArray
    }
    res.send(req.body);
})


app.listen(3001, () => console.log(true))