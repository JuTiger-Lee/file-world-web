const model = require('../models/db');

class Pagination {
  /**
   *
   * @param {Number} pageSize
   * @param {Number} currentPage
   * @param {Ojbect} sql
   */
  constructor(pageSize, currentPage, sql) {
    this.pageSize = pageSize;
    this.currentPage = currentPage;
    this.sql = sql;
  }

  init() {
    this.pagingInfo = {
      startIndex: 0,
      endIndex: 0,
      pageSize: 0,
      totalPage: 0,
      list: [],
      currentPage: 0,
    };

    this.pagingPage = 10;
    this.combineListSQL = '';
    this.combineTotalSQL = '';
  }

  // current page value
  getCurrentPage() {
    if (this.currentPage < 1) this.currentPage = 1;

    return this.currentPage;
  }

  getPageGroup() {
    return Math.ceil(this.currentPage / this.pagingPage);
  }

  getLimit() {
    const startIndex = this.pageSize * (this.currentPage - 1);
    this.pagingInfo.pageSize = this.pageSize;

    return ` LIMIT ${startIndex}, ${this.pagingInfo.pageSize}`;
  }

  sqlCombine() {
    // list sql
    this.combineListSQL =
      `${this.sql.list} ${this.sql.where} ` +
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

    return Math.ceil(total.data[0].total / this.pagingInfo.pageSize);
  }

  getLast() {
    let endIndex = this.pageGorup * this.pagingPage;

    if (endIndex > this.pagingInfo.totalPage) {
      endIndex = this.pagingInfo.totalPage;
    }

    return endIndex;
  }

  getFirst() {
    let startIndex = 1;

    if (this.pagingInfo.endIndex - (this.pagingPage - 1) <= 0) {
      startIndex = 1;
    } else {
      startIndex = this.pagingInfo.endIndex - (this.pagingPage - 1);

      if (this.currentPage > 10) {
        if (startIndex <= 11) {
          startIndex = this.pagingInfo.endIndex - (startIndex - 2);
        } else {
          startIndex =
            this.pagingInfo.endIndex -
            (startIndex - 10 * (this.pageGorup - 2) - 2);
        }
      }
    }

    return startIndex;
  }

  async getPagingInfo() {
    this.pagingInfo.currentPage = this.getCurrentPage();
    this.pageGorup = this.getPageGroup();

    this.sql.limit += this.getLimit();
    this.sqlCombine();

    this.pagingInfo.list = await this.getList();
    this.pagingInfo.totalPage = await this.getTotalPage();
    this.pagingInfo.endIndex = this.getLast();
    this.pagingInfo.startIndex = this.getFirst();

    return this.pagingInfo;
  }
}

module.exports = Pagination;
