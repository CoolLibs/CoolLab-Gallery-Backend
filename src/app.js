// Code from https://www.geeksforgeeks.org/upload-and-retrieve-image-on-mongodb-using-mongoose/

// Step 1 - set up express & mongoose

var express = require("express")
var app = express()
var bodyParser = require("body-parser")
var mongoose = require("mongoose")

var fs = require("fs")
var path = require("path")
require("dotenv/config")

// Step 2 - connect to the database

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

// Step 3 - code was added to ./models.js

// Step 4 - set up EJS

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Step 5 - set up multer for storing uploaded files

var multer = require("multer")

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads")
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now())
  },
})

var upload = multer({ storage: storage })

// Step 6 - load the mongoose model for Image

var imgModel = require("./model")

// Step 7 - the GET request handler that provides the HTML UI

app.get("/", async (req, res) => {
  try {
    const articles = await imgModel.find({})
    res.send(articles)
  } catch (err) {
    console.log(err)
    res.status(500).send("An error occurred", err)
  }
})

// Step 8 - the POST handler for processing the uploaded file

app.post("/", upload.single("image"), async (req, res, next) => {
  var obj = {
    name: req.body.name,
    desc: req.body.desc,
    img: {
      data: fs.readFileSync(
        path.join(__dirname, "../uploads", req.file.filename)
      ),
      contentType: "image/png",
    },
  }
  try {
    const item = await imgModel.create(obj)
    // item.save();
    res.redirect("/")
  } catch {
    console.log(err)
  }
})

// Step 9 - configure the server's port

var port = process.env.PORT || "3000"
app.listen(port, (err) => {
  if (err) throw err
  console.log("Server listening on port", port)
})
