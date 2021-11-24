'use strict';

const loginLocalBtn = document.querySelector('.user-local-btn');
const loginGoogleBtn = document.querySelector('.user-google-btn');
const loginFacebookBtn = document.querySelector('.user-facebook-btn');

function loginValueCheck(userEmail, userPassword) {
  if (!userEmail.trim() || !userEmail) {
    return notification(
      'warning',
      'Enter required values',
      'Please enter your ID.',
    );
  }

  if (!userPassword.trim() || !userPassword) {
    return notification(
      'warning',
      'Enter required values',
      'Please enter your Password.',
    );
  }

  return true;
}

function reqDataCheck(reqResult) {
  if (reqResult.code === 200) {
    // 토큰 저장
    localStorage.setItem('token', reqResult.data[0].token);

    window.location.href = '/';
    return notification('success', 'LOGIN SUCCESS', 'login success');
  } else {
    return notification('warning', 'LOGIN FAIL', 'login fail');
  }
}

async function reqSignIn() {
  const userEmail = document.querySelector('.user-email').value;
  const userPassword = document.querySelector('.user-password').value;

  const loginValueResult = loginValueCheck(userEmail, userPassword);

  if (loginValueResult) {
    const bodyData = {
      ui_email: userEmail,
      ui_password: userPassword,
    };

    const reqResult = await reqAjax('/api/user/sign-in', 'post', bodyData);

    return reqDataCheck(reqResult);
  }
}

loginLocalBtn.addEventListener('click', () => reqSignIn());
