const pasingURI = location.pathname.split('/');
const fi_idx = pasingURI[pasingURI.length - 1];

function getDetailTemplate(
  nickname,
  profile,
  fi_view,
  title,
  category,
  contents,
  like_status,
  like_count,
  forum_status,
  commentLength,
  dateTime,
) {
  return `
      <div class="d-flex justify-content-between p-2 px-3">
        <div class="d-flex flex-row align-items-center">
            <div class="forum-user-profile-box">
              <div class="forum-profile forum-user-profile">
                  <img src="${profile}" width="50" alt="user profile">
              </div>
            </div>
            <div class="d-flex flex-column ml-2">
                <span class="font-weight-bold">${nickname}</span>
                <small class="mr-2 ellipsis">${dateTime}</small>
            </div>
        </div>
        <div class="d-flex flex-row mt-1 ellipsis">
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

              if (forum_status === 'true') {
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
      <hr>
      <div class="p-2 px-3">
        <div class="content-tags">
	        <a href="/articles/life" class="list-group-item-text item-tag label label-info forum-category">
           ${category}
          </a>
        </div>
        <h3 class="panel-title">
          ${title}
        </h3>
      </div>
      <hr>
      <div class="p-2 detail-contents-box">
        ${contents}
      </div>
      <div class="p-2">
        <hr>
        <div 
          class="d-flex justify-content-between align-items-center" 
          style="margin-bottom: 15px;margin-top: 15px"
        >
            <div class="d-flex comment-header-box">
              <div class="forum-detail-like-box">
                <span style="color: #ed635e; font-size: 18px; font-weight: bold;">
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

              <div class="forum-view-box ml-3">
                <span style="color: #2b8d6e; font-size: 18px; font-weight: bold;">
                  <i class="fas fa-eye"></i> 
                  ${fi_view} Views
                </span>
              </div>
            </div>
            <div class="d-flex flex-row muted-color">
                <span>${commentLength} comments</span>
                <span class="ml-2">Share</span>
            </div>
        </div>
        <hr>
        <div class="comments">
          <div class="comment-box"></div>
            <div class="comment-input-box">
              <div id="comment-write-input"></div>
              <button 
                class="
                  btn btn-primary 
                  mt-2 
                  forum-comment-save-btn 
                  float-right
                ">
                Save
              </button>
            </div>
        </div>
      </div>`;
}

function getCommentTemplate(comments) {
  return `
    ${(function () {
      let commentTemplate = '';

      for (let i = 0; i < comments.length; i++) {
        const {
          fc_idx,
          ui_profile_hash,
          ui_nickname,
          update_datetime,
          fc_contents,
        } = comments[i];

        commentTemplate += `
          <div class="d-flex flex-row mb-2 comment" id="commment-${fc_idx}">
            <div class="forum-user-profile-box">
              <div class="forum-profile forum-user-profile">
                <img src="${ui_profile_hash}" width="40" class="rounded-image" />
              </div>
            </div>
              <div class="d-flex flex-column ml-2 mb-3">
                  <span class="name">${ui_nickname}</span>
                  <small class="ellipsis">${update_datetime}</small>
      
                  <div class="comment-text mt-2">
                    ${fc_contents}
                  </div>
                  <div class="d-flex flex-row mt-1 mb-3 align-items-center status">
                    <small class="comment-like" style="cursor: pointer">Like</small>
                    <small class="comment-replay" style="cursor: pointer">Reply</small>
                  </div>
                  <div class="child-comment-input"></div>
              </div>
          </div>`;
      }

      return commentTemplate;
    })()}
    <!-- child comment --!>
  </div>`;

  //   <div class="child-comment ml-5">
  //   <div class="d-flex flex-row mb-2">
  //     <div class="forum-user-profile-box">
  //       <div class="forum-profile forum-user-profile">
  //         <img src="https://i.imgur.com/9AZ2QX1.jpg" width="40" class="rounded-image" />
  //       </div>
  //     </div>
  //     <div class="d-flex flex-column ml-2 mb-3">
  //         <span class="name">Daniel Frozer2</span>
  //         <small class="ellipsis">2021-12-23 00:49:16</small>

  //         <div class="comment-contents-box mt-2">
  //           <a href="#">
  //             <span class="comment-tag" style="color: #7b7f87; font-size: 1.2rm; font-weight: 700;">
  //               @Daniel Frozer
  //             </span>
  //           </a>
  //           <div class="comment-text mt-2">
  //           </div>
  //         </div>
  //         <div class="d-flex flex-row mt-1 mb-3 align-items-center status">
  //             <small class="comment-like" style="cursor: pointer">Like</small>
  //             <small class="comment-replay" style="cursor: pointer">Reply</small>
  //         </div>
  //         <div class="child-comment-input"></div>
  //     </div>
  // </div>
}

