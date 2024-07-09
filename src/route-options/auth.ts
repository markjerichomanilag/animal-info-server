import { RouteShorthandOptions } from 'fastify';

export const signUpUserOpts: RouteShorthandOptions = {
  schema: {
    response: {
      201: {
        type: 'object',
        required: ['message'],
        properties: {
          message: { type: 'string' },
          data: {
            type: 'object',
            properties: {
              _id: { type: 'string' },
              username: { type: 'string' },
              password: { type: 'string' },
            },
          },
        },
        500: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
      },
    },
  },
};

export const signInUserOpts: RouteShorthandOptions = {
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          data: {
            type: 'object',
            properties: {
              _id: { type: 'string' },
              username: { type: 'string' },
              password: { type: 'string' },
            },
          },
        },
      },
      400: {
        type: 'object',
        properties: {
          message: { type: 'string' },
        },
      },
      500: {
        type: 'object',
        properties: {
          message: { type: 'string' },
        },
      },
    },
  },
};
