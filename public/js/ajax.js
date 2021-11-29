'use strict';

/**
 *
 * @param {String} url
 * @param {String} method
 * @param {Array || Object} params
 * @returns
 */
async function reqAjax(url, method, params, option) {
  const screen = document.querySelector('.screen');
  const token = localStorage.getItem('token');
  const bearerToken = `bearer ${token}`;

  const config = {
    headers: {},
  };

  if (option) config.headers = option;
  if (bearerToken) config.headers.Authorization = bearerToken;

  try {
    let getReqResults = {};

    screen.style.display = 'block';

    if (method === 'post' || method === 'put') {
      getReqResults = await axios[method](url, params, config);
    } else {
      getReqResults = await axios[method](url, config);
    }

    return getReqResults.data;
  } catch (err) {
    if (err.response.status === 401) {
      alert('Please signin first.');

      window.location.href = '/user/sign-in';
    }

    if (err.response.status === 419) {
      localStorage.removeItem('token');
      alert('log out.');

      window.location.href = '/';
    }

    if (err.response.status === 500) {
      alert('SERVER ERROR');
    }

    return err.response.data;
  } finally {
    screen.style.display = 'none';
  }
}
