require('dotenv').config();
require('./websocket/wsServer')();
const EXPRESS = require('express');
const debug = require('debug')('wallet-service:server');
const http = require('http');

const { PORT_EXPRESS } = process.env;
const APP = EXPRESS();

require('./config/express')(APP, PORT_EXPRESS);
require('./routes/routes')(APP);

const server = http.createServer(APP);

/**
 * Event listener for HTTP server "error" event.
 */
const onError = (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof PORT_EXPRESS === 'string'
    ? `Pipe ${PORT_EXPRESS}`
    : `Port ${PORT_EXPRESS}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
};

/**
 * Event listener for HTTP server "listening" event.
 */
const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? `pipe ${addr}`
    : `port ${addr.port}`;
  debug(`Listening on ${bind}`);
};

server.on('error', onError);
server.on('listening', onListening);
server.listen(PORT_EXPRESS);

console.log(`Express server is listening on port ${PORT_EXPRESS}`);
