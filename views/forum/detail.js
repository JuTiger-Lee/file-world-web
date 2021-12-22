function makeDetailTemplate(
  nickname,
  ui_profile,
  title,
  category,
  contents,
  dateTime,
) {
  return `
      <div class="d-flex justify-content-between p-2 px-3">
        <div class="d-flex flex-row align-items-center">
            <div class="forum-user-profile-box">
              <div class="forum-profile forum-user-profile">
                  <img src="${ui_profile}" width="50" alt="user profile">
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
                    <a class="dropdown-item" href="#">
                        <span>Report</span>
                    </a>
                    <a class="dropdown-item" href="#">
                        <span>Book Mark</span>
                    </a>
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
            <div class="d-flex flex-row icons d-flex align-items-center">
                <i class="far fa-heart"></i> 
                <i class="fa fa-smile-o ml-2"></i>
            </div>
            <div class="d-flex flex-row muted-color">
                <span>2 comments</span>
                <span class="ml-2">Share</span>
            </div>
        </div>
        <hr>
        <div class="comments">
          <div class="comment-box">
            <div class="d-flex flex-row mb-2 comment">
              <div class="forum-user-profile-box">
                <div class="forum-profile forum-user-profile">
                <img src="https://i.imgur.com/9AZ2QX1.jpg" width="40" class="rounded-image" />
                </div>
              </div>
                <div class="d-flex flex-column ml-2 mb-3">
                    <span class="name">Daniel Frozer</span>
                    <small class="ellipsis">${dateTime}</small>

                    <div class="comment-text mt-2">
                      ${contents}
                    </div>
                    <div class="d-flex flex-row mt-1 align-items-center status">
                        <small class="comment-like">Like</small>
                        <small class="comment-replay">Reply</small>
                    </div>
                </div>
            </div>
            <div class="child-comment ml-5" style="background-color: rgb(248, 249, 250);">
              <div class="d-flex flex-row mb-2">
                <div class="forum-user-profile-box">
                  <div class="forum-profile forum-user-profile">
                    <img src="https://i.imgur.com/9AZ2QX1.jpg" width="40" class="rounded-image" />
                  </div>
                </div>
                <div class="d-flex flex-column ml-2 mb-3">
                    <span class="name">Daniel Frozer2</span>
                    <small class="ellipsis">${dateTime}</small>

                    <div class="comment-contents-box mt-2">
                      <a href="#">
                        <span class="comment-tag" style="color: #7b7f87; font-size: 1.2rm; font-weight: 700;">
                          @Daniel Frozer
                        </span>
                      </a>
                      <div class="comment-text mt-2">
                        ${contents}
                      </div>
                    </div>
                    <div class="d-flex flex-row mt-1 align-items-center status">
                        <small class="comment-like">Like</small>
                        <small class="comment-replay">Reply</small>
                    </div>
                </div>
              </div>
            </div>
          </div>
            <div class="comment-input-box">
              <div id="comment-input"></div>
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

/**
 *
 * @param {Object} reqResult
 * @returns
 */
function reqDataCheck(reqResult) {
  const detailCard = document.querySelector('.detail-card');

  if (reqResult.code === 200) {
    const {
      ui_nickname,
      ui_profile_hash,
      fi_title,
      fi_category,
      fi_content,
      update_datetime,
    } = reqResult.data[0];

    detailCard.innerHTML = makeDetailTemplate(
      ui_nickname,
      ui_profile_hash,
      fi_title,
      fi_category,
      fi_content,
      update_datetime,
    );

    $('#comment-input').summernote({
      height: 150,
      focus: true,
      disableResizeEditor: true,
      focus: true,
      lang: 'ko-KR',
      placeholder: 'Enter a comment',
    });
  } else {
    window.location.href = '/forum/list';
  }
}

(async function reqDetail() {
  const pasingURI = location.pathname.split('/');
  const fi_idx = pasingURI[pasingURI.length - 1];

  const reqResult = await reqAjax(`/api/forum/detail/${fi_idx}`, 'get');

  return reqDataCheck(reqResult);
})();
