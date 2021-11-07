module.exports = app => {
  // 404 error
  app.use((req, res) => {
    const result = {
      status: 404,
      message: '404 Not Found',
      error: {},
      data: {},
    };

    return res.status(404).json(result);
  });

  app.use((err, req, res, next) => {
    const result = {
      status: err.status || 500,
      message: err.message || '500 server Error',
      error: err.status && err.message ? {} : err,
      data: {},
    };

    res.status(err.status || 500);

    return res.json(result);
  });
};
