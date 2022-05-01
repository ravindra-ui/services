const Web3 = require('web3');
const constants = require('../config/constants');
const {
  callApi, getRequestWithParams, getETH, getNYN,
} = require('../utils/rest');

const web3 = new Web3(new Web3.providers.HttpProvider(process.env.INFURA_PROJECT_URL));
const getAbiArray = () => [
  {
    constant: true,
    inputs: [],
    name: 'totalSupply',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: '_owner',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_to',
        type: 'address',
      },
      {
        name: '_value',
        type: 'uint256',
      },
    ],
    name: 'transfer',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'from',
        type: 'address',
      },
      {
        indexed: true,
        name: 'to',
        type: 'address',
      },
      {
        indexed: false,
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
];

module.exports = {
  getNonce: async (req, res) => {
    try {
      const { address } = req.body;
      console.log('--------------------------');
      console.log('Get Nonce');
      console.log(`Address : ${address}`);
      console.log('--------------------------');

      const nonce = await web3.eth.getTransactionCount(address, 'pending');
      return res.status(200).json({ nonce });
    } catch (e) {
      console.log('[TRANSACTIONS-CONTROLLER-ERROR] getNonce', e?.message || e);
      // TODO: Maybe parse error and return something meaningfully
      return res.status(400).json({ error: true, message: 'Error' });
    }
  },
  performTransaction: async (req, res) => {
    try {
      const { signedTransaction } = req.body;
      console.log('--------------------------');
      console.log('Perform Signed Transaction');
      console.log(`SignedTransaction : ${signedTransaction}`);
      console.log('--------------------------');

      const transactionReceipt = await web3.eth.sendSignedTransaction(signedTransaction);
      return res.status(200).json({ transactionHash: transactionReceipt.transactionHash });
    } catch (e) {
      console.log('[TRANSACTIONS-CONTROLLER-ERROR] performTransaction', e?.message || e);
      // TODO: Maybe parse error and return something meaningfully
      return res.status(400).json({ error: true, message: 'Error' });
    }
  },
  calculateTransactionFee: async (req, res) => {
    const { from, to } = req.body;
    let gasPrice;
    console.log('--------------------------');
    console.log('Calculate Transaction Fee');
    console.log(req.body);
    console.log('--------------------------');

    try {
      gasPrice = await web3.eth.getGasPrice(); // in wei
    } catch (e) {
      console.log('[TRANSACTIONS-CONTROLLER-ERROR] calculateTransactionFee => getGasPrice', e?.message || e);
      // TODO: Maybe parse error and return something meaningfully
      return res.status(400).json({ error: true, message: 'Error' });
    }
    const gasPriceEth = web3.utils.fromWei(gasPrice, 'ether');
    // For ETH
    const transactionObject = {
      from,
      to,
      gasPrice,
    };

    try {
      const gasLimit = await web3.eth.estimateGas(transactionObject);

      console.log('======================');
      console.log(`Gas-Price : ${gasPrice}`);
      console.log(`Gas-Price (ETH) : ${gasPriceEth}`);
      console.log(`Gas-Limit : ${gasLimit}`);
      console.log('======================');

      return res.status(200).json({ estimatedFee: `${gasPriceEth * gasLimit}` });
    } catch (e) {
      console.log('[TRANSACTIONS-CONTROLLER-ERROR] calculateTransactionFee => estimateGas', e?.message || e);
      if (e?.message.indexOf('gas required exceeds allowance') !== -1) {
        return res.status(400).json({ error: true, message: 'Insufficient balance' });
      }
      // TODO: Maybe parse error and return something meaningfully
      return res.status(400).json({ error: true, message: 'Error' });
    }
  },
  createTransaction: async (req, res) => {
    try {
      const {
        gasLimit, gasPrice, nynConst,
      } = constants;
      const {
        tokenType, from, to, value,
      } = req.body;
      console.log('--------------------------');
      console.log('createTransaction');
      console.log(req.body);
      console.log('--------------------------');

      const reqBody = {
        query: {
          address: from,
        },
      };
      const tarnsactionFee = gasLimit * gasPrice;
      let balanceRes = null;

      if (tokenType === 'ETH') {
        try {
          balanceRes = await getETH(reqBody);
        } catch (e) {
          console.log('[TRANSACTIONS-CONTROLLER-ERROR] createTransaction => getETH', e?.message || e);
          // TODO: Maybe parse error and return something meaningfully
          return res.status(400).json({ error: true, message: 'Error' });
        }

        const valueToWei = web3.utils.toWei(value.toString(), 'ether');
        const requestValue = parseFloat(valueToWei) + parseFloat(tarnsactionFee);

        console.log('RequestValue : ');
        console.log(requestValue);
        console.log('');
        console.log('valueToWei:');
        console.log(valueToWei);
        console.log('');
        console.log('tarnsactionFee');
        console.log(tarnsactionFee);
        console.log('');
        console.log('Balence ');
        console.log(balanceRes.result);
        console.log('');
        console.log(parseFloat(requestValue) > parseFloat(balanceRes.result));

        if (parseFloat(requestValue) > parseFloat(balanceRes.result)) {
          return res.status(400).json({ error: true, message: 'Insufficient balance' });
        }
        let nonce;
        try {
          nonce = await web3.eth.getTransactionCount(from, 'pending');
        } catch (e) {
          console.log('[TRANSACTIONS-CONTROLLER-ERROR] createTransaction => getTransactionCount', e?.message || e);
          // TODO: Maybe parse error and return something meaningfully
          return res.status(400).json({ error: true, message: 'Error' });
        }

        const transaction = {
          from,
          to,
          value: web3.utils.toHex(valueToWei),
          gasLimit: web3.utils.toHex(gasLimit),
          gasPrice: web3.utils.toHex(gasPrice),
          nonce: web3.utils.toHex(nonce),
        };

        return res.status(200).json(transaction);
      }

      if (tokenType === 'NYN') {
        const abiArray = getAbiArray();
        let ethBalanceRes;
        try {
          balanceRes = await getNYN(reqBody);
        } catch (e) {
          console.log('[TRANSACTIONS-CONTROLLER-ERROR] createTransaction => getNYN', e?.message || e);
          // TODO: Maybe parse error and return something meaningfully
          return res.status(400).json({ error: true, message: 'Error' });
        }

        try {
          ethBalanceRes = await getETH(reqBody);
        } catch (e) {
          console.log('[TRANSACTIONS-CONTROLLER-ERROR] createTransaction => getETH', e?.message || e);
          // TODO: Maybe parse error and return something meaningfully
          return res.status(400).json({ error: true, message: 'Error' });
        }

        const amount = parseInt(value, 10) * 1e18;

        console.log('tarnsactionFee');
        console.log(tarnsactionFee);
        console.log(`ETH Balance : ${parseFloat(ethBalanceRes.result)}`);
        console.log(`Amt : ${amount}`);
        console.log(`NYN Balance : ${parseFloat(balanceRes.result)}`);

        if (amount > parseFloat(balanceRes.result) || parseFloat(tarnsactionFee) > parseFloat(ethBalanceRes.result)) {
          return res.status(400).json({ error: true, message: 'Insufficient balance' });
        }
        const amountHex = web3.utils.toHex(amount);
        const contract = new web3.eth.Contract(abiArray, nynConst.contractAddress, { from });
        const encodedABI = contract.methods.transfer(to, amountHex).encodeABI();
        let nonce;
        try {
          nonce = await web3.eth.getTransactionCount(from, 'pending');
        } catch (e) {
          console.log('[TRANSACTIONS-CONTROLLER-ERROR] createTransaction => getTransactionCount', e?.message || e);
          // TODO: Maybe parse error and return something meaningfully
          return res.status(400).json({ error: true, message: 'Error' });
        }

        const transaction = {
          from,
          to: nynConst.contractAddress,
          value: '0x0',
          gasLimit: web3.utils.toHex(gasLimit),
          gasPrice: web3.utils.toHex(gasPrice),
          data: encodedABI,
          nonce: web3.utils.toHex(nonce),
        };

        return res.status(200).json(transaction);
      }

      return res.status(400).json({ error: true, message: 'Unsupported token' });
    } catch (e) {
      console.log('[TRANSACTIONS-CONTROLLER-ERROR] createTransaction', e?.message || e);
      // TODO: Maybe parse error and return something meaningfully
      return res.status(400).json({ error: true, message: 'Error' });
    }
  },
  getTransactionHistory: async (req, res) => {
    try {
      const { address, page, offset } = req.body;
      console.log('----------------------');
      console.log('Get Transaction History');
      console.log(`Address : ${address}`);
      console.log(`Page : ${page}`);
      console.log(`Offset : ${offset}`);
      console.log('----------------------');

      const { ETHERSCAN_URL, ETHERSCAN_APIKEY } = process.env;
      const params = {
        module: 'account',
        action: 'txlist',
        sort: 'desc',
        address,
        page,
        offset,
        startblock: 0,
        endblock: 'latest',
        apikey: ETHERSCAN_APIKEY,
      };

      const options = getRequestWithParams(params);
      const apiRes = await callApi(ETHERSCAN_URL, options);

      return res.status(200).json(apiRes.data);
    } catch (e) {
      console.log('[TRANSACTIONS-CONTROLLER-ERROR] getTransactionHistory', e?.message || e);
      // TODO: Maybe parse error and return something meaningfully
      return res.status(400).json({ error: true, message: 'Error' });
    }
  },
  getERC20TokenTransactionHistory: async (req, res) => {
    try {
      const { address, page, offset } = req.body;
      const { ETHERSCAN_URL, ETHERSCAN_APIKEY } = process.env;

      console.log('----------------------');
      console.log('Get ERC20 Token Transaction History');
      console.log(`Address : ${address}`);
      console.log(`Page : ${page}`);
      console.log(`Offset : ${offset}`);
      console.log('----------------------');

      const params = {
        module: 'account',
        action: 'tokentx',
        sort: 'desc',
        address,
        page,
        offset,
        startblock: 0,
        endblock: 'latest',
        apikey: ETHERSCAN_APIKEY,
      };

      const options = getRequestWithParams(params);
      const apiRes = await callApi(ETHERSCAN_URL, options);

      return res.status(200).json(apiRes.data);
    } catch (e) {
      console.log('[TRANSACTIONS-CONTROLLER-ERROR] getERC20TokenTransactionHistory', e?.message || e);
      // TODO: Maybe parse error and return something meaningfully
      return res.status(400).json({ error: true, message: 'Error' });
    }
  },
};
