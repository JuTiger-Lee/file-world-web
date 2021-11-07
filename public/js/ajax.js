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
    // token send
    const config = {
      headers: {
        Authorization: `bearer ${localStorage.getItem('user')}`,
      },
    };

    let getReqResults = {};

    if (method === 'post' || method === 'put') {
      getReqResults = await axios[method](url, params, config);
    } else {
      getReqResults = await axios[method](url);
    }

    return getReqResults.data;
  } catch (err) {
    return {
      status: 444,
      message: 'ajax Error',
      err: err,
      data: [],
    };
  }
}
