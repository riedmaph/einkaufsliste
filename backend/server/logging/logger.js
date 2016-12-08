var path = require('path');
var winston = require('winston');
var fs = require('fs');
var logsdir = path.join('logging', 'logs');

//create directory for logs if it does not exist
if (!fs.existsSync(logsdir)){
    fs.mkdirSync(logsdir);
}

//Set up logging
winston.emitErrs = true;

var logger = new winston.Logger({
    transports: [
        new winston.transports.File({
            level: 'info',
            filename: path.join('logging', 'logs', 'all-logs.log'),
            handleExceptions: true,
            json: true,
            maxsize: 5242880, //5MB
            maxFiles: 5,
            colorize: false
        }),
        new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true
        })
    ],
    exitOnError: false
});

module.exports = logger;
module.exports.stream = {
    write: function(message, encoding){
        logger.info(message);
    }
};