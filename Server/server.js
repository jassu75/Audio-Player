import express from "express"
import dotenv from "dotenv"

const app = express()
dotenv.config()
app.use(express.json());

app.listen(process.env.PORT, () => {
    console.log("Server started successfully")
})