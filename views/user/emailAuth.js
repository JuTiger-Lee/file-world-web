const emailConfirmBtn = document.querySelector('.email-confirm-btn');

function reqDataCheck(reqResult) {
  if (reqResult.code === 200) {
    alert('인증 완료');

    return (window.location.href = '/user/sign-in');
  } else {
    alert('인증 실패');
  }
}

async function reqEmailCodeCheck() {
  const userConfirmCode = document.querySelector('.user-confirm-code').value;

  const bodyData = {
    ui_confirm_code: userConfirmCode,
  };

  const reqResult = await reqAjax(
    '/api/user/email-code-check',
    'put',
    bodyData,
  );

  return reqDataCheck(reqResult);
}

emailConfirmBtn.addEventListener('click', () => reqEmailCodeCheck());
