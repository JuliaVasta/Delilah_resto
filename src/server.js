const express = require('express')
const bodyParser = require('body-parser')

const { port } = require('./config')
const authRoutes = require('./controllers/auth')
const userRoutes = require('./controllers/user')
const auth = require('./middlewares/auth')
const ordersRoutes = require('./controllers/orders')
const productsRoutes = require('./controllers/products')

const app = express()

app.use(bodyParser.json())

app.use('/', authRoutes)
app.use(userRoutes)
app.use('/orders', ordersRoutes)
app.use('/products', productsRoutes)

app.get('/', (req, res) => res.send('Hello World'))

app.listen(port, () => console.log('Server listening'))
