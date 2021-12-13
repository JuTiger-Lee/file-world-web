function makeDetailTemplate(nickname, ui_profile, contents, dateTime) {
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
                <small class="text-primary">Collegues</small>
            </div>
        </div>
        <div class="d-flex flex-row mt-1 ellipsis">
            <small class="mr-2">${dateTime}</small>
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
      <div class="p-2 detail-contents-box">
        ${contents}
      </div>
      <hr>
      <div class="p-2">
        <div class="d-flex justify-content-between align-items-center">
            <div class="d-flex flex-row icons d-flex align-items-center">
                <i class="fa fa-heart"></i>
                <i class="fa fa-smile-o ml-2"></i>
            </div>
            <div class="d-flex flex-row muted-color">
                <span>2 comments</span>
                <span class="ml-2">Share</span>
            </div>
        </div>
        <hr>
        <div class="comments">
            <div class="d-flex flex-row mb-2">
              <div class="forum-user-profile-box">
                <div class="forum-profile forum-user-profile">
                <img src="https://i.imgur.com/9AZ2QX1.jpg" width="40" class="rounded-image" />
                </div>
              </div>
                <div class="d-flex flex-column ml-2">
                    <span class="name">Daniel Frozer</span>
                    <small class="comment-text">I like this alot! thanks alot</small>
                    <div class="d-flex flex-row align-items-center status">
                        <small>Like</small>
                        <small>Reply</small>
                        <small>18 mins</small>
                    </div>
                </div>
            </div>
            <div class="d-flex flex-row mb-2">
                <div class="forum-user-profile-box">
                  <div class="forum-profile forum-user-profile">
                    <img src="https://i.imgur.com/9AZ2QX1.jpg" width="40" class="rounded-image" />
                  </div>
                </div>
                <div class="d-flex flex-column ml-2">
                    <span class="name">Elizabeth goodmen</span>
                    <small class="comment-text">Thanks for sharing!</small>
                    <div class="d-flex flex-row align-items-center status">
                        <small>Like</small>
                        <small>Reply</small>
                        <small>8 mins</small>
                    </div>
                </div>
            </div>
            <div class="comment-input">
                <input type="text" class="form-control">
                <div class="fonts">
                    <i class="fa fa-camera"></i>
                </div>
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
      fi_content,
      update_datetime,
    );
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
