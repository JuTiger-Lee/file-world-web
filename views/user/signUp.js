'use strict';

const signUpSubmit = document.getElementById('signup-submit');

function signupValueCheck() {
  const userEmail = document.querySelector('.user-email').value;
  const userNickname = document.querySelector('.user-nickname').value;
  const userPassword = document.querySelector('.user-password').value;
  const userVerifyPassword = document.querySelector(
    '.user-verify-password',
  ).value;

  // email regular expression
  // const emailRegExp =
  //   /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

  return {
    userEmail,
    userNickname,
    userPassword,
  };
}

function reqDataCheck(reqResult) {
  if (reqResult.code === 200) {
    window.location.href = '/user/sign-in';
    return alert('signup success');
  } else {
    return notification('signup fail');
  }
}

async function reqSignup() {
  const { userEmail, userNickname, userPassword } = signupValueCheck();

  const bodyData = {
    ui_email: userEmail,
    ui_nickname: userNickname,
    ui_password: userPassword,
  };

  const reqResult = await reqAjax('/api/user/sign-up', 'post', bodyData);

  return reqDataCheck(reqResult);
}

signUpSubmit.addEventListener('submit', e => {
  e.preventDefault();

  return reqSignup();
});
