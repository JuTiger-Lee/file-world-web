'use strict';

const loginGoogleBtn = document.querySelector('.user-google-btn');
const loginFacebookBtn = document.querySelector('.user-facebook-btn');
const signInSubmit = document.getElementById('signin-submit');

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
}

function reqDataCheck(reqResult) {
  if (reqResult.code === 200) {
    // 토큰 저장
    localStorage.setItem('token', reqResult.data[0].token);

    window.location.href = '/';

    return alert('login succcess');
  } else {
    return alert('login fail');
  }
}

async function reqSignIn() {
  const userEmail = document.querySelector('.user-email').value;
  const userPassword = document.querySelector('.user-password').value;

  const bodyData = {
    ui_email: userEmail,
    ui_password: userPassword,
  };

  const reqResult = await reqAjax('/api/user/sign-in', 'post', bodyData);

  return reqDataCheck(reqResult);
}

signInSubmit.addEventListener('submit', e => {
  e.preventDefault();

  return reqSignIn();
});
