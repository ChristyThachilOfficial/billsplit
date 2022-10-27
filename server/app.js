const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const db = require('./config/db')
const userRoutes = require('./routes/userRouter')
const expenseRoutes = require('./routes/expenseRouter')
const groupRoutes = require('./routes/groupRouter')


const app = express()
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())

try {
    db.connect((err) => {
        if (err) {
            console.log('connection error')
        } else {
            console.log('database connected')
        }
    })
} catch (err) {
    console.log(err)
}

app.use('/user', userRoutes)
app.use('/expense', expenseRoutes)
app.use('/group',groupRoutes)

app.listen(4000, () => {
    console.log('server started')
})