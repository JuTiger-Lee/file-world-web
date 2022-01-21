const commentModel = require('../models/comment');

class Comment {
  constructor(response) {
    this.response = response;
  }

  /**
   *
   * @param {Number} ui_idx
   * @param {Number} fi_idx
   * @param {Number} fc_replay_idx
   * @param {Number} fc_target_ui_idx
   * @param {Number} fc_group_idx
   * @param {String} fc_contents
   */
  async createComment({
    ui_idx,
    fi_idx,
    fc_replay_idx,
    fc_target_ui_idx,
    fc_group_idx,
    fc_contents,
  }) {
    const saveComment = await commentModel.createComment([
      ui_idx,
      fi_idx,
      fc_replay_idx,
      fc_target_ui_idx,
      fc_group_idx,
      fc_contents,
    ]);

    if (!saveComment.data.affectedRows) {
      this.response.init(500, 500, 'comment write Error');
      throw this.response.makeErrorResponse({}, 'comment insert Error');
    }
  }
}

module.exports = Comment;
