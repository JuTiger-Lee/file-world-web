const chagneProfile = document.querySelector('.change-profile');

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

function reqProfileDataCheck(reqResult, reqListCallback) {
  const profile = document.querySelector('.avatar > img');
  const profileUserName = document.querySelector('.profile-user-name');
  const forumListCardBox = document.querySelector('.forum-list-card-box');

  forumListCardBox.innerHTML = '';
  let template = '';

  if (reqResult.code === 200 && reqResult.data[0].pagination.list.length) {
    const { pagination, ui_nickname, ui_profile_hash } = reqResult.data[0];

    for (let i = 0; i < pagination.list.length; i++) {
      template += makeForumListTemplate(
        pagination.list[i].fi_idx,
        ui_profile_hash,
        ui_nickname,
        pagination.list[i].fi_title,
        pagination.list[i].fi_category,
        pagination.list[i].update_datetime,
      );
    }

    profile.src = ui_profile_hash;
    profileUserName.textContent = ui_nickname;
    forumListCardBox.innerHTML = template;
  } else {
    return alert('profile sorry');
  }

  makePagination(pagination, reqListCallback);

  return window.scrollTo(0, 0);
}

async function reqProfile(queryString) {
  let reqResult = [];

  const reqListCallback = () => {
    reqResult = await reqAjax(`/api/user/profile?${queryString}`, 'get');
  };

  reqListCallback();

  return reqProfileDataCheck(reqResult, reqListCallback);
}

function reqProfileUploadDataCheck(reqResult) {
  if (reqResult.code === 200) reqProfile('currentPage=1');
  else alert('profile upload faill');
}

async function reqProfileUpload(e) {
  e.preventDefault();

  const file = e.target.files[0];
  const formData = new FormData();

  formData.append('profile', file);

  const reqResult = await reqAjax('/api/user/profile-upload', 'put', formData, {
    'Content-Type': 'multipart/form-data',
  });

  return reqProfileUploadDataCheck(reqResult);
}

function init() {
  const queryString = window.location.search.substr(1).split('&');
  let reqQueryString = '';

  if (queryString[0] !== '') {
    reqQueryString = queryString.join('&');
  } else {
    reqQueryString = 'currentPage=1';
  }

  return reqProfile(reqQueryString);
}

chagneProfile.addEventListener('change', e => reqProfileUpload(e));

init();
