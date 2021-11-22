// TODO: 가독성 올릴 필요있음 및 uri query string ajax 구현필요
function pagingEvent(totalPage, currentPage) {
  const nextPaging = document.querySelector('.next-paging');
  const prevPaging = document.querySelector('.prev-paging');
  const numberPaging = document.querySelectorAll('.number-paging');

  $(document.body).on('click', 'a', function (e) {
    const $this = $(this);
    const href = $this.attr('href');

    window.location.hash = href;
    e.preventDefault();
  });

  for (let i = 0; i < numberPaging.length; i++) {
    numberPaging[i].addEventListener('click', e => {
      const clickPaging =
        numberPaging[i].childNodes[0].getAttribute('data-number');

      test(clickPaging);
    });
  }

  if (nextPaging) {
    nextPaging.childNodes[0].addEventListener('click', () => {
      test(currentPage + 1);
    });

    nextPaging.childNodes[1].addEventListener('click', () => {
      test(totalPage);
    });
  }

  if (prevPaging) {
    prevPaging.childNodes[0].addEventListener('click', () => {
      test(1);
    });

    prevPaging.childNodes[1].addEventListener('click', () => {
      test(currentPage - 1);
    });
  }

  function test(currentPage) {
    const cateogry = document.querySelector(
      '.forum-list-search-box .search-category',
    ).value;

    const pageSize = document.querySelector(
      '.forum-list-search-box .search-pageSize',
    ).value;

    const title = document.querySelector(
      '.forum-list-search-box .search-title',
    ).value;

    const queryString =
      `currentPage=${currentPage}&category=${cateogry}` +
      `&pageSize=${pageSize}&title_search=${title}`;

    reqForumList(queryString);
  }
}

function makePagination({ totalPage, currentPage, startIndex, endIndex }) {
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
          class="page-link" 
          data-number="${i + 1}"
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

  return pagingEvent(totalPage, numCurrentPage);
}
