const forumModel = require('../models/forum');
const Pagination = require('../controller/Pagination');

class Forum {
  constructor(response) {
    this.response = response;
  }

  /**
   *
   * @param {Number} pageSize
   * @param {Number} currentPage
   * @param {Object} sql
   * @returns {Object}
   */
  async getPageingList(pageSize, currentPage, sql) {
    const pagination = new Pagination(pageSize, currentPage, sql);
    pagination.init();

    const pagingData = await pagination.getPagingInfo();

    return pagingData;
  }

  /**
   *
   * @param {Number} idx
   * @param {Number} ui_idx
   * @returns {Object}
   */
  async getDetail(idx, ui_idx) {
    await forumModel.updateView([idx]);

    const params = [];

    const detailParams = [idx, idx, ui_idx, idx, ui_idx, idx];

    const commentParams = [idx];

    params.push(...detailParams, ...commentParams);

    const detailForum = await forumModel.detailForum(params);

    if (!detailForum.data[0].length || detailForum.data[0].length > 1) {
      this.response.init(500, 500, 'detail Error');
      throw this.response.makeErrorResponse({}, 'forum detail Error');
    }

    const [forum, comment] = detailForum.data;
    const [detailPost] = forum;
    detailPost.comments = comment;

    const { comments } = detailPost;

    for (let i = 0; i < comments.length; i += 1) {
      // childComment Array init
      comments[i].childComments = [];
    }

    for (let i = 0; i < comments.length; i += 1) {
      for (let j = 0; j < comments.length; j += 1) {
        if (comments[i].fc_group_idx === comments[j].fc_idx) {
          comments[j].childComments.push(comments[i]);
          comments.splice(i, 1);
          i -= 1;
        }
      }
    }

    return detailPost;
  }

  async getCountCategoryList() {
    const countCategoryInfo = await forumModel.getCategoryCountInfo([]);

    return countCategoryInfo;
  }

  async createPost(fi_title, fi_category, fi_content, ui_idx) {
    const newForum = await forumModel.createForum([
      fi_title,
      fi_category,
      fi_content,
      ui_idx,
    ]);

    if (!newForum.data.affectedRows) {
      this.response.init(500, 500, 'write Error');
      throw this.response.makeErrorResponse({}, 'forum post insert Error');
    }
  }

  async getRankList() {
    const rankForumList = await forumModel.getRankForum([]);

    return rankForumList;
  }

  async createLike(ui_idx, fi_idx) {
    const checkLike = await forumModel.checkLike([ui_idx, fi_idx]);

    if (checkLike.data[0].like_count) {
      this.response.init(500, 500, 'like are already enabled.');
      throw this.response.makeErrorResponse({}, 'like check Error');
    }

    const insertLike = await forumModel.createLike([ui_idx, fi_idx]);

    if (!insertLike.data.affectedRows) {
      this.response.init(500, 500, 'like Error');
      throw this.response.makeErrorResponse({}, 'like insert Error');
    }
  }

  async deliteLike(ui_idx, idx) {
    const deleteLike = await forumModel.deleteLike([ui_idx, idx]);

    if (!deleteLike.data.affectedRows) {
      this.response.init(500, 500, 'unlike Error');
      throw this.response.makeErrorResponse({}, 'like delete Error');
    }
  }
}

module.exports = Forum;