function showCommentReplayInput() {
  const commentReplay = document.querySelectorAll('.comment-replay');

  for (let i = 0; i < commentReplay.length; i++) {
    commentReplay[i].addEventListener('click', () => {
      // $('.child-comment-input').summernote({
      //   height: 150,
      //   focus: true,
      //   disableResizeEditor: true,
      //   focus: true,
      //   lang: 'ko-KR',
      //   placeholder: 'Enter a comment',
      // });
    });
  }
}

function commentSummerNoteInit() {
  $('#comment-write-input').summernote({
    height: 300,
    focus: true,
    disableResizeEditor: true,
    focus: true,
    lang: 'ko-KR',
    placeholder: 'Enter a comment',
  });
}

function reqCommentSave() {
  const commentSaveBtn = document.querySelector('.comment-input-box > button');

  const commentSave = async () => {
    const commentContents = $('#comment-write-input').summernote('code');

    const bodtData = {
      fi_idx,
      fc_comment_idx: null,
      fc_contents: commentContents,
    };

    const reqResult = await reqAjax(
      `/api/forum/comment/write`,
      'post',
      bodtData,
    );

    if (reqResult.code === 200) {
      reqDetail();
    } else {
      alert('작성 실패');
    }
  };

  commentSaveBtn.addEventListener('click', () => commentSave());
}

/**
 *
 * @param {Array} comments
 */
function reqComment(comments) {
  const commentBox = document.querySelector('.comments > .comment-box');

  commentBox.innerHTML = getCommentTemplate(comments);

  showCommentReplayInput();
  commentSummerNoteInit();
  reqCommentSave();
}

function likeEvent() {
  const like = document.querySelectorAll(
    '.comment-header-box > .forum-detail-like-box > span > i',
  );

  /**
   *
   * @param {String} likeType
   */
  const reqLikeController = async likeType => {
    if (likeType !== 'like' && likeType !== 'un-like') {
      throw new Error('A non-existent Like type.');
    }

    const linkData = likeType === 'like' ? '' : `/${fi_idx}`;
    const linkEndPoint = `${likeType}${linkData}`;
    const likeURI = `/api/forum/${linkEndPoint}`;
    const method = likeType === 'like' ? 'post' : 'delete';
    const bodyData = {
      fi_idx,
    };

    const reqResult = await reqAjax(likeURI, method, bodyData);

    if (reqResult.code === 200) reqDetail(window.scrollY);
  };

  for (let i = 0; i < like.length; i++) {
    const likeType = like[i].classList[like[i].classList.length - 1];

    like[i].addEventListener('click', () => reqLikeController(likeType));
  }
}

/**
 *
 * @param {Object} reqResult
 * @returns
 */
function reqDataCheck(reqResult, scrollHeight) {
  const detailCard = document.querySelector('.detail-card');

  if (reqResult.code === 200) {
    const {
      ui_nickname,
      ui_profile_hash,
      fi_view,
      fi_title,
      fi_category,
      fi_content,
      comments,
      like_status,
      like_count,
      forum_status,
      update_datetime,
    } = reqResult.data[0];

    detailCard.innerHTML = getDetailTemplate(
      ui_nickname,
      ui_profile_hash,
      fi_view,
      fi_title,
      fi_category,
      fi_content,
      like_status,
      like_count,
      forum_status,
      comments.length,
      update_datetime,
    );

    likeEvent();
    reqComment(comments);

    return window.scrollTo(0, scrollHeight);
  } else {
    return (window.location.href = '/forum/list');
  }
}

async function reqDetail(scrollHeight = 0) {
  const reqResult = await reqAjax(`/api/forum/detail/${fi_idx}`, 'get');

  return reqDataCheck(reqResult, scrollHeight);
}

reqDetail();
