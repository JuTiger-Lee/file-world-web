const model = require('../../models/db');

class Pagination {
  constructor() {
    this.pagingInfo = {
      start: '',
      end: '',
      totalPage: '',
      // nextPage: '',
      // prevPage: '',
      currentPage: '',
      list: [],
    };

    this.combineListSQL = '';
    this.combineTotalSQL = '';
  }

  /**
   *
   * @param {Number} pageSize
   * @param {Number} currentPage
   * @param {Ojbect} sql
   */
  async init(pageSize, currentPage, sql) {
    this.pageSize = pageSize;
    this.currentPage = currentPage;
    this.sql = sql;

    this.pagingInfo.currentPage = this.directionPage();
    this.pagingInfo.start = this.start();
    this.pagingInfo.end = this.end();

    this.offset();
    this.sqlCombine();

    this.pagingInfo.list = await this.getList();
    this.pagingInfo.totalPage = await this.getTotalPage();
  }

  // get next, prev, current page value
  directionPage() {
    if (this.currentPage < 1) this.currentPage = 1;

    this.pagingInfo.currentPage = this.currentPage;
  }

  // start page
  start() {
    return this.pageSize * (this.currentPage - 1);
  }

  // page size
  end() {
    return this.pageSize;
  }

  offset() {
    this.sql.limit += ` LIMIT ${this.pagingInfo.start}, ${this.pagingInfo.end}`;
  }

  sqlCombine() {
    // list sql
    this.combineListSQL =
      `${this.sql.list} ${this.sql.where}` +
      `${this.sql.order} ${this.sql.limit}`;

    // rows length sql
    this.combineTotalSQL = `${this.sql.total} ${this.sql.where}`;
  }

  async getList() {
    const list = await model.query(this.combineListSQL, this.sql.params);

    return list.data;
  }

  async getTotalPage() {
    const total = await model.query(this.combineTotalSQL, this.sql.params);

    return Math.ceil(total.data[0].total / this.pagingInfo.end);
  }

  getPagingInfo() {
    return this.pagingInfo;
  }
}

module.exports = Pagination;
