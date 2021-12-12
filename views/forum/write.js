'use strict';

const forumWriteSaveBtn = document.querySelector('.forum-write-save-btn');

function forumValueCheck(forumWriteTitle) {
  if (!forumWriteTitle.trim() || !forumWriteTitle) {
    return alert('제목을 작성해주세요.');
  }

  if ($('#summernote').summernote('isEmpty')) {
    return alert('내용을 작성해주세요.');
  }

  return true;
}

function reqDataCheck(reqResult) {
  if (reqResult.code === 200) {
    return (window.location.href = '/forum/list');
  } else {
    alert('작성 실패');

    return (window.location.href = '/forum/list');
  }
}

async function reqForumWrite() {
  const forumWriteTitle = document.querySelector('.forum-write-title').value;
  const forumWriteCategory = document.querySelector(
    '.forum-write-category',
  ).value;
  const forumWriteContetns = $('#summernote').summernote('code');

  const forumWriteValueResult = forumValueCheck(forumWriteTitle);

  if (forumWriteValueResult) {
    const bodyData = {
      fi_title: forumWriteTitle,
      fi_category: forumWriteCategory,
      fi_content: forumWriteContetns,
    };

    const reqResult = await reqAjax('/api/forum/write', 'post', bodyData);

    return reqDataCheck(reqResult);
  }
}

function init() {
  $('#summernote').summernote({
    height: 500,
    focus: true,
    disableResizeEditor: true,
    focus: true,
    lang: 'ko-KR',
    placeholder: 'contents',
  });
}

forumWriteSaveBtn.addEventListener('click', () => reqForumWrite());

init();
