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

const upload = multer({ storage: fileStorage })

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

app.post('/upload-profile', upload.single('profile_pic') ,(req, res) => {
    res.send(`<h2>Here is the picture:</h2><img src="http://localhost:5000/uploads/${req.file.filename}" alt="something" width="600"/>`)
})

app.use('/uploads', express.static('uploads'));



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})



//WhatsApp Image 2022-04-01 at 9.08.39 AM.jpeg-1659086621355-338729442