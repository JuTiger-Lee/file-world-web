'use strict';

/**
 *
 * @param {String} url
 * @param {String} method
 * @param {Array || Object} params
 * @returns
 */
async function reqAjax(url, method, params) {
  try {
    let getReqResults = [];

    if (method === 'post' || method === 'put') {
      getReqResults = axios[method](url, params);
    } else {
      getReqResults = axios[method](url);
    }

    return getReqResults;
  } catch (err) {
    return {
      status: 444,
      message: 'ajax Error',
      err: err,
      data: [],
    };
  }
}
