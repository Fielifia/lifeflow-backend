import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
app.use(cors())
const port = process.env.PORT || 5000

app.get('/', (req, res) => {
    res.send('LifeFlow backend is running!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
