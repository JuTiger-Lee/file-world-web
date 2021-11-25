'use strict';

const forumListSearchBtn = document.querySelector('.forum-list-search-btn');

function makeForumListTemplate(idx, profile, nickanme, title, category, date) {
  return `<div class="card">
                <div class="card-body">
                    <div class="forum-user-profile-box">
                        <div class="forum-profile">
                            <img src="${profile}" alt="">
                        </div>
                        <div class="forum-profile-name">
                            <p>${nickanme}</p>
                        </div>
                    </div>
                    <div class="forum-post-info-box">
                        <div class="forum-list-card-header-box">
                            <div class="forum-category">${category}</div>
                            <div class="forum-title-box">
                                <a href="/forum/detail/${idx}" class="card-title forum-list-title">${title}</a>
                            </div>
                        </div>
                        <div class="forum-info-box">
                            <div class="forum-comment-box">
                                <span style="color: #12a7e4;">
                                    <i class="fas fa-comment"></i>
                                    50 Answers
                                </span>
                            </div>
                            <div class="fourm-view-box">
                                <span style="color: #2b8d6e;">
                                    <i class="fas fa-eye"></i> 
                                    50 Views
                                </span>
                            </div>
                            <div class="fourm-like-box">
                                <span style="color: #ed635e;">
                                    <i class="far fa-heart"></i> 
                                    10 Like
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-footer">
                     <p class="card-text forum-date">${date}</p>
                </div>
            </div>`;
}

function reqDataCheck(reqResult) {
  const forumListCardBox = document.querySelector('.forum-list-card-box');
  let template = '';

  if (reqResult.code === 200 && reqResult.data[0].pagination.list.length) {
    const { pagination } = reqResult.data[0];

    for (let i = 0; i < pagination.list.length; i++) {
      template += makeForumListTemplate(
        pagination.list[i].fi_idx,
        pagination.list[i].ui_profile_hash,
        pagination.list[i].ui_nickname,
        pagination.list[i].fi_title,
        pagination.list[i].fi_category,
        pagination.list[i].update_datetime,
      );
    }

    if (pagination.totalPage > 0) {
      makePagination(pagination, reqForumList);
    }

    forumListCardBox.innerHTML = template;
  } else {
    alert('SORRY');
  }

  return window.scrollTo(0, 0);
}

async function reqForumList(queryString) {
  const reqResult = await reqAjax(`/api/forum/list?${queryString}`, 'get');

  return reqDataCheck(reqResult);
}

function reqSearch() {
  const cateogry = document.querySelector(
    '.forum-list-search-box .search-category',
  ).value;

  const pageSize = document.querySelector(
    '.forum-list-search-box .search-pageSize',
  ).value;

  const title = document.querySelector(
    '.forum-list-search-box .search-title',
  ).value;

  let queryString =
    `currentPage=1` + `&category=${cateogry}` + `&pageSize=${pageSize}`;

  if (title) queryString += `&titleSearch=${title}`;

  history.pushState(null, null, `?${queryString}`);

  return reqForumList(queryString);
}

function init() {
  const queryString = window.location.search.substr(1).split('&');
  let reqQueryString = '';

  if (queryString[0] !== '') {
    reqQueryString = queryString.join('&');
  } else {
    reqQueryString = 'currentPage=1';
  }

  return reqForumList(reqQueryString);
}

forumListSearchBtn.addEventListener('click', () => reqSearch());

init();
