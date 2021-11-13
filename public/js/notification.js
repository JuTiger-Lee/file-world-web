const successNotifi = {
  state: 'success',
  SIGN_IN_SUCCESS: {
    title: 'SIGN IN SUCCESS',
    message: '로그인을 성공 하셨습니다.',
  },
  SIGN_UP_SUCCESS: {
    title: 'SIGN_UP_SUCCESS',
    message: '회원가입을 성공 하셨습니다.',
  },
};

function notification(state = 'primary', title, message) {
  const notificationBox = document.querySelector('.notification-box');
  const notificationDiv = document.createElement('div');

  notificationDiv.className = `alert alert-${state} alert-dismissible fade show`;
  notificationDiv.innerHTML = `<h5 class="alert-heading">${title}</h5> <span>${message}</span>`;
  notificationDiv.innerHTML +=
    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
    '<span aria-hidden="true">&times;</span>' +
    '</button>';

  notificationBox.append(notificationDiv);

  // setTimeout(() => {
  //   $('.alert').alert('close');
  // }, 3000);
}

notification(
  successNotifi.state,
  successNotifi.SIGN_IN_SUCCESS.title,
  successNotifi.SIGN_IN_SUCCESS.message,
);
