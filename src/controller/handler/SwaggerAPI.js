function getServerHost() {
  let swaggerHost = '';

  if (process.env.NODE_ENV === 'prod') {
    swaggerHost = '';
  } else if (process.env.NODE_ENV === 'dev') {
    swaggerHost = 'https://file-world.herokuapp.com';
  } else {
    swaggerHost = 'localhost:8081';
  }

  return swaggerHost;
}

const swaggerInfo = {
  title: 'file-world-API',
  version: '0.0.1',
  description:
    '### DOMAIN \n' +
    'LOCAL: localhost:8081 \n' +
    'DEV: https://file-world.herokuapp.com \n\n' +
    '### Repository \n' +
    'file-world-web: https://github.com/dlwngh9088-lee/file-world-web \n' +
    'file-world-desktop: https://github.com/dlwngh9088-lee/file-world-desktop \n' +
    '### ADMIN \n' +
    'LOCAL: http://localhost:8081/admin \n' +
    'DEV: https://file-world.herokuapp.com/admin \n' +
    'PROD: ----------------------------------- \n' +
    '### API MTHOD \n' +
    'GET: list 및 화면 render시 등 사용 \n' +
    'POST: 사용자 생성 및 게시글 작성시 등 사용 \n' +
    'PUT: 사용자 변경 및 게시글 변경시 등 사용 \n' +
    'DELETE: 사용자 삭제 및 게시글 삭제시 등 사용 \n\n' +
    '### ERR CODE AND HTTP STATUS \n' +
    'ERR CODE는 어플리케이션에서 관리 하는 CODE 이므로 더 주의깊게 봐야함 \n' +
    'HTTP STATUS는 HTTP에 맞게 했으니 참고 \n' +
    '모든 API HTTP STATUS 보다는 code를 우선시 봐야 함',
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

const swaggerSecurityDefinitions = {
  ApiKeyAuth: {
    type: 'apiKey',
    name: 'Authorization',
    in: 'header',
  },
};

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
    type: 'object',
    properties: {
      666: {
        type: 'DB Query Error',
      },
    },
  },
};

const swaggerHost = getServerHost();

class SwaggerAPI {
  constructor() {
    this.option = {
      definition: {
        host: swaggerHost,
        schemes: swaggerSchemes,
        securityDefinitions: swaggerSecurityDefinitions,
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
      explorer: true,
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
