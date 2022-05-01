const { getETH, getNYN } = require('../utils/rest');

module.exports = {
  getBalance: async (req, res) => {
    try {
      const apiRes = {};
      const { tokenType } = req.query;

      console.log('Get balance');
      console.log('TokenType: ', tokenType);

      if (tokenType === 'ETH') {
        apiRes.ETH = await getETH(req);
      } else if (tokenType === 'NYN') {
        apiRes.NYN = await getNYN(req);
      } else {
        apiRes.ETH = await getETH(req);
        apiRes.NYN = await getNYN(req);
      }
      return res.status(200).json(apiRes);
    } catch (e) {
      console.log('[BALANCE-CONTROLLER-ERROR] getBalance', e?.message || e);
      // TODO: Maybe parse error and return something meaningfully
      return res.status(400).json({ error: true, message: 'Error' });
    }
  },
};
