const pasingURI = location.pathname.split('/');
const fi_idx = pasingURI[pasingURI.length - 1];

/**
 *
 * @param {String} nickname
 * @param {String} profile
 * @param {Number} fi_view
 * @param {String} title
 * @param {String} category
 * @param {String} contents
 * @param {String} like_status
 * @param {Number} like_count
 * @param {String} forum_status
 * @param {Number} commentLength
 * @param {Date} dateTime
 * @returns
 */
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
                  '<span>Report</span>' +
                  '</a>' +
                  '<a class="dropdown-item" href="#">' +
                  '<span>Book Mark</span>' +
                  '</a>' +
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
              <div class="form-group">
                <textarea 
                  class="form-control comment-contents" 
                  rows="10"
                  placeholder="write comments"
                ></textarea>
              </div>
              <div class="forum-detail-btn-box float-right">
                <a href="/forum/list">
                  <button class="btn btn-danger">Cancle</button>
                </a>
                <button 
                  class="
                    btn btn-primary 
                    forum-comment-save-btn 
                  ">
                  Save
                </button>
              </div>
            </div>
        </div>
      </div>`;
}

/**
 *
 * @param {Array} comments
 * @returns
 */
function getCommentTemplate({
  ui_idx,
  fc_idx,
  ui_profile_hash,
  ui_nickname,
  childComments,
  update_datetime,
  fc_contents,
}) {
  return `
    ${(function () {
      let commentTemplate = '';

      const fc_group_idx = fc_idx;

      commentTemplate += `
          <div 
            class="d-flex flex-row mb-2 comment-contents-box" 
            id="comment-${fc_idx}" 
            data-group-id="${fc_group_idx}"
            data-comment-id="${fc_idx}" 
            data-user-id="${ui_idx}"
          >
            <div class="forum-user-profile-box">
              <div class="forum-profile forum-user-profile">
                <img src="${ui_profile_hash}" width="40" class="rounded-image" />
              </div>
            </div>
            <div class="d-flex flex-column ml-2 mb-3">
              <span class="name">${ui_nickname}</span>
              <small class="ellipsis">${update_datetime}</small>
      
              <div class="comment-text mt-2">${fc_contents}</div>
              <div class="d-flex flex-row mt-1 mb-3 align-items-center status">
                <small class="comment-like" style="cursor: pointer">Like</small>
                <small class="comment-replay" style="cursor: pointer">Reply</small>
              </div>
              <div class="child-comment-input-box comment-input-off" style="display:none">
                <textarea 
                  class="form-control child-comment-contents" 
                  rows="10"
                  placeholder="write child comments"
                ></textarea>
                <button 
                  class="
                    btn btn-primary 
                    mt-2 
                    forum-comment-save-btn 
                    float-right"
                  >
                Save
                </button>
              </div>
            </div>
          </div>
          
          <div class="child-comment-box ml-5">
            ${(function () {
              let childCommentTemplate = '';

              for (let j = 0; j < childComments.length; j++) {
                const {
                  ui_idx,
                  ui_target_nickname,
                  fc_idx,
                  ui_profile_hash,
                  ui_nickname,
                  update_datetime,
                  fc_contents,
                } = childComments[j];

                childCommentTemplate += `
                      <div>
                        <div 
                          class="d-flex flex-row mb-2 child-comment-contents-box"
                          id="comment-${fc_idx}"
                          data-group-id="${fc_group_idx}"
                          data-comment-id="${fc_idx}" 
                          data-user-id="${ui_idx}"
                        >
                          <div class="forum-user-profile-box">
                            <div class="forum-profile forum-user-profile">
                              <img src="${ui_profile_hash}" width="40" class="rounded-image" />
                            </div>
                          </div>
                          <div class="d-flex flex-column ml-2 mb-3">
                            <span class="name">${ui_nickname}</span>
                            <small class="ellipsis">${update_datetime}</small>
                    
                            <div class="mt-2">
                              <a href="#">
                                <span class="comment-tag" style="color: #7b7f87; font-size: 1.2rm; font-weight: 700;">
                                  @${ui_target_nickname}
                                </span>
                              </a>
                            <div class="comment-text mt-2">${fc_contents}</div>
                          </div>
                          <div class="d-flex flex-row mt-1 mb-3 align-items-center status">
                            <small class="comment-like" style="cursor: pointer">Like</small>
                            <small class="comment-replay" style="cursor: pointer">Reply</small>
                          </div>
                          <div class="child-comment-input-box comment-input-off" style="display:none">
                              <textarea 
                                class="form-control child-comment-contents" 
                                rows="10"
                                placeholder="write child comments"
                              ></textarea>
                              <button 
                                class="
                                  btn btn-primary 
                                  mt-2 
                                  forum-comment-save-btn 
                                  float-right"
                              >
                              Save
                            </button>
                          </div>
                        </div>
                      </div>`;
              }

              return childCommentTemplate;
            })()}
          </div>`;

      return commentTemplate;
    })()}`;
}

const reqCommentSave = async (
  fc_contents,
  fc_replay_idx,
  fc_target_ui_idx,
  fc_group_idx,
) => {
  const bodtData = {
    fi_idx,
    fc_replay_idx,
    fc_target_ui_idx,
    fc_group_idx,
    fc_contents: fc_contents,
  };

  const reqResult = await reqAjax(`/api/forum/comment/write`, 'post', bodtData);

  if (reqResult.code === 200) reqDetail(window.scrollY);
  else alert('작성 실패');
};

function commentSave() {
  const commentSaveBtn = document.querySelector(
    '.forum-detail-btn-box .forum-comment-save-btn ',
  );

  commentSaveBtn.addEventListener('click', () => {
    const commentContents = document.querySelector('.comment-contents').value;

    reqCommentSave(commentContents);
  });
}

function showChildCommentInput() {
  const commentReplay = document.querySelectorAll(
    '.comments > .comment-box .comment-replay',
  );

  /**
   *
   * @param {Number} index
   */
  const showChildComment = index => {
    const childCommentInputBox = document.querySelectorAll(
      '.child-comment-input-box',
    );

    /**
     *
     * @param {Boolean} showStatus
     */
    const showChildInputController = showStatus => {
      childCommentInputBox[index].classList.remove(
        `comment-input-${showStatus === true ? 'on' : 'off'}`,
      );
      childCommentInputBox[index].classList.add(
        `comment-input-${showStatus === false ? 'on' : 'off'}`,
      );
    };

    if (childCommentInputBox[index].classList[1] === 'comment-input-off') {
      showChildInputController(false);

      const commentContentsBox =
        commentReplay[index].parentElement.parentElement.parentElement;

      const fc_idx = commentContentsBox.getAttribute('data-comment-id');
      const fc_group_idx = commentContentsBox.getAttribute('data-group-id');
      const fc_target_ui_idx = commentContentsBox.getAttribute('data-user-id');

      const childCommentInputBox = document.querySelectorAll(
        '.child-comment-input-box .forum-comment-save-btn ',
      );

      for (let i = 0; i < childCommentInputBox.length; i++) {
        childCommentInputBox[i].addEventListener('click', () => {
          const commentContents = document.querySelectorAll(
            '.child-comment-contents',
          );

          reqCommentSave(
            commentContents[i].value,
            fc_idx,
            fc_target_ui_idx,
            fc_group_idx,
          );
        });
      }
    } else {
      showChildInputController(true);
    }
  };

  for (let i = 0; i < commentReplay.length; i++) {
    commentReplay[i].addEventListener('click', () => showChildComment(i));
  }
}

/**
 *
 * @param {Array} comments
 */
function reqComment(comments) {
  const commentBox = document.querySelector('.comments > .comment-box');

  for (let i = 0; i < comments.length; i++) {
    const {
      ui_idx,
      fc_idx,
      ui_profile_hash,
      ui_nickname,
      childComments,
      update_datetime,
      fc_contents,
    } = comments[i];

    commentBox.innerHTML += getCommentTemplate({
      ui_idx,
      fc_idx,
      ui_profile_hash,
      ui_nickname,
      childComments,
      update_datetime,
      fc_contents,
    });
  }

  commentSave();
  showChildCommentInput();
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
