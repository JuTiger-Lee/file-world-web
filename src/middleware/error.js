module.exports = app => {
  // 404 error
  app.use((req, res) => {
    // const result = {
    //   status: 404,
    //   message: '404 Not Found',
    //   error: {},
    //   data: {},
    // };
    // return res.status(404).json(result);

    res.status(404).render('../views/common/notFound');
  });

  app.use((err, req, res, next) => {
    const result = {
      code: err.code || 500,
      message: err.message || '500 server Error',
      error: {},
    };

    if (err.err || err) result.error = err.err || err;
    else result.error = {};

    res.status(err.httpStatus || 500);

    return res.json(result);
  });
};
