const mongoose = require('mongoose');
const chalk = require('chalk');

const URI = process.env.DB_CONN;

// Logging our connection

mongoose.connection.on('error', function(err) {
    console.log(chalk.red(`Error connecting to the db: ${err}`));
});

module.exports = {
    connectionString: URI
}