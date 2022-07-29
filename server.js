const express = require('express')
const app = express()
const multer = require('multer')
const path = require('path')
const port = 5000


const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.originalname + '-' + uniqueSuffix + '.jpg')
    }
})

const isPicture = (name, mimetype) => {
    return(
        name.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/) && mimetype == "image/png" || mimetype == "image/jpg" || mimetype == "image/jpeg"
    )
}

const fileFilter = (req, file, cb) => {
    const { originalname, mimetype } = file;
    if(!isPicture(originalname, mimetype)) {
        req.fileValidationError = 'Please Pictures Only';
        return cb('Please Pictures Only', false)
    }
    cb(null, true)
}

const upload = multer({ storage: fileStorage, fileFilter})

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

app.post('/upload-profile', upload.single('profile_pic') ,(req, res) => {

    const { file, fileValidationError } = req;
    
    if (fileValidationError) {
        return res.status(500).send(fileValidationError);
      }
    
      if (!file) {
        return res.status(400).send('Please upload a file');
      }
    res.send(`<h2>Here is the picture:</h2><img src="http://localhost:5000/uploads/${req.file.filename}" alt="something" width="600"/>`)
})

app.post('/upload-cat-pics', upload.array('cat_pics', 10), (req, res, next) => {
    console.log(req.files)
    res.send(`<h2>Here are the pictures:</h2><img src="http://localhost:5000/uploads/${req.files.filename}" alt="something" width="600"/>`)
})

app.use('/uploads', express.static('uploads'));



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

