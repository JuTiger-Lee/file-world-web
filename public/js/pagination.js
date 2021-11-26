// TODO: 가독성 올릴 필요있음 및 uri query string ajax 구현필요
function pagingEvent(totalPage, currentPage, reqListCallback) {
  const nextPaging = document.querySelector('.next-paging');
  const prevPaging = document.querySelector('.prev-paging');
  const numberPaging = document.querySelectorAll('.number-paging');

  const reqForumListController = currentPage => {
    const queryCurrent = `currentPage=${currentPage}`;

    history.replaceState({}, null, location.pathname);
    history.pushState(null, null, `?${queryCurrent}`);

    return reqListCallback(queryCurrent);
  };

  for (let i = 0; i < numberPaging.length; i++) {
    numberPaging[i].addEventListener('click', e => {
      e.preventDefault();

      const clickPaging =
        numberPaging[i].childNodes[0].getAttribute('data-number');

      reqForumListController(clickPaging);
    });
  }

  if (nextPaging) {
    nextPaging.childNodes[0].addEventListener('click', () => {
      reqForumListController(currentPage + 1);
    });

    nextPaging.childNodes[1].addEventListener('click', () => {
      reqForumListController(totalPage);
    });
  }

  if (prevPaging) {
    prevPaging.childNodes[0].addEventListener('click', () => {
      reqForumListController(1);
    });

    prevPaging.childNodes[1].addEventListener('click', () => {
      reqForumListController(currentPage - 1);
    });
  }
}

/**
 *
 * @param {Object} param0
 * @param {Function} reqListCallback
 * @returns
 */
function makePagination(
  { totalPage, currentPage, startIndex, endIndex },
  reqListCallback,
) {
  const pagination = document.querySelector('#pagination');
  let numCurrentPage = Number(currentPage);
  let pagingTemplate = '';

  if (currentPage <= 1) {
    pagingTemplate += '<li class="page-item"></li>';
  } else {
    pagingTemplate +=
      '<li class="page-item prev-paging" style="display: flex">' +
      '<span class="page-link" style="cursor: pointer"><i class="fas fa-angle-double-left"></i></span>' +
      '<span class="page-link" style="cursor: pointer"><i class="fas fa-angle-left"></i></span>' +
      '</li>';
  }

  for (let i = startIndex - 1; i < endIndex; i++) {
    pagingTemplate +=
      `<li class="page-item number-paging ${
        numCurrentPage === i + 1 ? 'active' : ''
      }" style="cursor: pointer">` +
      `<a 
          href="?current=${i + 1}"
          data-number="${i + 1}"
          class="page-link" 
        >
          ${i + 1}
        </a>` +
      '</li>';
  }

  if (totalPage <= currentPage) {
    pagingTemplate += '<li class="page-item"></li>';
  } else {
    pagingTemplate +=
      '<li class="page-item next-paging" style="display: flex">' +
      '<span class="page-link" style="cursor: pointer"><i class="fas fa-angle-right"></i></span>' +
      '<span class="page-link" style="cursor: pointer"><i class="fas fa-angle-double-right"></i></span>' +
      '</li>';
  }

  pagination.innerHTML = pagingTemplate;

  return pagingEvent(totalPage, numCurrentPage, reqListCallback);
}
