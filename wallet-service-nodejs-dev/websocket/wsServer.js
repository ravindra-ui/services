const zlib = require('zlib');
const WebSocket = require('ws');

const { PORT_WEBSOCKET, BIT_MART_WEBSOCKET_URL } = process.env;

let ws;
let wss;
let pingTimeout;
let pingInterval;
const delay = 20000;
const heartbeatDelay = 30000;
const tickerData = {
  source: 'BitMart',
  priceData: {},
};
const sub = {
  op: 'subscribe',
  args: [
    'spot/ticker:ETH_USDT',
    'spot/ticker:NYN_USDT',
  ],
};

const handleWebSocketData = (data) => {
  data.forEach((d) => {
    const { symbol, last_price, open_24h } = d;
    tickerData.priceData[symbol] = {
      symbol,
      last_price,
      open_24h,
      fluctuation: ((last_price - open_24h) / open_24h),
    };
  });
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      // console.log('[WSS] Sending new data to client!');
      client.send(JSON.stringify(tickerData));
    }
  });
};

function heartbeat() {
  // console.log('[WSS] heartbeat');
  this.isAlive = true;
}

const setupWebSocketClient = () => {
  try {
    ws = new WebSocket(BIT_MART_WEBSOCKET_URL);

    const clearPingTimeout = () => {
      if (pingTimeout) {
        clearTimeout(pingTimeout);
        pingTimeout = null;
      }
    };

    const handlePing = () => {
      clearPingTimeout();
      pingTimeout = setTimeout(() => {
        // console.log('[WS] ping');
        ws.ping('ping');
      }, delay);
    };

    ws.onopen = () => {
      console.log('[WS] WebSocket Client connected!');
      clearPingTimeout();
      ws.send(JSON.stringify(sub));
    };

    ws.onerror = (evt) => {
      console.log('[WS] onError', evt);
      clearPingTimeout();
    };

    ws.onclose = (evt) => {
      console.log('[WS] onClose', evt.code, evt.reason);
      clearPingTimeout();
      setupWebSocketClient();
    };

    ws.onmessage = (msg) => {
      handlePing();
      if (Buffer.isBuffer(msg.data)) {
        zlib.inflateRaw(msg.data, { windowBits: zlib.constants.Z_MAX_WINDOWBITS }, (err, res) => {
          if (err || !res) {
            console.log('[WS] onMessage => Error: ', err);
            return;
          }
          const result = JSON.parse(res.toString('utf8'));
          handleWebSocketData(result.data);
        });
      } else {
        const result = JSON.parse(msg.data);
        handleWebSocketData(result.data);
      }
    };
  } catch (e) {
    console.log('[WS-Error]', e);
  }
};

const setupWebSocketServer = () => {
  try {
    wss = new WebSocket.WebSocketServer({ port: PORT_WEBSOCKET, path: '/ticker' });

    wss.on('listening', () => {
      console.log(`WebSocket server is listening on port ${PORT_WEBSOCKET}`);
    });

    wss.on('connection', (wsClient) => {
      // console.log('[WSS] New connection!');
      // eslint-disable-next-line no-param-reassign
      wsClient.isAlive = true;
      wsClient.on('pong', heartbeat);
      wsClient.send(JSON.stringify(tickerData));
    });

    pingInterval = setInterval(() => {
      wss.clients.forEach((wsClient) => {
        // console.log('[WSS] wsClient => isAlive', wsClient.isAlive);
        if (wsClient.isAlive === false) {
          // console.log('[WSS] Terminating client!');
          return wsClient.terminate();
        }
        // eslint-disable-next-line no-param-reassign
        wsClient.isAlive = false;
        wsClient.ping();
        return null;
      });
    }, heartbeatDelay);

    wss.on('close', () => {
      // console.log('[WSS] onClose');
      if (pingInterval) {
        clearInterval(pingInterval);
        pingInterval = null;
      }
    });
  } catch (e) {
    console.log('[WSS-Error]', e);
  }
};

const init = () => {
  setupWebSocketServer();
  setupWebSocketClient();
};

module.exports = init;
