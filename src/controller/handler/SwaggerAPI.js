const swaggerInfo = {
  title: 'file-world-API',
  version: '0.0.1',
  description:
    '### DOMAIN \n' +
    'LOCAL: localhost:8081 \n' +
    'DEV: https://dev-file-world.loca.lt \n\n' +
    '### Repository \n' +
    'file-world-web: https://github.com/dlwngh9088-lee/file-world-web \n' +
    'file-world-desktop: https://github.com/dlwngh9088-lee/file-world-desktop \n' +
    '### ADMIN \n' +
    'LOCAL: http://localhost:8081/admin \n' +
    'DEV: https://dev-file-world.loca.lt/admin \n' +
    '### API MTHOD \n' +
    'GET: list 및 화면 render시 등 사용 \n' +
    'POST: 사용자 생성 및 게시글 작성시 등 사용 \n' +
    'PUT: 사용자 변경 및 게시글 변경시 등 사용 \n' +
    'DELETE: 사용자 삭제 및 게시글 삭제시 등 사용',
};

const swaggerTags = [
  {
    name: 'User',
    description: '사용자 관련 API',
  },
  {
    name: 'Forum',
    description: 'forum 관련 API',
  },
  {
    name: 'Admin/User',
    description: '관리자 관련 API',
  },
];

/* open api 3.0.0 version option */

// const swaggerServers = [
//   {
//     url: 'http://localhost:8081',
//     description: 'local server',
//   },
//   {
//     url: 'https://dev-file-world.loca.lt',
//     description: 'dev server',
//   },
// ];

const swaggerSchemes = ['http', 'https'];

const swaggerComponents = {
  JWT_ERROR: {
    description: 'jwt token Error',
    type: 'object',
    properties: {
      401: {
        type: 'Error token 변조 에러',
      },
    },
  },
  DB_ERROR: {
    description: 'database Error',
  },
};

class SwaggerAPI {
  constructor() {
    this.option = {
      definition: {
        host: 'localhost:8081',
        schemes: swaggerSchemes,
        // openapi: '3.0.0',
        info: swaggerInfo,

        /* open api 3.0.0 version option */
        // servers: swaggerServers,

        produces: ['application/json'],
        // 옵션 추가시 데이터가 query로 날라감
        // consumes: ['application/json'],
        tags: swaggerTags,
      },
      apis: [],
    };

    this.setUpOption = {
      // search
      // explorer: true,
    };
  }

  init() {
    this.components = swaggerComponents;
    this.paths = {};
  }

  /**
   *
   * @param {Object} api
   */
  addAPI(api) {
    for (const [key, value] of Object.entries(api)) {
      this.paths[key] = value;
    }
  }

  /**
   *
   * @param {Object} components
   */
  addComponent(components) {
    for (const [key, value] of Object.entries(components)) {
      this.components[key] = value;
    }
  }

  getOption() {
    this.option.definition.paths = this.paths;
    this.option.definition.definitions = this.components;

    return {
      apiOption: this.option,
      setUpOption: this.setUpOption,
    };
  }
}

module.exports = SwaggerAPI;
