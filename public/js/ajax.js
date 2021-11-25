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
  const bearerToken = `bearer ${localStorage.getItem('token')}`;

  // token send
  const config = {
    headers: {},
  };

  let getReqResults = {};

  if (option) config.headers = option;
  if (bearerToken) config.headers.Authorization = bearerToken;

  try {
    screen.style.display = 'block';

    if (method === 'post' || method === 'put') {
      getReqResults = await axios[method](url, params, config);
    } else {
      getReqResults = await axios[method](url, config);
    }

    return getReqResults.data;
  } catch (err) {
    if (err.response.status === 401 || err.response.status === 419) {
      localStorage.removeItem('token');
      window.location.href = '/';

      return alert('log out.');
    } else if (err.response.status === 500) {
      return alert('SERVER ERROR');
    }

    return err.response.data;
  } finally {
    screen.style.display = 'none';
  }
}
