require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const chalk = require('chalk');
const mongoose = require('mongoose');
const DB = require('./configuration/Database');

const app = express();
const port = process.env.PORT

// Database connection
const dbOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
};

mongoose.connect(DB.connectionString, dbOptions);


// Middleware configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Call api routes.

app.use('/auth', require('./routes/Users/User'));


// Starting server
mongoose.connection.on('connected', () => {
    console.log(chalk.greenBright('Database is connected'));
    app.listen(port, (err) => {
        if (err) {
            console.log(chalk.red(`Error starting server: ${err}`));
        }
        console.log(chalk.green(`Server started on port: ${port}`));
        console.log(chalk.greenBright(`http://localhost:${port}`))
    });
});
