'use strict';

const forumListSearchBtn = document.querySelector('.forum-list-search-btn');

/**
 * profile에서도 똑같은 템플릿을 쓰기 때문에
 * 핸들러를 만들어서 가독성을 높일 필요가 있음
 * @param {Number} idx
 * @param {String} profile
 * @param {String} nickanme
 * @param {String} title
 * @param {String} category
 * @param {String} post_status
 * @param {Number} like_count
 * @param {Date} date
 * @returns
 */
function makeForumListTemplate(
  idx,
  nickanme,
  title,
  category,
  post_status,
  like_count,
  like_status,
  date,
) {
  return `<div class="card">
                <div class="card-body">
                    <div class="forum-user-profile-box">
                        <div class="forum-profile forum-user-profile">
                            <img src="/static/images/profile/blank_profile.png" alt="user profile">
                        </div>
                        <!--
                        <div class="forum-profile-name">
                            <p>${nickanme}</p>
                        </div>
                        --!>
                    </div>
                    <div class="forum-post-info-box">
                        <div class="forum-list-card-header-box">
                            <div class="forum-category">${category}</div>
                            <div class="forum-title-box">
                                <a href="/forum/detail/${idx}" data-number=${idx} class="card-title forum-list-title">${title}</a>
                            </div>
                        </div>
                        <div class="forum-info-box">
                            <div class="forum-comment-box">
                                <span style="color: #12a7e4;">
                                    <i class="fas fa-comment"></i>
                                    0 Answers
                                </span>
                            </div>
                            <div class="fourm-view-box">
                                <span style="color: #2b8d6e;">
                                    <i class="fas fa-eye"></i> 
                                    0 Views
                                </span>
                            </div>
                            <div class="fourm-like-box">
                                <span style="color: #ed635e;">
                                  ${(function () {
                                    let likeType =
                                      '<i class="far fa-heart like" style="cursor: pointer"></i>';

                                    if (like_status === 'true') {
                                      likeType =
                                        '<i class="fas fa-heart un-like" style="cursor: pointer"></i>';
                                    }

                                    return likeType;
                                  })()}
                                    ${like_count} Like
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="forum-menu-box">
                      <div class="dropdown show">
                        <i class="fas fa-ellipsis-h" data-toggle="dropdown"></i>
                          <div class="dropdown-menu dropdown-menu-right">
                        ${(function () {
                          let dropdownType =
                            '<a class="dropdown-item" href="#">' +
                            '<span>Report</span>' +
                            '</a>' +
                            '<a class="dropdown-item" href="#">' +
                            '<span>Book Mark</span>' +
                            '</a>';

                          if (post_status === 'true') {
                            dropdownType =
                              '<a class="dropdown-item" href="#">' +
                              '<span>Delete</span>' +
                              '</a>';
                          }

                          return dropdownType;
                        })()}
                        </div>
                      </div>
                    </div>
                </div>
                <div class="card-footer">
                     <p class="card-text forum-date">${date}</p>
                </div>
            </div>`;
}

function likeEvent() {
  const like = document.querySelectorAll('.fourm-like-box > span > i');

  /**
   *
   * @param {Number} index
   * @param {String} likeType
   */
  const reqLikeController = async (index, likeType) => {
    if (likeType !== 'like' && likeType !== 'un-like') {
      throw new Error('A non-existent Like type.');
    }

    const forunmIdx = document.querySelectorAll('.forum-title-box > a');
    const fi_idx = forunmIdx[index].getAttribute('data-number');
    const linkData = likeType === 'like' ? '' : `?unLikeIdx=${fi_idx}`;
    const linkEndPoint = `${likeType}${linkData}`;
    const likeURI = `/api/forum/${linkEndPoint}`;
    const method = likeType === 'like' ? 'post' : 'delete';
    const bodyData = {
      fi_idx,
    };

    const reqResult = await reqAjax(likeURI, method, bodyData);

    if (reqResult.code === 200) {
      reqForumList(location.search.split('?')[1], window.scrollY);
    }
  };

  for (let i = 0; i < like.length; i++) {
    const likeType = like[i].classList[like[i].classList.length - 1];

    like[i].addEventListener('click', () => reqLikeController(i, likeType));
  }
}

/**
 *
 * @param {Object} reqResult
 * @returns
 */
function reqDataCheck(reqResult, scrollHeight) {
  const initPaginationData = {
    totalPage: 0,
    currentPage: 1,
    startIndex: 1,
    endIndex: 0,
  };

  const forumListCardBox = document.querySelector('.forum-list-card-box');
  forumListCardBox.innerHTML = '';

  const loadProfile = (profilePath, i) => {
    const forumProfile = document.querySelectorAll('.forum-user-profile > img');

    // forumProfile[j].onload = () => {};

    forumProfile[i].onerror = () => {
      forumProfile[i].src = '/static/images/profile/blank_profile.png';
    };

    forumProfile[i].src = profilePath;
  };

  if (reqResult.code === 200) {
    const { pagination } = reqResult.data[0];

    for (let i = 0; i < pagination.list.length; i++) {
      forumListCardBox.innerHTML += makeForumListTemplate(
        pagination.list[i].fi_idx,
        pagination.list[i].ui_nickname,
        pagination.list[i].fi_title,
        pagination.list[i].fi_category,
        pagination.list[i].post_status,
        pagination.list[i].like_count,
        pagination.list[i].like_status,
        pagination.list[i].update_datetime,
      );

      likeEvent();
      loadProfile(pagination.list[i].ui_profile_hash, i);
    }

    makePagination(pagination, reqForumList);
  } else {
    forumListCardBox.innerHTML = ``;

    makePagination(initPaginationData);
  }

  return window.scrollTo(0, scrollHeight);
}

/**
 *
 * @param {String} queryString
 * @returns
 */
async function reqForumList(queryString, scrollHeight = 0) {
  const reqResult = await reqAjax(`/api/forum/list?${queryString}`, 'get');

  return reqDataCheck(reqResult, scrollHeight);
}

function reqSearch() {
  const category = document.querySelector(
    '.forum-list-search-box .search-category',
  ).value;

  const pageSize = document.querySelector(
    '.forum-list-search-box .search-pageSize',
  ).value;

  const titleSearch = document.querySelector(
    '.forum-list-search-box .search-title',
  ).value;

  let queryString = `currentPage=1&pageSize=${pageSize}`;

  if (category.toUpperCase() !== 'ALL' && category.trim()) {
    queryString += `&category=${category}`;
  }

  if (titleSearch && titleSearch.trim()) {
    queryString += `&title=${titleSearch}`;
  }

  history.pushState(null, null, `?${queryString}`);

  return reqForumList(queryString);
}

function init() {
  const queryString = window.location.search.substr(1).split('&');
  let reqQueryString = 'currentPage=1';

  for (let i = 0; i < queryString.length; i++) {
    const parsingQueryStrings = queryString[i].split('=');

    const searchInput = document.querySelector(
      `.forum-list-search-box .search-${parsingQueryStrings[0]}`,
    );

    if (searchInput) {
      searchInput.value = parsingQueryStrings[1];
    }
  }

  if (queryString[0] !== '') {
    reqQueryString = queryString.join('&');
  }

  return reqForumList(reqQueryString);
}

forumListSearchBtn.addEventListener('click', () => reqSearch());

init();
