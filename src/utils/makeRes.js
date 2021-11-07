/**
 *
 * @param {Object} err
 * @param {Array} data
 * @param {Number} status
 * @param {String} message
 * @returns
 */
function makeRespone(err = {}, data = [], status, message) {
  return {
    status,
    message,
    err,
    data,
  };
}

/**
 *
 * @param {Object} err
 * @param {Array} data
 * @param {Number} status
 * @param {String} message
 * @returns
 */
function MakeErrorRespone(err = {}, data = [], status, message) {
  const error = new Error();

  error.status = status;
  error.message = message;
  error.err = err;
  error.data = data;

  return error;
}

module.exports = {
  makeRespone,
  MakeErrorRespone,
};
