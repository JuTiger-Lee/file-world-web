const idCheck = {
  '/api/user/id-check': {
    post: {
      tags: ['User'],
      summary: '사용자 ID 중복 체크',
      description: '',
      parameters: [
        {
          in: 'formData',
          name: 'ui_id',
          required: true,
          description: 'user id',
          type: 'string',
        },
      ],
      responses: {
        200: {
          description: 'No duplicate ids',
        },
      },
    },
  },
};

const nicknameCheck = {
  '/api/user/nickname-check': {
    post: {
      tags: ['User'],
      summary: '사용자 nickname 중복 체크',
      description: '',
      parameters: [
        {
          in: 'formData',
          name: 'ui_nickname',
          required: true,
          description: 'user nickname',
          type: 'string',
        },
      ],
      responses: {
        200: {
          description: 'No duplicate nicknames',
        },
      },
    },
  },
};

const signUp = {
  '/api/user/sign-up': {
    post: {
      tags: ['User'],
      summary: '사용자 회원가입',
      description: `
          사용자 회원가입
    
          * 결과 JSON
          {
            "data": [],
            "status": 201,
            "message": "success",
          }`,
      parameters: [
        {
          in: 'formData',
          name: 'ui_email',
          required: true,
          description: 'user email',
          type: 'string',
        },
        {
          in: 'formData',
          name: 'ui_nickname',
          required: true,
          description: 'user nickname',
          type: 'string',
        },
        {
          in: 'formData',
          name: 'ui_id',
          required: true,
          description: 'user id',
          type: 'string',
        },
        {
          in: 'formData',
          name: 'ui_password',
          required: true,
          description: 'user password',
          type: 'string',
        },
      ],
      responses: {
        201: {
          description: 'user create success',
        },
        400: {
          description:
            'body data ui_email, ui_id, ui_name, ui_passowrd does not exist',
        },
        409: {
          description: 'user id duplicate',
        },
        500: {
          description: 'emaill send error and password encrypt error',
        },
      },
    },
  },
};

const signIn = {
  '/api/user/sign-in': {
    post: {
      tags: ['User'],
      summary: '사용자 로그인',
      description: `
      사용자 로그인

      * 결과 JSON
      {
        "data": [{ token: 'example token' }],
        "status": 200,
        "message": "success",
      }`,
      parameters: [
        {
          in: 'formData',
          name: 'ui_id',
          required: true,
          description: 'user email',
          type: 'string',
        },
        {
          in: 'formData',
          name: 'ui_password',
          required: true,
          description: 'user nickname',
          type: 'string',
        },
      ],
      responses: {
        200: {
          description: 'success',
        },
        400: {
          description: 'Non-existent user and password mismatch',
        },
        500: {
          description: 'password compare Error and login Error',
        },
      },
    },
  },
};

module.exports = {
  signUp,
  signIn,
  idCheck,
  nicknameCheck,
};
