'use strict';

/**
 *
 * @param {Function} reqListCallback
 */
function pagingEvent(reqListCallback) {
  const nextPaging = document.querySelector('.next-paging');
  const prevPaging = document.querySelector('.prev-paging');
  const numberPaging = document.querySelectorAll('.number-paging');

  /**
   *
   * @param {Number} currentPage
   * @returns
   */
  const reqListController = currentPage => {
    const parsingQuery = location.search.split('&');
    let reqQuery = `currentPage=${currentPage}`;

    for (let i = 0; i < parsingQuery.length; i++) {
      if (parsingQuery[i].split('=').includes('?currentPage')) {
        parsingQuery[i] = reqQuery;
      }
    }

    if (location.search) {
      const joinQuery = parsingQuery.join('&');
      const pathCombineQuery = `${location.pathname}?${joinQuery}`;
      reqQuery = joinQuery;

      history.replaceState({}, null, pathCombineQuery);
    } else {
      history.pushState(null, null, `?${reqQuery}`);
    }

    return reqListCallback(reqQuery);
  };

  /**
   *
   * @param {Array} clickPagings
   * @param {Boolean} childeYn
   */
  const pagingClickHanlder = (clickPagings, childeYn = false) => {
    for (let i = 0; i < clickPagings.length; i++) {
      clickPagings[i].addEventListener('click', e => {
        e.preventDefault();

        let clickPaging = clickPagings[i].getAttribute('data-number');

        if (childeYn) {
          clickPaging =
            clickPagings[i].childNodes[0].getAttribute('data-number');
        }

        return reqListController(clickPaging);
      });
    }
  };

  if (nextPaging) pagingClickHanlder(nextPaging.childNodes, false);
  if (prevPaging) pagingClickHanlder(prevPaging.childNodes, false);

  return pagingClickHanlder(numberPaging, true);
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
  const pagination = document.getElementById('pagination');
  let numCurrentPage = Number(currentPage);
  let pagingTemplate = '';

  if (numCurrentPage <= 1) {
    pagingTemplate += '<li class="page-item"></li>';
  } else {
    pagingTemplate +=
      '<li class="page-item prev-paging" style="display: flex">' +
      `<a 
        class="page-link"
        href="?currentPage=${1}"
        data-number="${1}" 
      >` +
      '<i class="fas fa-angle-double-left"></i>' +
      '</a>' +
      `<a 
        class="page-link"
        href="?currentPage=${numCurrentPage - 1}"
        data-number="${numCurrentPage - 1}" 
      >` +
      '<i class="fas fa-angle-left"></i>' +
      '</span>' +
      '</li>';
  }

  for (let i = startIndex - 1; i < endIndex; i++) {
    pagingTemplate +=
      `<li class="page-item number-paging ${
        numCurrentPage === i + 1 ? 'active' : ''
      }" style="cursor: pointer">` +
      `<a 
          class="page-link" 
          href="?currentPage=${i + 1}"
          data-number="${i + 1}"
        >
          ${i + 1}
        </a>` +
      '</li>';
  }

  if (totalPage <= numCurrentPage) {
    pagingTemplate += '<li class="page-item"></li>';
  } else {
    pagingTemplate +=
      '<li class="page-item next-paging" style="display: flex">' +
      `<a 
          class="page-link" 
          href="?currentPage=${numCurrentPage + 1}"
          data-number="${numCurrentPage + 1}"
        >` +
      '<i class="fas fa-angle-right"></i>' +
      '</a>' +
      `<a 
          class="page-link" 
          href="?currentPage=${totalPage}"
          data-number="${totalPage}"
        >` +
      '<i class="fas fa-angle-double-right"></i>' +
      '</a>' +
      '</li>';
  }

  if (!totalPage) {
    pagination.innerHTML = pagingTemplate;

    pagingEvent(reqListCallback);
  } else {
    pagination.innerHTML = '';
  }
}
