import express from 'express'
import cors from 'cors'
import routes from './routes/index.js'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const app = express()

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("MongoDB connection error:", err))

app.use(cors())
app.use(express.json())

app.use('/', routes)

export default app
