require('dotenv').config();
const log4js = require('log4js');
log4js.configure('./log4js.json');

const Server = require('./server/Server');
Server.INSTANCE().run();
