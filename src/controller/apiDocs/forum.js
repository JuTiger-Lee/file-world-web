const listForum = {
  '/api/forum/list': {
    get: {
      tags: ['Forum'],
      summary: '사용자 회원가입',
      description: `
            사용자 회원가입
      
            * 결과 JSON
            {
              "code": 200,
              "message": "success",
              "data": [
                        0: {
                            pagination: {startIndex: 1, endIndex: 1, pageSize: 10, totalPage: 1,…}
                            currentPage: "1"
                            endIndex: 1
                            list: [{
                                comment_count: 0,
                                fi_category: "data-export",
                                fi_idx: 300,
                                fi_title: "도전 망설이는 비전공자들에게 2 ( 부제: 2021회고)",
                                fi_view: 0,
                                forum_status: "false",
                                like_count: 0,
                                like_status: "false",
                                ui_nickname: "jeffrey",
                                ui_profile: "/upload/profile/main_global.jpg",
                                ui_profile_hash: "/upload/profile/main_global_958d4388bc.jpg",
                                update_datetime: "2022-01-03 01:07:12",
                            }]
                            pageSize: 10
                            startIndex: 1
                            totalPage: 1,
                        }
                    ]
            }`,
      parameters: [
        {
          in: 'query',
          name: 'currentPage',
          required: false,
          description: 'current page',
          type: 'string',
        },
        {
          in: 'query',
          name: 'pageSize',
          required: false,
          description: 'page size',
          type: 'string',
        },
        {
          in: 'query',
          name: 'category',
          required: false,
          description: 'category',
          type: 'string',
        },
        {
          in: 'query',
          name: 'title',
          required: false,
          description: 'title',
          type: 'string',
        },
      ],
      responses: {
        200: {
          description: 'user create success',
        },
        500: {
          description: 'SERVER ERROR',
        },
      },
    },
  },
};

module.exports = {
  listForum,
};
