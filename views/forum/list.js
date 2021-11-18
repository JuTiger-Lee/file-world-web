'use strict';

function makeForumListTemplate(idx, title, category) {
  return `<div class="card">
                <div class="card-body">
                    <div class="forum-user-profile-box">
                        <div class="forum-profile">
                            <img src="../static/images/146675.jpg" alt="">
                        </div>
                        <div class="forum-profile-name">
                            <p>crow</p>
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
                     <p class="card-text forum-date">2021-09-28</p>
                </div>
            </div>`;
}

function makePaginationTemplate(pagingeNumbers) {
  return `<nav class="mt-3">
                <ul class="pagination justify-content-center">
                    <li class="page-item disabled" style="display: flex">
                        <a class="page-link" href="/forum/list?currentPage=1"><i class="fas fa-angle-double-left"></i></a>
                        <a class="page-link" href="#" tabindex="-1"><i class="fas fa-angle-left"></i></a>
                    </li>
                    ${(function () {
                      let pagingNumberTemplate = '';

                      for (let i = 0; i < pagingeNumbers; i++) {
                        pagingNumberTemplate += `<li class="page-item">
                                            <a class="page-link" href="/forum/list?currentPage=${
                                              i + 1
                                            }">${i + 1}</a>
                                        </li>`;
                      }

                      return pagingNumberTemplate;
                    })()}
                    <li class="page-item" style="display: flex">
                        <a class="page-link" href="#"><i class="fas fa-angle-right"></i></a>
                        <a class="page-link" href="/forum/list?currentPage=${pagingeNumbers}"><i class="fas fa-angle-double-right"></i></a>
                    </li>
                </ul>
            </nav>`;
}

function reqDataCheck(reqResult) {
  const forumListCardBox = document.querySelector('.forum-list-card-box');
  let template = '';

  if (reqResult.code === 200 && reqResult.data.list.length) {
    for (let i = 0; i < reqResult.data.list.length; i++) {
      template += makeForumListTemplate(
        reqResult.data.list[i].fi_idx,
        reqResult.data.list[i].fi_title,
        reqResult.data.list[i].fi_category,
      );
    }

    if (reqResult.data.totalPage > 0) {
      template += makePaginationTemplate(reqResult.data.totalPage);
    }

    forumListCardBox.innerHTML = template;
  } else {
    alert('SORRY');
  }
}

async function reqForumList() {
  const reqResult = await reqAjax('/api/forum/list', 'post', {
    pageSize: 10,
    currentPage: 1,
  });

  return reqDataCheck(reqResult);
}

reqForumList();
