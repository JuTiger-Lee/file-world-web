class MakeResponse {
  constructor() {}

  /**
   * http status
   * @param {Number} httpStatus
   * err code
   * @param {Number} code
   * custom status
   * @param {Number} status
   * @param {String} message
   */
  init(httpStatus, code, message) {
    this.httpStatus = httpStatus;
    this.code = code;
    this.message = message;
  }

  /**
   *
   * @param {Array<Object> || Object} data
   * @returns
   */
  makeSuccessResponse(data = []) {
    return {
      code: this.code,
      message: this.message,
      data,
    };
  }

  /**
   * @param {Object} err
   * @param {String} name
   * @returns
   */
  makeErrorResponse(err = {}, name = 'Syntax Error') {
    const error = new Error();

    error.httpStatus = this.httpStatus;
    error.code = this.code;
    error.message = this.message;
    error.name = name;
    error.err = err;

    return error;
  }
}

module.exports = MakeResponse;
