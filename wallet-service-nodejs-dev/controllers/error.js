module.exports = {
  error: (req, res) => res.status(404).json({
    message: 'Not Found!',
  }),
};
