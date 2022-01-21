const db = require('./db');

async function createComment(params) {
  const sql =
    'INSERT INTO forum_comment(ui_idx, fi_idx, fc_replay_idx, fc_target_ui_idx,' +
    'fc_group_idx, fc_contents, create_datetime, update_datetime) ' +
    'VALUES(?, ?, ?, ?, ?, ?, now(), now());';

  return db.query(sql, params);
}

module.exports = {
  createComment,
};
