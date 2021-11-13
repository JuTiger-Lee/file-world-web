const successNotifi = {
  state: 'success',
  SIGN_IN_SUCCESS: {
    title: 'SIGN IN SUCCESS',
    message: 'sign in success',
  },
  SIGN_UP_SUCCESS: {
    title: 'SIGN_UP_SUCCESS',
    message: 'sign up success',
  },
};

const dangerNotifi = {};

const warningNotifi = {};

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

  setTimeout(() => {
    $('.alert')
      .fadeTo(500, 0)
      .slideUp(500, function () {
        $(this).remove();
      });
  }, 3000);
}
