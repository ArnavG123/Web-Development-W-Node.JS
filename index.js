const express = require('express');
const app = express();
const imageFolder = './public/uploads/';
const fs = require('fs');
const document = 'uploadform.ejs';
const port = 3000;

let fileslist= [];
fs.readdirSync(imageFolder).forEach(file => {
    fileslist.push("/uploads/" + file);
});
console.log(fileslist);

const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads');
    },

    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
})
const fileFilter = (req, file, cb) =>{
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png"){
        cb(null, true);
    } else {
        cb(null, false);
    }
} 

const upload = multer({storage: storage, fileFilter: fileFilter});

app.set('view engine', 'ejs');
app.use(express.static('public'));


app.listen(port, () => {
    console.log('Website running at http://localhost:' + port)
});

app.get("/uploadform", (req,res) => {
    res.render('uploadform', {
        fileslist: fileslist
    });
});

app.post("/uploadform", upload.single("image"), (req, res) => {
    res.render('image-uploaded')
    
    fileslist=[];
    fs.readdirSync(imageFolder).forEach(file => {
        fileslist.push("/uploads/" + file);
    });
    console.log(fileslist)
});