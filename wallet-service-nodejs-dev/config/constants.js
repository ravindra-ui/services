const constants = {
  ethConst: {
    module: 'account',
    action: 'balance',
    tag: 'latest',
  },
  nynConst: {
    action: 'tokenbalance',
    contractAddress: process.env.NYNJA_CONTRACT_ADDRESS,
  },
  gasLimit: 400000,
  gasPrice: 41000000000,
  alertMsg: {
    insufficientBal: 'insufficient balance',
  },
};

module.exports = Object.freeze(constants);
