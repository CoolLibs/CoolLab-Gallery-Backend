const express = require("express")
require("dotenv").config()
const app = express()
const uploadRouter = require("./routes/upload.routes")
const port = process.env.PORT || 9000

app.use(express.json())
// app.use("/upload", uploadRouter)
const { uploadImage } = require("./upload.controller")
const { upload } = require("./upload.service")

app.post("/", upload.single("image"), uploadImage)

app.listen(port, () => {
  console.log(`Server running on port: ${port}`)
})
