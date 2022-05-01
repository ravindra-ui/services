const axios = require('axios');
const constants = require('../config/constants');

const getRequestWithParams = (data) => ({ method: 'GET', params: data });
const callApi = (url, options) => {
  try {
    return axios({ url, ...options })
      .then((res) => res)
      .then((jsonData) => jsonData)
      .catch((error) => error);
  } catch (error) {
    console.log(error, 'ERROR_CATCH');
    return error;
  }
};
const getETH = async (req) => {
  const { ETHERSCAN_URL, ETHERSCAN_APIKEY } = process.env;
  const { ethConst } = constants;
  const params = {
    module: ethConst.module,
    action: ethConst.action,
    tag: ethConst.tag,
    apikey: ETHERSCAN_APIKEY,
    address: req.query.address,
  };
  const options = getRequestWithParams(params);
  const apiRes = await callApi(ETHERSCAN_URL, options);
  return apiRes.data;
};
const getNYN = async (req) => {
  const { ETHERSCAN_URL, ETHERSCAN_APIKEY, NYNJA_CONTRACT_ADDRESS } = process.env;
  const { ethConst, nynConst } = constants;
  const params = {
    module: ethConst.module,
    action: nynConst.action,
    tag: ethConst.tag,
    apikey: ETHERSCAN_APIKEY,
    contractaddress: NYNJA_CONTRACT_ADDRESS,
    address: req.query.address,
  };
  const options = getRequestWithParams(params);
  const apiRes = await callApi(ETHERSCAN_URL, options);
  return apiRes.data;
};

module.exports = {
  callApi,
  getNYN,
  getETH,
  getRequestWithParams,
};
