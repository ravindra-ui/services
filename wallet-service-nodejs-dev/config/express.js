const BODY_PARSER = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
// const cors = require('cors');

module.exports = (APP, PORT) => {
  APP.set('port', PORT);
  APP.use(BODY_PARSER.urlencoded({ extended: true }));
  APP.use(BODY_PARSER.json());
  // APP.use(cors());
  APP.use(logger('dev'));
  APP.use(cookieParser());
};
