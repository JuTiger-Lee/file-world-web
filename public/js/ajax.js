'use strict';

/**
 *
 * @param {String} url
 * @param {String} method
 * @param {Array || Object} params
 * @returns
 */
async function reqAjax(url, method, params) {
  const screen = document.querySelector('.screen');
  const bearerToken = `bearer ${localStorage.getItem('token')}`;

  // token send
  const config = {
    headers: {
      Authorization: bearerToken,
    },
  };

  let getReqResults = {};

  try {
    screen.style.display = 'block';

    if (method === 'post' || method === 'put') {
      getReqResults = await axios[method](url, params, config);
    } else {
      getReqResults = await axios[method](url);
    }

    return getReqResults.data;
  } catch (err) {
    console.log('ajax Error: ', err);
    // logout
    if (err.response.status === 401) {
      localStorage.removeItem('user');
      alert('로그아웃되었습니다.');
      window.location.href = '/';
    } else if (err.response.status === 500) {
      alert('서버 오류');
    }
  } finally {
    screen.style.display = 'none';
  }
}
