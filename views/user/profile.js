const chagneProfile = document.querySelector('.change-profile');

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

function reqDataCheck(reqResult) {
  const profile = document.querySelector('.avatar > img');
  const profileUserName = document.querySelector('.profile-user-name');
  const forumListCardBox = document.querySelector('.forum-list-card-box');
  let template = '';

  if (reqResult.code === 200) {
    for (let i = 0; i < reqResult.data[0].pagination.list.length; i++) {
      template += makeForumListTemplate(
        reqResult.data[0].pagination.list[i].fi_idx,
        reqResult.data[0].pagination.list[i].fi_title,
        reqResult.data[0].pagination.list[i].fi_category,
      );
    }

    if (reqResult.data[0].pagination.totalPage > 0) {
      makePagination(reqResult.data[0].pagination);
    }

    profile.src = reqResult.data[0].ui_profile;
    profileUserName.textContent = reqResult.data[0].ui_nickname;
    forumListCardBox.innerHTML = template;
  } else {
    return alert('profile sorry');
  }
}

async function reqProfile() {
  const reqResult = await reqAjax('/api/user/profile', 'get');

  reqDataCheck(reqResult);
}

chagneProfile.addEventListener('change', async e => {
  e.preventDefault();
  const file = e.target.files[0];
  const formData = new FormData();

  formData.append('profile', file);

  const reqResult = await reqAjax('/api/user/profile-upload', 'put', formData, {
    'Content-Type': 'multipart/form-data',
  });
  console.log('reqResult---', reqResult);
});

reqProfile();
