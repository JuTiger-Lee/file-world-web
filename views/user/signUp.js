'use strict';

const signupBtn = document.querySelector('.signup-btn');

function signupValueCheck() {
  const userEmail = document.querySelector('.user-email').value;
  const userNickname = document.querySelector('.user-nickname').value;
  const userID = document.querySelector('.user-id').value;
  const userPassword = document.querySelector('.user-password').value;
  const userVerifyPassword = document.querySelector(
    '.user-verify-password',
  ).value;

  // email regular expression
  const emailRegExp =
    /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

  if (!userEmail.trim() || !userEmail) {
    return notification(
      'warning',
      'Enter required values',
      'Please enter your Email.',
    );
  }

  if (!userEmail.match(emailRegExp)) {
    return notification(
      'warning',
      'Enter required values',
      'Email format is incorrect.',
    );
  }

  if (!userNickname.trim() || !userNickname) {
    return notification(
      'warning',
      'Enter required values',
      'Please enter your Nickname',
    );
  }

  if (!userID.trim() || !userID) {
    return notification(
      'warning',
      'Enter required values',
      'Please enter your ID',
    );
  }

  if (!userPassword.trim() || !userPassword) {
    return notification(
      'warning',
      'Enter required values',
      'Please enter your Password',
    );
  }

  if (!userVerifyPassword.trim() || !userVerifyPassword) {
    return notification(
      'warning',
      'Enter required values',
      'Please enter your Confirm password',
    );
  }

  if (userVerifyPassword !== userPassword) {
    return notification(
      'warning',
      'Enter required values',
      'Passwords do not match.',
    );
  }

  return {
    userEmail,
    userNickname,
    userID,
    userPassword,
  };
}

function reqDataCheck(reqResult) {
  if (reqResult.code === 200) {
    window.location.href = '/user/sign-in';
    return notification('warning', 'SIGNUP SUCCESS', 'signup success');
  } else {
    return notification('warning', 'SIGNUP FAIL', 'signup fail');
  }
}

async function reqSignup() {
  const { userEmail, userNickname, userID, userPassword } = signupValueCheck();

  const bodyData = {
    ui_email: userEmail,
    ui_nickname: userNickname,
    ui_id: userID,
    ui_password: userPassword,
  };

  const reqResult = await reqAjax('/api/user/sign-up', 'post', bodyData);

  return reqDataCheck(reqResult);
}

signupBtn.addEventListener('click', () => reqSignup());
