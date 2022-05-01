const BALANCE_CONTROLLER = require('../controllers/balance');
const TRANSACTIONS_CONTROLLER = require('../controllers/transactions');
const ERROR_CONTROLLER = require('../controllers/error');

module.exports = (APP) => {
  APP.get('/balance', BALANCE_CONTROLLER.getBalance);
  APP.post('/nonce', TRANSACTIONS_CONTROLLER.getNonce);
  APP.post('/transaction', TRANSACTIONS_CONTROLLER.performTransaction);
  APP.post('/calculateTransactionFee', TRANSACTIONS_CONTROLLER.calculateTransactionFee);
  APP.post('/createTransaction', TRANSACTIONS_CONTROLLER.createTransaction);
  APP.post('/getTransactionHistory', TRANSACTIONS_CONTROLLER.getTransactionHistory);
  APP.post('/getERC20TokenTransactionHistory', TRANSACTIONS_CONTROLLER.getERC20TokenTransactionHistory);
  APP.all('*', ERROR_CONTROLLER.error);
};
