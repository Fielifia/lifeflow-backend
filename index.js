import express from 'express'

const app = express()
const port = 5000

app.get('/', (req, res) => {
  res.send('LifeFlow backend is running!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
